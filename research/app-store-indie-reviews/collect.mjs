import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dataDir = process.argv.find(arg => arg.startsWith('--data-dir='))?.slice('--data-dir='.length);
export const ROOT = dataDir ? resolve(dataDir) : dirname(fileURLToPath(import.meta.url));
const policy = JSON.parse(await readFile(join(ROOT, 'cohort.json'), 'utf8').catch(error => {
  if (error.code === 'ENOENT') return '{}';
  throw error;
}));
export const STOREFRONTS = policy.storefronts ?? ['us', 'gb', 'ca', 'au', 'nz', 'ie'];
if (new Set(STOREFRONTS).size !== STOREFRONTS.length || STOREFRONTS.some(country => !/^[a-z]{2}$/.test(country))) {
  throw new Error('Invalid or duplicate storefronts in cohort policy');
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const hash = text => createHash('sha256').update(text).digest('hex');
const label = value => value?.label ?? '';
let accessDenied = false;

export function entriesFrom(payload) {
  const entries = payload?.feed?.entry;
  return (Array.isArray(entries) ? entries : entries ? [entries] : [])
    .filter(entry => entry['im:rating'] && entry.id && entry.content);
}

export function normalizeReview(entry, app, observation) {
  return {
    app_id: String(app.app_id), app_name: app.app_name, maker: app.maker,
    category: app.category, indie_tier: app.indie_tier,
    ...(app.release_date ? { release_date: app.release_date, eligibility: app.eligibility } : {}),
    review_id: String(label(entry.id)), rating: Number(label(entry['im:rating'])),
    title: label(entry.title), text: label(entry.content),
    updated_at: label(entry.updated), app_version: label(entry['im:version']),
    author_name: label(entry.author?.name), author_url: label(entry.author?.uri),
    helpful_vote_sum: Number(label(entry['im:voteSum'])) || 0,
    helpful_vote_count: Number(label(entry['im:voteCount'])) || 0,
    apple_supplied_link: entry.link?.attributes?.href ?? '',
    observations: [observation], related_review_ids: [],
  };
}

export function deduplicate(reviews) {
  const byId = new Map();
  const byContent = new Map();
  let duplicateIds = 0;
  let duplicateContent = 0;
  for (const review of reviews) {
    const idKey = `${review.app_id}:${review.review_id}`;
    // Same text by different reviewers remains distinct, including short complaints.
    const contentKey = hash(JSON.stringify([
      review.app_id, review.author_url || review.author_name,
      review.title, review.text, review.rating, review.app_version,
    ]));
    const idMatch = byId.get(idKey);
    const contentMatch = review.author_url || review.author_name ? byContent.get(contentKey) : undefined;
    const existing = idMatch || contentMatch;
    if (existing) {
      existing.observations.push(...review.observations);
      if (idMatch) duplicateIds++;
      else {
        duplicateContent++;
        existing.related_review_ids.push(review.review_id);
      }
      byId.set(idKey, existing);
    } else {
      byId.set(idKey, review);
      byContent.set(contentKey, review);
    }
  }
  return { reviews: [...new Set(byId.values())], duplicateIds, duplicateContent };
}

export function csv(rows, fields) {
  const escape = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [fields.map(escape).join(','), ...rows.map(row =>
    fields.map(field => escape(row[field])).join(','))].join('\r\n') + '\r\n';
}

async function cachedRequest(url, stem) {
  const rawPath = join(ROOT, 'raw', `${stem}.json`);
  const metaPath = join(ROOT, 'raw', `${stem}.meta.json`);
  try {
    const metadata = JSON.parse(await readFile(metaPath, 'utf8'));
    if (metadata.status === 200) {
      const text = await readFile(rawPath, 'utf8');
      if (hash(text) !== metadata.sha256) throw new Error('Cached response hash mismatch');
      return { payload: JSON.parse(text), metadata };
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (accessDenied) return {
    metadata: { url, fetched_at: null, status: null, attempt: 0, requested: false },
    error: 'Not requested: Apple returned HTTP 403 earlier in this run',
  };
  await mkdir(dirname(rawPath), { recursive: true });
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    await sleep(1000);
    const fetchedAt = new Date().toISOString();
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'IndieAppReviewResearch/1.0', Accept: 'application/json' },
        signal: AbortSignal.timeout(25000),
      });
      const text = await response.text();
      const metadata = {
        url, resolved_url: response.url, fetched_at: fetchedAt,
        status: response.status, attempt, sha256: hash(text),
        raw_path: relative(ROOT, rawPath).replaceAll('\\', '/'),
        content_type: response.headers.get('content-type'),
      };
      await writeFile(rawPath, text, 'utf8');
      await writeFile(metaPath, JSON.stringify(metadata, null, 2) + '\n');
      if (response.ok) {
        const payload = JSON.parse(text);
        return { payload, metadata };
      }
      lastError = { metadata, error: `HTTP ${response.status}` };
      if (response.status === 403) accessDenied = true;
      if (response.status !== 429 && response.status < 500) return lastError;
      const retryAfter = Number(response.headers.get('retry-after'));
      await sleep(Math.min(60000, retryAfter > 0 ? retryAfter * 1000 : attempt * 5000));
    } catch (error) {
      lastError = { error: error.message, metadata: { url, fetched_at: fetchedAt, status: null, attempt } };
      await writeFile(metaPath, JSON.stringify(lastError, null, 2) + '\n');
      await sleep(attempt * 2000);
    }
  }
  return lastError;
}

export async function collect() {
  accessDenied = false;
  const apps = JSON.parse(await readFile(join(ROOT, 'apps.json'), 'utf8'));
  const ids = process.argv.find(arg => arg.startsWith('--app-ids='))?.split('=')[1]?.split(',');
  const selected = ids ? apps.filter(app => ids.includes(String(app.app_id))) : apps;
  if (!selected.length) throw new Error('No approved apps selected');
  if (policy.min_release_date && selected.some(app => !(Date.parse(app.release_date) >= Date.parse(policy.min_release_date)))) {
    throw new Error('An app is missing its launch date or predates the cohort cutoff');
  }
  const startedAt = new Date().toISOString();
  const requests = [];
  const observations = [];
  const coverage = [];
  const enrichedApps = [];
  let next = 0;
  async function worker() {
    while (next < selected.length) {
      const app = selected[next++];
      const lookupUrl = `https://itunes.apple.com/lookup?id=${app.app_id}&country=us`;
      const lookup = await cachedRequest(lookupUrl, `lookup/${app.app_id}-us`);
      requests.push({ ...lookup.metadata, error: lookup.error ?? null, kind: 'lookup', app_id: app.app_id });
      const listing = lookup.payload?.results?.find(item => String(item.trackId) === String(app.app_id));
      if (app.release_date && listing && Date.parse(listing.releaseDate) !== Date.parse(app.release_date)) {
        throw new Error(`Launch date differs from Apple metadata: ${app.app_name}`);
      }
      enrichedApps.push({ ...app, apple_listing: listing ?? null, lookup_source: lookup.metadata });
      for (const storefront of STOREFRONTS) {
        const seen = new Set();
        let pages = 0;
        let fetchedEntries = 0;
        let negativeEntries = 0;
        let emptyPageRechecks = 0;
        let recoveredEmptyPages = 0;
        let stopReason = 'public_feed_page_limit';
        let error = null;
        for (let page = 1; page <= 10; page++) {
          const url = `https://itunes.apple.com/${storefront}/rss/customerreviews/page=${page}/id=${app.app_id}/sortby=mostrecent/json`;
          let result = await cachedRequest(url, `reviews/${app.app_id}/${storefront}-${page}`);
          requests.push({ ...result.metadata, error: result.error ?? null, kind: 'reviews', app_id: app.app_id, storefront, page });
          if (result.error) { stopReason = 'request_failed'; error = result.error; break; }
          if (!result.payload?.feed) { stopReason = 'invalid_feed'; error = 'Missing feed object'; break; }
          let entries = entriesFrom(result.payload);
          if (!entries.length) {
            // Apple sometimes returns an empty HTTP-200 feed transiently. Keep both snapshots.
            const originalPath = result.metadata.raw_path;
            result = await cachedRequest(url, `reviews/${app.app_id}/${storefront}-${page}-empty-recheck`);
            emptyPageRechecks++;
            requests.push({ ...result.metadata, error: result.error ?? null, kind: 'reviews_empty_recheck',
              app_id: app.app_id, storefront, page, recheck_of: originalPath });
            if (result.error) { stopReason = 'request_failed'; error = result.error; break; }
            if (!result.payload?.feed) { stopReason = 'invalid_feed'; error = 'Missing feed object'; break; }
            entries = entriesFrom(result.payload);
            if (entries.length) recoveredEmptyPages++;
          }
          pages++;
          if (!entries.length) { stopReason = 'empty_page_rechecked'; break; }
          fetchedEntries += entries.length;
          let newEntries = 0;
          for (const entry of entries) {
            const reviewId = String(label(entry.id));
            if (!seen.has(reviewId)) newEntries++;
            seen.add(reviewId);
            const rating = Number(label(entry['im:rating']));
            if (![1, 2].includes(rating) || !label(entry.content).trim()) continue;
            negativeEntries++;
            observations.push(normalizeReview(entry, app, {
              storefront, page, review_id: reviewId, feed_url: url,
              app_store_url: `https://apps.apple.com/${storefront}/app/id${app.app_id}`,
              fetched_at: result.metadata.fetched_at,
              raw_path: result.metadata.raw_path, raw_sha256: result.metadata.sha256,
            }));
          }
          if (!newEntries) { stopReason = 'repeated_page'; break; }
          if (entries.length < 50) { stopReason = 'short_page'; break; }
          const lastUrl = result.payload.feed.link?.find(link => link.attributes?.rel === 'last')?.attributes?.href;
          const lastPage = Number(lastUrl?.match(/page=(\d+)/)?.[1]);
          if (lastPage && page >= lastPage) { stopReason = 'last_page'; break; }
          await sleep(200);
        }
        coverage.push({ app_id: app.app_id, app_name: app.app_name, storefront, pages,
          fetched_entries: fetchedEntries, unique_review_ids_all_ratings: seen.size,
          negative_observations: negativeEntries, empty_page_rechecks: emptyPageRechecks,
          recovered_empty_pages: recoveredEmptyPages, stop_reason: stopReason, error });
      }
      console.log(`${app.app_name}: ${coverage.filter(row => row.app_id === app.app_id).reduce((n, row) => n + row.negative_observations, 0)} negative observations`);
    }
  }
  await worker();
  const deduped = deduplicate(observations);
  const reviews = deduped.reviews.sort((a, b) => a.app_id.localeCompare(b.app_id) || a.review_id.localeCompare(b.review_id));
  const csvRows = reviews.map(review => ({ ...review,
    storefronts: [...new Set(review.observations.map(observation => observation.storefront))].join('|'),
    observation_count: review.observations.length,
    feed_urls: [...new Set(review.observations.map(observation => observation.feed_url))].join('|'),
    raw_paths: [...new Set(review.observations.map(observation => observation.raw_path))].join('|'),
    first_collected_at: review.observations.map(observation => observation.fetched_at).sort()[0],
    related_review_ids: review.related_review_ids.join('|'),
  }));
  const perApp = selected.map(app => {
    const rows = reviews.filter(review => review.app_id === String(app.app_id));
    const dates = rows.map(review => review.updated_at).filter(Boolean).sort();
    return { app_id: app.app_id, app_name: app.app_name, maker: app.maker,
      category: app.category, indie_tier: app.indie_tier, reviews: rows.length,
      ...(app.release_date ? { release_date: app.release_date, eligibility: app.eligibility } : {}),
      one_star: rows.filter(review => review.rating === 1).length,
      two_star: rows.filter(review => review.rating === 2).length,
      earliest_review_updated_at: dates[0] ?? null,
      latest_review_updated_at: dates.at(-1) ?? null };
  });
  const summary = {
    run_started_at: startedAt, run_finished_at: new Date().toISOString(),
    source: 'Apple public customerreviews RSS JSON feeds, sortby=mostrecent',
    storefronts: STOREFRONTS, max_pages_per_app_storefront: 10,
    approved_apps_requested: selected.length, apps_with_negative_reviews: perApp.filter(app => app.reviews).length,
    total_feed_entries_observed_all_ratings: coverage.reduce((n, row) => n + row.fetched_entries, 0),
    negative_review_observations: observations.length, unique_negative_reviews: reviews.length,
    duplicate_id_observations_removed: deduped.duplicateIds,
    duplicate_author_content_observations_removed: deduped.duplicateContent,
    one_star: reviews.filter(review => review.rating === 1).length,
    two_star: reviews.filter(review => review.rating === 2).length,
    failed_requests: requests.filter(request => request.error), per_app: perApp,
    empty_page_rechecks: coverage.reduce((n, row) => n + row.empty_page_rechecks, 0),
    recovered_empty_pages: coverage.reduce((n, row) => n + row.recovered_empty_pages, 0),
    ...(selected.some(app => app.release_date) ? {
      cohort_min_release_date: policy.min_release_date ?? '2022-01-01T00:00:00Z',
      qualified_indie_reviews: reviews.filter(review => review.eligibility === 'qualified').length,
      user_nominated_independence_unverified_reviews: reviews.filter(review => review.eligibility === 'user_nominated').length,
    } : {}),
  };
  const jsonl = rows => rows.map(row => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : '');
  await writeFile(join(ROOT, 'reviews.jsonl'), jsonl(reviews));
  const reviewFields = [
    'app_id', 'app_name', 'maker', 'category', 'indie_tier', 'review_id', 'rating', 'title', 'text',
    'updated_at', 'app_version', 'author_name', 'author_url', 'helpful_vote_sum', 'helpful_vote_count',
    'storefronts', 'observation_count', 'apple_supplied_link', 'feed_urls', 'raw_paths',
    'first_collected_at', 'related_review_ids',
    ...(selected.some(app => app.release_date) ? ['release_date', 'eligibility'] : []),
  ];
  await writeFile(join(ROOT, 'reviews.csv'), csv(csvRows, reviewFields));
  if (summary.cohort_min_release_date) {
    for (const [group, eligibility] of [['qualified-reviews', 'qualified'], ['user-nominated-reviews', 'user_nominated']]) {
      await writeFile(join(ROOT, `${group}.jsonl`), jsonl(reviews.filter(review => review.eligibility === eligibility)));
      await writeFile(join(ROOT, `${group}.csv`), csv(csvRows.filter(review => review.eligibility === eligibility), reviewFields));
    }
  }
  await writeFile(join(ROOT, 'coverage.csv'), csv(coverage, [
    'app_id', 'app_name', 'storefront', 'pages', 'fetched_entries',
    'unique_review_ids_all_ratings', 'negative_observations', 'empty_page_rechecks', 'recovered_empty_pages', 'stop_reason', 'error',
  ]));
  await writeFile(join(ROOT, 'requests.jsonl'), jsonl(requests));
  await writeFile(join(ROOT, 'apps-enriched.json'), JSON.stringify(enrichedApps, null, 2) + '\n');
  await writeFile(join(ROOT, 'collection-summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify({ unique_reviews: reviews.length, apps: summary.apps_with_negative_reviews,
    one_star: summary.one_star, two_star: summary.two_star, failures: summary.failed_requests.length }));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  collect().catch(error => { console.error(error); process.exitCode = 1; });
}
