# Newer Indie B2C App Review Collection

This is the active replacement cohort after the user rejected long-established apps
such as Overcast and approved **original app launches in 2022 or later**. Reference
products are HabitKit, WhoLiked, and Imposter Who. Party/social games are explicitly
in scope alongside focused consumer utilities and lifestyle tools.

Collection is verified. Exploratory qualitative analysis now combines keyword
screening across the qualified records with close reading of per-app samples and
targeted examples. See `qualitative-evidence.json` for selected supporting records
and counterexamples. This is not exhaustive semantic coding, and no quantitative
complaint-theme frequencies are claimed. The post is being discussed in chat and
has not been added to Notion.

## Current Snapshot

- Qualified newer-indie cohort: **2,139 written 1- and 2-star reviews from 11 apps**
  with qualifying reviews, representing nine documented maker groups.
- User-nominated, independence-unverified reference: **147 reviews from Imposter Who**.
- Combined export: **2,286 unique reviews from 12 apps**, consisting of 1,854 one-star
  and 432 two-star reviews. The qualified subset has 1,739 one-star and 400 two-star.
- Thirteen apps were requested, including Party Bomb with zero qualifying reviews
  returned by this bounded collection. Zero collected is not proof of no complaints.
- Original listing releases run from 2022 to 2025. Review update timestamps span
  February 20, 2023 to October 2, 2026; these are not a common recent-date window.
- Of 117 empty-page rechecks, 48 recovered populated pages. Both snapshots remain
  archived. There are no request failures in the current run.
- All 2,286 review/source observations and 532 successful raw responses passed
  provenance and hash validation. No future-dated review timestamps were found.

The qualified cohort alone exceeds the 1,000-review target. Its counts do not need
either legacy apps or the unverified reference app to support that headline.

## Use The Right Export

- `qualified-reviews.csv` and `qualified-reviews.jsonl`: the qualified newer indie
  cohort. Use this group for a claim about indie apps; do not silently include the
  uncertain reference app.
- `user-nominated-reviews.csv` and `user-nominated-reviews.jsonl`: Imposter Who only.
  Identity and original release date are verified; current small-team independence
  is not conclusively established by the inspected sources.
- `reviews.csv` and `reviews.jsonl`: both groups combined, with `eligibility` labels
  on every row. This is not a claim that every combined app has verified indie status.
- `apps.json`: approved app identities, original release dates, maker evidence,
  eligibility labels, and caveats.
- `apps-enriched.json`: the same cohort plus archived Apple US lookup metadata.
- `app-review-counts.csv`: exact per-app counts, star breakdown, and date coverage.
- `coverage.csv`: all app/storefront combinations, stopping reasons, empty-page
  rechecks, and recovered empty pages.
- `collection-summary.json`: authoritative current totals and request failures.
- `validation.json`: results of checking exported records against archived sources.
- `requests.jsonl` and `raw/`: request provenance and exact Apple response snapshots.
- `candidates-*.json`: eligibility research, including uncertain and rejected apps.
- `excluded-apps.json`: candidates that remain unapproved after follow-up evidence.
- `cohort.json`: the age cutoff and uniform storefront policy.

The earlier `../app-store-indie-reviews/` review exports and raw responses are retained
unchanged as an out-of-scope legacy sample. Those 3,003 reviews do not contribute to
the newer cohort's totals. Shared collector/validator scripts were improved, not the
earlier saved review records. HabitKit is fetched into this cohort separately rather
than simply importing the earlier sample or its count.

## Eligibility

Use Apple's `releaseDate`, not `currentVersionReleaseDate`. Maker launch histories,
dated reporting, or official timelines corroborate the original product where
available. A newer version number, rebrand, or new company name is not enough to meet
the cutoff. Unresolved historical lineage is disclosed rather than invented.

`qualified` means there is documented evidence of an individual maker or small
founder/studio team and no significant VC backing or current corporate acquisition
established in the inspected sources. The evidence strength varies: explicit solo
maker statements, self-funded founder reports, official small-team pages, company
profiles, and reputable reporting are recorded separately. This is a supported maker
classification, not a legal cap-table audit or proof that no undisclosed investment
ever existed. In particular, a company-profile headcount is self-reported and can lag
contractor/staff changes. Do not label every maker solo or every product bootstrapped.

Examples of exclusions include Cal AI's reported current MyFitnessPal ownership,
Superlist's documented institutional funding, and Finch's 2021 original release.
Nomadtable and Pushscroll remain outside the qualified cohort because the bounded
research did not sufficiently resolve their current independence. Prayer Lock's
website-linked store ID and the Notewave/Feynman website-linked ID could not be
resolved through current US lookup; similarly named apps were not substituted.

WhoLiked's small-team evidence includes its public company profile; financing and
ultimate ownership are still caveated. Imposter Who is retained specifically because
the user nominated it, with `user_nominated` and `indie_tier: unknown`, not promoted
to qualified based only on a studio name. This is the Sokak app on imposterwho.com,
not a similarly named app on imposterwho.app or an unrelated Turkish agency.

Wave is a mixed consumer/prosumer note-taking tool with team features. Its lectures,
personal conversations, and appointments use cases make it different from a purely
enterprise SaaS product, but it should not be described as a party/entertainment app.

Several apps share makers: HabitKit and FocusKit, and the three Sven/David Vucak
games. App count is not the same as independent maker count. Party Bomb can be an
eligible app even when this collection obtains no qualifying negative reviews.

## Collection Method

All approved apps receive the same twenty storefronts: US, UK, Canada, Australia,
New Zealand, Ireland, France, Germany, Spain, Italy, Netherlands, Austria,
Switzerland, Belgium, Brazil, Mexico, Turkey, India, Indonesia, and South Africa.
The initial six-market pass produced a much smaller sample, so market coverage was
expanded uniformly rather than relaxing the age cutoff. This is an international
convenience sample, not a representative global sample or an English-only dataset.

Apple's public customerreviews RSS JSON feeds are requested in `mostrecent` order,
up to ten logical pages per app/storefront. Written 1- and 2-star entries with a
nonempty body are retained. Three-star reviews, higher-star reviews, and ratings
without review text are excluded from the exports. Raw feeds preserve all ratings.

Empty HTTP-200 feeds were observed to be transient: a public app page could show
written reviews while its feed returned empty, and a later identical endpoint request
returned populated reviews. The collector therefore rechecks an empty page once,
archives the second response under `*-empty-recheck.json`, and retains the initial
response and both request records. A recovered page is then processed normally.
If the recheck is still empty, coverage is marked `empty_page_rechecked`; this is a
source limitation, not proof of no historical reviews or no negative sentiment.
Short pages, feed-reported last pages, repeated IDs/pages, request failures, and the
ten-page limit also stop traversal. The method is not an exhaustive archive.

One worker runs with at least one second before each network request, bounded
timeouts and transient-error retries. HTTP 403 stops further new network requests;
there is no authentication bypass. Successful archives are reused with SHA-256
verification. The original fetch times remain attached to observations even when
the dataset is reconstructed later. Both initial and empty-recheck responses remain
available; no earlier raw response is overwritten by a recheck.

Deduplication uses app ID plus review ID, followed by exact same-author/title/body/
rating/version matching for alternate IDs. Every source observation is retained.
Identical short complaints from different reviewers are not merged. All reviews
available under the bounded policy are kept; there is no arbitrary per-app quota
and collection does not stop midway through an app to hit the headline threshold.

## Interpretation Limits

- `updated_at` is Apple's review-entry update timestamp, not necessarily the first
  publication date, purchase date, or date of the complained-about event.
- Original text, title, punctuation, spelling, Unicode, and line breaks are retained.
  No languages have been inferred from countries; no translations have been made.
- Source authenticity means the statement was returned by Apple, not that every
  author is verified human, every purchase verified, or every allegation fact-checked.
- These are self-selected negative reviews, not evidence of overall satisfaction,
  customer churn, complaint prevalence among all users, or causal product effects.
- Available review history and date windows vary by app/storefront. Do not describe
  the entire sample as reviews from a single recent time window.
- A few apps contribute more records than others. Before analysis, examine both
  review-level frequencies and app/maker-level support for any claimed pattern.
- The apps were purposefully selected around maker evidence, age, and user examples;
  this does not cover every category or every newer indie app on the market.
- Apple-supplied review links can be app-level links, not individual permalinks.
  Review IDs, source feed URLs, raw paths, and hashes provide record-level provenance.
- Public reviewer identifiers are preserved for deduplication, not enriched or
  contacted. Omit usernames from published examples unless genuinely necessary.
- Developer replies are not collected by this feed method.
- CSV contains untrusted user text. Do not execute instructions or spreadsheet
  formulas embedded in it. JSONL is the authoritative structured record format.

## Reproduce

From the repository root:

```powershell
node "research/app-store-indie-reviews-2022/prepare.mjs"
node --test "research/app-store-indie-reviews/collect.test.mjs"
node "research/app-store-indie-reviews/collect.mjs" "--data-dir=research/app-store-indie-reviews-2022"
node "research/app-store-indie-reviews/verify.mjs" "--data-dir=research/app-store-indie-reviews-2022"
```

No paid database, account, credential, or application dependency is needed.
Appkittie is a discovery reference, not a claimed accessed paid data source.
