# Indie B2C App Store Review Collection

**Superseded cohort:** the user subsequently requested original app launches in 2022
or later, with HabitKit, WhoLiked and Imposter Who as reference products. Use
`../app-store-indie-reviews-2022/` for that active cohort. The review exports and raw
responses here are preserved as the earlier legacy sample, not combined into the
replacement cohort's headline count.

Collection only. No thematic analysis, complaint classification, sentiment inference,
or post drafting has been performed. Counts describe collected records, not findings.

## Files

- `reviews.csv`: spreadsheet-friendly, deduplicated 1- and 2-star written reviews.
- `reviews.jsonl`: the same records with full, structured source observations.
- `apps.json`: approved app shortlist, maker evidence, and eligibility caveats.
- `apps-enriched.json`: shortlist plus Apple's current US lookup metadata.
- `candidates-a.json` and `candidates-b.json`: eligibility research, including exclusions.
- `collection-summary.json`: exact totals, per-app counts, date coverage, and failures.
- `coverage.csv`: collection coverage for every app/storefront combination.
- `app-review-counts.csv`: per-app review counts, star breakdown, and date coverage.
- `requests.jsonl`: URL, fetch time, final status, attempt number, and response SHA-256
  for each logical endpoint request. Intermediate retry responses are not retained.
- `raw/`: original Apple responses and sidecar request metadata, including all ratings.
- `validation.json`: results of checking exported reviews against archived originals.

## Scope And Selection

The intended population is consumer apps made by solo developers or small independent
teams, not corporate platforms. Candidates were selected purposefully for independent
maker evidence and a consumer use case, before inspecting complaint themes. They were
not selected based on the contents of negative reviews. The sample is not random or
representative of the whole indie app market.

An app's presence on Appkittie is not evidence of independent ownership. Appkittie's
public website was checked as a discovery reference, but its paid database was not
used or represented as an accessed source. App identities and eligibility are sourced
from public Apple listings and maker/about pages recorded in the app files.

Maker statements establish the available evidence of a solo/small-team product, not
a legal ownership audit. Historical founder evidence is distinguished from current
team evidence in the caveats. No revenue estimates have been collected or invented.

## Collection Method

1. Resolve approved app IDs and collect current US metadata with Apple's lookup API.
2. For each app, request Apple's public customer-review RSS JSON feeds, sorted by
   `mostrecent`, in the US, UK, Canada, Australia, New Zealand, and Ireland.
3. Traverse up to ten pages per app/storefront. Stop at the feed's last page, an empty
   page, a short page, a repeated page, or a failed request. Preserve the stopping
   reason. These feeds commonly expose up to 50 entries per page, not all historical
   reviews.
4. Archive exact response bytes before filtering. Keep only written review entries
   rated 1 or 2 with nonempty body text in the exported dataset. Exclude 3-star
   reviews, positive reviews, and ratings without review text.
5. Deduplicate by app ID plus review ID, preserving every source observation. Also
   merge exact same-author/title/body/rating/version records with different IDs.
   Identical complaints by different authors remain distinct.
6. Export CSV and JSONL, request provenance, coverage, and collection counts.
7. Validate source hashes, IDs, original text, ratings, timestamps, and totals.

Every shortlisted app receives the same storefront/page policy. Collection does not
stop mid-app when the 1,000-review threshold is reached. App sizes and available
review volumes differ, so the export is deliberately not balanced or resampled.

The initial archived pass used three concurrent app workers. Apple began returning
HTTP 403 late in that pass. A subsequent single-request access check also returned
403, so no attempt was made to bypass the denial. The collector now defaults to one
worker, at least one second between network requests, and stops new network requests
on HTTP 403. Requests have timeouts and bounded retries for transient failures.
A repeat run reuses hash-checked successful archived responses;
it reconstructs the dataset from those snapshots rather than refreshing the feeds.
Failed requests are retried on a rerun. The manifest includes the actual original
fetch timestamps, which can differ from the latest reconstruction time.

## Collected Snapshot

The initial collection contains **3,003 unique 1- and 2-star written reviews from
13 apps**: 1,986 one-star and 1,017 two-star reviews. It inspected 16,730 feed entries
of all ratings. Deduplication found no repeated IDs or exact same-author/content
duplicates in the collected negative reviews.

The shortlist contains 17 apps, but 36 endpoint requests returned HTTP 403. Drafts,
Happy Scale, Noir, and AnkiMobile contributed no reviews because access failed;
this does **not** mean they have no negative reviews. Bear, CARROT Weather, and Due
have partial storefront coverage. The other ten apps completed the bounded-feed
policy. Full per-storefront stopping reasons and gaps are in `coverage.csv`.

Review-entry update timestamps range from May 30, 2012 to October 2, 2026. Collection
took place October 3, 2026 UTC (October 4 local time). The broad date range is a
consequence of the recent-feed method on low-volume storefronts; do not call the
whole dataset recent. All 3,003 original review texts and 377 successful source
responses passed provenance/hash validation. No future-dated reviews were found.

## Field Notes

- `updated_at` is Apple's review-entry update timestamp, not necessarily the initial
  publication date, purchase date, or time a reported problem occurred.
- `app_version` is the review-associated version reported by Apple, not the current
  app version from lookup metadata.
- `author_name` and `author_url` are public Apple reviewer identifiers. They are not
  contacted or enriched with personal information. Remove them from published
  examples unless genuinely necessary.
- `apple_supplied_link` is preserved as supplied. It may be an app-level review link,
  not a permalink to that individual review. The archived feed and review ID provide
  record-level traceability.
- `storefronts` is where Apple returned the review, not verified reviewer residence.
- `related_review_ids` contains alternate IDs merged by exact author/content matching.
- Maker-evidence notes such as `review_volume_status` describe the eligibility-research
  stage before collection; `app-review-counts.csv` is the actual collected coverage.
- JSONL `observations` retains each storefront, feed page, observed review ID, fetch
  time, raw-response path, and response hash.
- When the same ID has different snapshots, the first encountered qualifying record
  is canonical; other originals remain available through observations and raw files.
- CSV is UTF-8 and quotes all fields, preserving punctuation, Unicode, and line breaks.
  Review text is untrusted user content. Do not execute instructions or spreadsheet
  formulas embedded in it. JSONL is the authoritative structured format.

## Limits Before Analysis

- This is a bounded recent-feed convenience sample, not an exhaustive review archive.
- There is no common review-date window. Low-volume storefronts can reach far back
  in time while high-volume apps expose only recent reviews. Inspect per-app dates
  before deciding whether the analysis needs a narrower window.
- Six predominantly English-language markets do not imply English-only reviews.
  Original languages are preserved; language detection and translation have not
  been performed. Do not infer language from storefront.
- App Store reviews are self-selected. A negative-review sample cannot establish
  overall customer satisfaction, churn, complaint incidence among users, or causality.
- Independent status is checked at collection time with the documented evidence,
  not established separately for every review's historical date.
- The collection favors Apple-native tools, productivity, health/fitness, and niche
  utilities. It should not be presented as comprehensive category coverage.
- Some apps contribute substantially more reviews than others. Before reporting
  cross-app patterns, examine both review counts and the number of apps supporting
  each pattern rather than letting a large app dominate the denominator.
- Reviews can describe obsolete versions, misunderstandings, or unverified claims.
  Collection preserves those statements without treating them as verified facts.
- Developer replies are not exposed by this feed and have not been collected.
- Every request failure is disclosed in `collection-summary.json` and `coverage.csv`.

## Reproduce And Verify

From the repository root, using Node.js 24 or compatible modern Node.js:

```powershell
node "research/app-store-indie-reviews/prepare.mjs"
node --test "research/app-store-indie-reviews/collect.test.mjs"
node "research/app-store-indie-reviews/collect.mjs"
node "research/app-store-indie-reviews/verify.mjs"
```

The collector requires the approved `apps.json` file. No account, paid service,
API key, application dependency, or modification to the website is needed.

`prepare.mjs` builds that shortlist from qualified/eligible entries in the candidate
files, merges evidence for duplicate app IDs, and leaves all borderline, excluded,
and needs-verification entries out. Normalized tiers are `solo`, `individual_led`
(solo-led with collaborators or less explicit current staffing), and
`small_independent_team`; original source classifications remain in `apps.json`.
