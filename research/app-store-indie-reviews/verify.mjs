import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT, STOREFRONTS, csv, entriesFrom } from './collect.mjs';

const readJson = async path => JSON.parse(await readFile(join(ROOT, path), 'utf8'));
const readJsonl = async path => (await readFile(join(ROOT, path), 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse);
const apps = await readJson('apps.json');
const reviews = await readJsonl('reviews.jsonl');
const requests = await readJsonl('requests.jsonl');
const summary = await readJson('collection-summary.json');
const appIds = new Set(apps.map(app => String(app.app_id)));
const appById = new Map(apps.map(app => [String(app.app_id), app]));
assert.equal(appIds.size, apps.length, 'Duplicate app ids in shortlist');
if (summary.cohort_min_release_date) {
  for (const app of apps) {
    assert(Date.parse(app.release_date) >= Date.parse(summary.cohort_min_release_date), `App predates cutoff: ${app.app_name}`);
    assert(['qualified', 'user_nominated'].includes(app.eligibility), `App not approved for collection: ${app.app_name}`);
    assert(app.release_date_source, `Missing launch-date source: ${app.app_name}`);
  }
  const qualified = await readJsonl('qualified-reviews.jsonl');
  const nominated = await readJsonl('user-nominated-reviews.jsonl');
  assert.equal(qualified.length, summary.qualified_indie_reviews);
  assert.equal(nominated.length, summary.user_nominated_independence_unverified_reviews);
  assert.equal(qualified.length + nominated.length, reviews.length);
  assert.deepEqual(qualified, reviews.filter(review => review.eligibility === 'qualified'));
  assert.deepEqual(nominated, reviews.filter(review => review.eligibility === 'user_nominated'));
}
const raw = new Map();
for (const request of requests) {
  if (request.error || request.status !== 200) continue;
  const text = await readFile(join(ROOT, request.raw_path), 'utf8');
  const digest = createHash('sha256').update(text).digest('hex');
  assert.equal(digest, request.sha256, `Raw hash mismatch: ${request.raw_path}`);
  raw.set(request.raw_path, { payload: JSON.parse(text), digest, request });
}
const ids = new Set();
let observationsVerified = 0;
let snapshotVariants = 0;
for (const review of reviews) {
  const key = `${review.app_id}:${review.review_id}`;
  assert(!ids.has(key), `Duplicate review: ${key}`);
  ids.add(key);
  assert(appIds.has(review.app_id), `Unapproved app: ${review.app_id}`);
  if (summary.cohort_min_release_date) {
    assert.equal(review.release_date, appById.get(review.app_id).release_date);
    assert.equal(review.eligibility, appById.get(review.app_id).eligibility);
  }
  assert([1, 2].includes(review.rating), `Unexpected rating: ${key}`);
  assert(review.text.trim(), `Empty written review: ${key}`);
  assert(Number.isFinite(Date.parse(review.updated_at)), `Invalid date: ${key}`);
  assert(review.observations.length, `Missing provenance: ${key}`);
  for (const [index, observation] of review.observations.entries()) {
    assert(STOREFRONTS.includes(observation.storefront));
    const source = raw.get(observation.raw_path);
    assert(source, `Missing raw source: ${observation.raw_path}`);
    assert.equal(source.digest, observation.raw_sha256);
    assert.equal(source.request.url, observation.feed_url);
    assert.equal(String(source.request.app_id), review.app_id);
    assert.equal(source.request.storefront, observation.storefront);
    assert.equal(source.request.fetched_at, observation.fetched_at);
    const original = entriesFrom(source.payload).find(entry => String(entry.id.label) === observation.review_id);
    assert(original, `Review absent from source: ${key}`);
    assert([1, 2].includes(Number(original['im:rating'].label)));
    if (index === 0) {
      assert.equal(original.content.label, review.text, `Modified text: ${key}`);
      assert.equal(original.title?.label ?? '', review.title, `Modified title: ${key}`);
      assert.equal(Number(original['im:rating'].label), review.rating);
      assert.equal(original.updated.label, review.updated_at);
      assert.equal(original['im:version']?.label ?? '', review.app_version);
      assert.equal(original.author?.name?.label ?? '', review.author_name);
      assert.equal(original.author?.uri?.label ?? '', review.author_url);
    } else if (original.content.label !== review.text || Number(original['im:rating'].label) !== review.rating) {
      snapshotVariants++;
    }
    observationsVerified++;
  }
}
assert.equal(reviews.length, summary.unique_negative_reviews);
assert.equal(observationsVerified, summary.negative_review_observations);
assert.equal(summary.one_star + summary.two_star, reviews.length);
assert.equal(summary.per_app.reduce((sum, app) => sum + app.reviews, 0), reviews.length);
const dates = reviews.map(review => review.updated_at).sort();
const report = {
  verified_at: new Date().toISOString(), passed: true,
  unique_reviews_verified: reviews.length, source_observations_verified: observationsVerified,
  raw_responses_hash_verified: raw.size,
  original_review_text_preserved: true, only_one_and_two_star_written_reviews: true,
  repeated_review_snapshot_variants: snapshotVariants,
  earliest_review_updated_at: dates[0], latest_review_updated_at: dates.at(-1),
  future_dated_review_count: reviews.filter(review => Date.parse(review.updated_at) > Date.now()).length,
  over_1000_target_met: reviews.length > 1000,
  failed_request_count: summary.failed_requests.length,
  ...(summary.cohort_min_release_date ? {
    all_apps_launched_in_2022_or_later: true,
    qualified_indie_reviews: summary.qualified_indie_reviews,
    user_nominated_independence_unverified_reviews: summary.user_nominated_independence_unverified_reviews,
    qualified_indie_over_1000_target_met: summary.qualified_indie_reviews > 1000,
  } : {}),
};
await writeFile(join(ROOT, 'validation.json'), JSON.stringify(report, null, 2) + '\n');
await writeFile(join(ROOT, 'app-review-counts.csv'), csv(summary.per_app, [
  'app_id', 'app_name', 'maker', 'category', 'indie_tier', 'reviews', 'one_star', 'two_star',
  'earliest_review_updated_at', 'latest_review_updated_at',
  ...(summary.cohort_min_release_date ? ['release_date', 'eligibility'] : []),
]));
console.log(JSON.stringify(report, null, 2));
