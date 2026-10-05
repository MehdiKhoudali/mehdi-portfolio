# App Store reviews of newer indie consumer apps

Research snapshot: October 4, 2026. This page is the research record; the social post is being discussed separately.

## Verified collection

- **2,139 written 1- and 2-star reviews from 11 qualified apps**, representing nine maker groups. These consist of 1,739 one-star and 400 two-star records.
- **147 additional reviews from Imposter Who?**, kept separately because its identity and 2025 launch are verified but its small-team independence is unresolved.
- Combined archive: 2,286 unique written reviews; 1,854 one-star and 432 two-star.
- Thirteen apps were requested, including Party Bomb, which returned zero qualifying reviews in this bounded collection.
- All app listings originally released in 2022 or later. Review update dates span February 20, 2023 to October 2, 2026.
- Twenty storefronts covered uniformly; original-language text preserved.
- All 2,286 records and 532 successful raw responses passed source/hash checks; zero failed requests. Validation confirms Apple provenance, not the truth of every reviewer allegation.

## Apps and collected counts

<table header-row="true" fit-page-width="true">
	<tr><td>App</td><td>Original Apple release</td><td>Collected low-star reviews</td><td>Cohort</td></tr>
	<tr><td>[WhoLiked? - Guess Who Reposted](https://apps.apple.com/us/app/id6742410648)</td><td>2025-04-15</td><td>458</td><td>Qualified</td></tr>
	<tr><td>[Imposter Who? - Word Game](https://apps.apple.com/us/app/id6746781192)</td><td>2025-06-05</td><td>147</td><td>Separate; independence unverified</td></tr>
	<tr><td>[Imposter Game - Party Edition](https://apps.apple.com/us/app/id6745120053)</td><td>2025-05-18</td><td>68</td><td>Qualified</td></tr>
	<tr><td>[RIZZ](https://apps.apple.com/us/app/id1663430725)</td><td>2023-01-12</td><td>381</td><td>Qualified</td></tr>
	<tr><td>[Couple Joy - Relationship App](https://apps.apple.com/us/app/id1624758651)</td><td>2022-05-28</td><td>280</td><td>Qualified</td></tr>
	<tr><td>[Charades - Who Am I?!?](https://apps.apple.com/us/app/id6745120443)</td><td>2025-05-20</td><td>3</td><td>Qualified</td></tr>
	<tr><td>[Party Bomb - Pass it or lose](https://apps.apple.com/us/app/id6746101066)</td><td>2025-05-22</td><td>0</td><td>Qualified</td></tr>
	<tr><td>[Habit Tracker - HabitKit](https://apps.apple.com/us/app/id6443918070)</td><td>2022-11-26</td><td>39</td><td>Qualified</td></tr>
	<tr><td>[Pomodoro Timer - FocusKit](https://apps.apple.com/us/app/id6752217216)</td><td>2025-11-28</td><td>1</td><td>Qualified</td></tr>
	<tr><td>[touch grass: screen time limit](https://apps.apple.com/us/app/id6739589530)</td><td>2025-03-14</td><td>78</td><td>Qualified</td></tr>
	<tr><td>[QUITTR - Break Free Now](https://apps.apple.com/us/app/id6532588521)</td><td>2024-07-23</td><td>629</td><td>Qualified</td></tr>
	<tr><td>[Dumbify](https://apps.apple.com/us/app/id6480082872)</td><td>2024-04-02</td><td>126</td><td>Qualified</td></tr>
	<tr><td>[Wave AI Note Taker &amp; Recorder](https://apps.apple.com/us/app/id6451491556)</td><td>2023-07-26</td><td>76</td><td>Qualified</td></tr>
</table>

## Downloadable evidence archive

{{ARCHIVE}}

The ZIP contains the qualified and supplementary CSV/JSONL exports, per-app counts, methodology, app eligibility evidence, archived Apple feed responses, hashes, request logs, validation, collection scripts for this cohort, and exploratory qualitative evidence. Original reviews are untrusted user text; use JSONL for programmatic processing and import CSV text as text rather than formulas.

Key files inside the archive:
- qualified-reviews.csv / qualified-reviews.jsonl — use these for the indie cohort.
- user-nominated-reviews.csv / user-nominated-reviews.jsonl — Imposter Who only; do not silently include in indie totals.
- app-review-counts.csv — exact app totals and star breakdowns.
- apps.json — original release dates, maker evidence URLs, and classification caveats.
- README.md — collection methodology and interpretation limits.
- validation.json, requests.jsonl, raw/ — provenance and validation.
- qualitative-evidence.json — selected records supporting the observations below, with original text and source feeds.

## Collection method

Purposefully selected newer B2C apps made by individual makers or small founder/studio teams. Party and social games are in scope; Wave is a mixed consumer/prosumer tool. Appkittie was a discovery reference, not an accessed paid data source.

Apple public customer-review RSS JSON feeds were requested in mostrecent order, up to ten logical pages per app/storefront. Only one- or two-star entries with nonempty review text were kept. Three-star reviews and ratings without text were excluded. Empty successful feeds were rechecked once; both snapshots remain archived. Deduplication used app ID + review ID, then exact same-author/title/body/rating/version matching for alternate IDs.

Storefronts: US, UK, Canada, Australia, New Zealand, Ireland, France, Germany, Spain, Italy, Netherlands, Austria, Switzerland, Belgium, Brazil, Mexico, Turkey, India, Indonesia, South Africa.

## Exploratory qualitative observations

**Analysis status:** keyword screening across all 2,139 qualified records, with close reading of per-app samples and targeted examples. This is not exhaustive semantic coding of every review. Keyword matches retrieve candidates; they are not complaint counts. These observations are supported by examples across products where available, not ranked by prevalence.

### Payment timing and the chance to evaluate value

A price complaint can concern the timing of disclosure or an inability to evaluate the core benefit, as well as affordability. Disclose required payment and platform limits before lengthy setup or sensitive questions; test whether the evaluation experience demonstrates the benefit.

- [QUITTR - Break Free Now](https://apps.apple.com/gb/app/id6532588521) — 1 star; review ID 12444329523; updated 2025-03-20. Title: Pointless app based questionnaire. [Archived feed source](https://itunes.apple.com/gb/rss/customerreviews/page=2/id=6532588521/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [QUITTR - Break Free Now](https://apps.apple.com/au/app/id6532588521) — 1 star; review ID 12965282716; updated 2025-08-01. Title: Pay to use app, not free. [Archived feed source](https://itunes.apple.com/au/rss/customerreviews/page=1/id=6532588521/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [RIZZ](https://apps.apple.com/us/app/id1663430725) — 2 star; review ID 11137256999; updated 2024-04-08. Title: Yo to the developers. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=6/id=1663430725/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Wave AI Note Taker & Recorder](https://apps.apple.com/us/app/id6451491556) — 1 star; review ID 13134086879; updated 2025-09-13. Title: NOT FREE. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=1/id=6451491556/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Habit Tracker - HabitKit](https://apps.apple.com/fr/app/id6443918070) — 1 star; review ID 10100430683; updated 2023-07-03. Title: Il faut payer, comme d’habitude. [Archived feed source](https://itunes.apple.com/fr/rss/customerreviews/page=1/id=6443918070/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.

### Purchased access must survive the next session

Complaints about access after payment appear across different products, not only QUITTR. Treat reopening, signing in, restoring a purchase, opening a paid widget, and changing phones as part of the purchase journey. These examples do not establish a common technical cause.

- [QUITTR - Break Free Now](https://apps.apple.com/us/app/id6532588521) — 1 star; review ID 13487509073; updated 2025-12-07. Title: Don’t use. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=10/id=6532588521/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [QUITTR - Break Free Now](https://apps.apple.com/us/app/id6532588521) — 2 star; review ID 13800131483; updated 2026-02-28. Title: Ok app, but horrible reliability. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=5/id=6532588521/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Imposter Game - Party Edition](https://apps.apple.com/us/app/id6745120053) — 2 star; review ID 13932722535; updated 2026-04-07. Title: Very fun but…. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=6/id=6745120053/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Habit Tracker - HabitKit](https://apps.apple.com/br/app/id6443918070) — 1 star; review ID 13430341774; updated 2025-11-22. Title: Widgets need to be optimized. [Archived feed source](https://itunes.apple.com/br/rss/customerreviews/page=1/id=6443918070/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Habit Tracker - HabitKit](https://apps.apple.com/us/app/id6443918070) — 1 star; review ID 14519062888; updated 2026-09-06. Title: Widget is broken. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=1/id=6443918070/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Wave AI Note Taker & Recorder](https://apps.apple.com/us/app/id6451491556) — 1 star; review ID 12184821572; updated 2025-01-14. Title: Not usable. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=2/id=6451491556/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.

### The shared experience depends on every participant

For a multiplayer or couples app, successful use on one device is insufficient. A party can stall when one friend cannot connect; a couples quiz fails if only one partner can read it. Evaluate successful first shared activity, mixed platforms, and integration failures. This is an analyst inference from the reported experiences, not measured group churn.

- [Couple Joy - Relationship App](https://apps.apple.com/au/app/id1624758651) — 2 star; review ID 14597531741; updated 2026-09-26. Title: DOESNT WORK ON SOME PHONES. [Archived feed source](https://itunes.apple.com/au/rss/customerreviews/page=1/id=1624758651/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [WhoLiked? - Guess Who Reposted](https://apps.apple.com/us/app/id6742410648) — 1 star; review ID 13329597146; updated 2025-10-29. Title: upset. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=3/id=6742410648/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [WhoLiked? - Guess Who Reposted](https://apps.apple.com/fr/app/id6742410648) — 1 star; review ID 12604753043; updated 2025-04-30. Title: Ça marche pas. [Archived feed source](https://itunes.apple.com/fr/rss/customerreviews/page=6/id=6742410648/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [WhoLiked? - Guess Who Reposted](https://apps.apple.com/nz/app/id6742410648) — 2 star; review ID 14133949505; updated 2026-06-01. Title: Lag and game closing.. [Archived feed source](https://itunes.apple.com/nz/rss/customerreviews/page=1/id=6742410648/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [WhoLiked? - Guess Who Reposted](https://apps.apple.com/us/app/id6742410648) — 1 star; review ID 14578414321; updated 2026-09-21. Title: app refuses to work. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=1/id=6742410648/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.

### Content freshness is part of ongoing value

Reviewed examples describe repeated questions, words, roles, old videos, or generic output. Content renewal and replay variety can matter as much as new interface features. These examples do not establish retention or the financial viability of subscriptions.

- [Couple Joy - Relationship App](https://apps.apple.com/za/app/id1624758651) — 2 star; review ID 13738603306; updated 2026-02-11. Title: Good design poor question choice. [Archived feed source](https://itunes.apple.com/za/rss/customerreviews/page=1/id=1624758651/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Couple Joy - Relationship App](https://apps.apple.com/us/app/id1624758651) — 1 star; review ID 13960949133; updated 2026-04-15. Title: Distance is completely inaccurate. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=5/id=1624758651/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Imposter Game - Party Edition](https://apps.apple.com/de/app/id6745120053) — 2 star; review ID 12767131654; updated 2025-06-12. Title: Ausbaufähig. [Archived feed source](https://itunes.apple.com/de/rss/customerreviews/page=1/id=6745120053/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [WhoLiked? - Guess Who Reposted](https://apps.apple.com/us/app/id6742410648) — 2 star; review ID 13745972194; updated 2026-02-13. Title: old videos and glitches. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=2/id=6742410648/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [RIZZ](https://apps.apple.com/us/app/id1663430725) — 1 star; review ID 10819600414; updated 2024-01-13. Title: Start at the top now we’re here. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=9/id=1663430725/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.

### Reliability has a different cost at the moment of use

A lost recording, an app restriction that fails to release, or an OS change that breaks the intended minimalist appearance undermines the specific benefit people sought. Prioritize tests around that benefit and recovery: save recordings, recover accounts and purchases, and keep support reachable before login.

- [Wave AI Note Taker & Recorder](https://apps.apple.com/us/app/id6451491556) — 1 star; review ID 11640472685; updated 2024-08-22. Title: Terrible do not trust. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=3/id=6451491556/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Wave AI Note Taker & Recorder](https://apps.apple.com/us/app/id6451491556) — 2 star; review ID 11557365239; updated 2024-07-31. Title: Great concept but needs improvement. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=3/id=6451491556/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Dumbify](https://apps.apple.com/us/app/id6480082872) — 1 star; review ID 13611668790; updated 2026-01-08. Title: Worked well until iOS 26. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=1/id=6480082872/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [touch grass: screen time limit](https://apps.apple.com/us/app/id6739589530) — 1 star; review ID 14183745341; updated 2026-06-14. Title: it wouldn’t actually open my apps. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=1/id=6739589530/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [touch grass: screen time limit](https://apps.apple.com/us/app/id6739589530) — 1 star; review ID 12431443122; updated 2025-03-17. Title: Letdown. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=4/id=6739589530/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Wave AI Note Taker & Recorder](https://apps.apple.com/us/app/id6451491556) — 1 star; review ID 11637444597; updated 2024-08-21. Title: Major Fail. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=3/id=6451491556/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [QUITTR - Break Free Now](https://apps.apple.com/gb/app/id6532588521) — 1 star; review ID 13039110692; updated 2025-08-20. Title: Where is my lifetime membership. [Archived feed source](https://itunes.apple.com/gb/rss/customerreviews/page=1/id=6532588521/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.

### Low stars are not automatically complaint evidence

Some low-star records praise the product without a substantive complaint; others joke or complain about matters unrelated to product operation. Rating is the collection filter, not a reliable semantic label. Allegations of fraud, hacking, manipulation, or data breaches require independent verification and are not treated as established facts.

- [Couple Joy - Relationship App](https://apps.apple.com/us/app/id1624758651) — 1 star; review ID 13325380641; updated 2025-10-28. Title: OBSESSED. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=8/id=1624758651/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Couple Joy - Relationship App](https://apps.apple.com/us/app/id1624758651) — 1 star; review ID 13928114415; updated 2026-04-06. Title: Love ittt. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=5/id=1624758651/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Couple Joy - Relationship App](https://apps.apple.com/mx/app/id1624758651) — 1 star; review ID 14320469279; updated 2026-07-18. Title: Buena app. [Archived feed source](https://itunes.apple.com/mx/rss/customerreviews/page=1/id=1624758651/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.
- [Imposter Game - Party Edition](https://apps.apple.com/us/app/id6745120053) — 1 star; review ID 13813322430; updated 2026-03-04. Title: Worst game ever. [Archived feed source](https://itunes.apple.com/us/rss/customerreviews/page=7/id=6745120053/sortby=mostrecent/json). Full original text is in qualitative-evidence.json.

## Maker and eligibility sources

Qualified means inspected public sources support an individual maker or small founder/studio team, with no significant VC or completed corporate acquisition established in those sources. It is not a cap-table audit, and not every app is proven solo or bootstrapped.

### WhoLiked? - Guess Who Reposted

Maker: IRL Apps. Classification: small_independent_team; cohort: qualified.

- [Maker or release evidence](https://www.wholiked.com/about)
- [Maker or release evidence](https://www.linkedin.com/company/irl-apps/)

Small-team evidence is a public company LinkedIn profile, not an audited headcount or an explicit independence statement on its website. The profile also displays five associated employees.

Current Apple seller is IRL APPS and the product site names the same maker. No corporate acquisition or significant VC funding was established in inspected sources; beneficial ownership and financing are not conclusively verified. Do not call it proven bootstrapped.

The publisher is IRL Apps, not the unrelated historical venture-backed IRL social-network company. Do not transfer ownership or funding facts based on the shared IRL name.

The product uses TikTok videos, but is a separate party game, not TikTok itself. Website download counts and subscription claims have not been independently validated.

### Imposter Who? - Word Game

Maker: Sokak Technologies Inc.. Classification: unknown; cohort: user_nominated.

- [Maker or release evidence](https://imposterwho.com/)
- [Maker or release evidence](https://imposterwho.com/terms)
- [Maker or release evidence](https://sokak.io/)

Explicit user-nominated reference. Product identity and launch age are verified, but inspected maker pages do not establish team size, independent ownership, or financing. Reviews are retained in a separately labeled user-nominated group and not silently counted as verified indie evidence.

The correct product is the Sokak app on imposterwho.com, not Fakeout on imposterwho.app, nor other similarly named imposter games.

A LinkedIn company at /company/sokak/ identifies a Turkish agency on sokak.com.tr; no relationship to Sokak Technologies Inc. on sokak.io was verified, so its headcount is not used.

### Imposter Game - Party Edition

Maker: Sven Vucak / Vucak IT Solutions (Sven and David Vucak). Classification: small_independent_team; cohort: qualified.

- [Maker or release evidence](https://itunes.apple.com/lookup?id=6745120053)
- [Maker or release evidence](https://vucak.at)
- [Maker or release evidence](https://vucak.at/impressum)

Current official maker evidence supports a two-founder team, not a solo classification; funding and acquisition history not independently audited.

### RIZZ

Maker: TREND IT LLC; Joshua Miller and Roman Khaves. Classification: individual_led; cohort: qualified.

- [Maker or release evidence](https://itunes.apple.com/search?term=Rizz&entity=software&limit=5)
- [Maker or release evidence](https://www.rizz.app)
- [Maker or release evidence](https://www.linkedin.com/in/romankhaves/)

Bootstrapping is a founder self-report on an official-site-linked personal profile; exact current employee count unavailable. Individual-led classification does not imply solo development. Official /terms returned only an app shell in text fetch.

### Couple Joy - Relationship App

Maker: HEARTBIT S.R.L.. Classification: small_independent_team; cohort: qualified.

- [Maker or release evidence](https://itunes.apple.com/search?term=CoupleJoy&entity=software&limit=3)
- [Maker or release evidence](https://couplejoyapp.com/careers)
- [Maker or release evidence](https://www.forbes.ro/forbes-romania-30-sub-30-editia-2025-ioana-moraru-si-cosmin-andrei-anghel-couple-joy-love-at-scale-469987)

Forbes quote says built entirely with own resources and without external investment, as of October 2025; it also reports over 20 freelancers and planned hiring, so two-person core does not mean total workforce of two. Official terms identify HEARTBIT S.R.L. as IP owner; no acquisition established. Funding history not independently audited.

### Charades - Who Am I?!?

Maker: Sven Vucak / Vucak IT Solutions (Sven and David Vucak). Classification: small_independent_team; cohort: qualified.

- [Maker or release evidence](https://itunes.apple.com/lookup?id=6745120443)
- [Maker or release evidence](https://vucak.at)
- [Maker or release evidence](https://vucak.at/impressum)

Official maker site directly links this numeric Apple ID. Same maker as Imposter, not an additional independent maker. Funding and acquisition history not independently audited.

### Party Bomb - Pass it or lose

Maker: Sven Vucak / Vucak IT Solutions (Sven and David Vucak). Classification: small_independent_team; cohort: qualified.

- [Maker or release evidence](https://itunes.apple.com/lookup?id=6746101066)
- [Maker or release evidence](https://vucak.at)
- [Maker or release evidence](https://vucak.at/impressum)

Official maker site directly links this numeric Apple ID. Same maker as Imposter, not an additional independent maker. Funding and acquisition history not independently audited.

### Habit Tracker - HabitKit

Maker: Sebastian Roehl. Classification: solo; cohort: qualified.

- [Maker or release evidence](https://itunes.apple.com/lookup?id=6443918070&country=us)
- [Maker or release evidence](https://habitkit.app/about)

Prior maker evidence reused and official page rechecked live. Personal Apple seller matches maker; no corporate acquisition or significant VC established in inspected sources, not a cap-table audit.

### Pomodoro Timer - FocusKit

Maker: Sebastian Roehl. Classification: solo; cohort: qualified.

- [Maker or release evidence](https://itunes.apple.com/lookup?id=6752217216&country=us)
- [Maker or release evidence](https://habitkit.app/about)

Apple seller Sebastian Roehl matches the official maker. No complete financing or beneficial-ownership audit.

### touch grass: screen time limit

Maker: Rhys Kentish. Classification: solo; cohort: qualified.

- [Maker or release evidence](https://itunes.apple.com/lookup?id=6739589530&country=us)
- [Maker or release evidence](https://techcrunch.com/2025/03/17/this-app-limits-your-screen-time-by-making-you-literally-touch-grass/)

Correct maker surname is Kentish, not Kent. Solo statement is from launch reporting; current Apple personal seller still matches. Article says he was open to investors, not that funding occurred; later funding and ownership not conclusively audited.

### QUITTR - Break Free Now

Maker: Alex Slater and Connor McLaren / Quittr, LLC. Classification: small_independent_team; cohort: qualified.

- [Maker or release evidence](https://itunes.apple.com/lookup?id=6532588521&country=us)
- [Maker or release evidence](https://www.techtimes.com/articles/310068/20250420/bootstrapped-revolution-why-quittrs-anti-vc-approach-disrupting-mental-health-tech.htm)
- [Maker or release evidence](https://nymag.com/intelligencer/article/porn-addiction-app-quittr-alex-slater-connor-mclaren.html)

Qualified on bootstrapped founder-built origins plus March 2026 reporting of both active founders; exact current headcount and beneficial ownership are not audited. Tech Times has a promotional tone, so its no-VC claim is not treated as an audited financing disclosure.

New York describes an acquisition as a future aspiration, not completed ownership. Meeting via YC co-founder matching is not evidence of YC funding; investments mentioned in McLaren's earlier failed fitness app are not QUITTR financing. No significant VC or completed corporate acquisition established in inspected sources.

Official site/jobs requests failed. Health claims and product efficacy were not evaluated.

### Dumbify

Maker: Anthony Burkholder / AB Apps Inc.. Classification: solo; cohort: qualified.

- [Maker or release evidence](https://itunes.apple.com/lookup?id=6480082872&country=us)
- [Maker or release evidence](https://www.producthunt.com/products/dumbify)

Anthony attribution corroborated, not inferred from AB initials: Product Hunt links app ID 6480082872, identifies Anthony Burkholder as Maker, and carries his first-person build statement; Apple's bundle identifier independently matches his name.

Solo tier describes the publicly identified individual maker, not a verified current one-employee count. Seller remains AB Apps Inc.; financing and beneficial ownership are not audited. No significant VC or corporate acquisition established in inspected sources.

Search results for other Dumbify businesses/podcasts were not attributed to this app. The similarly named personal website was not used because its connection to this maker was unverified.

### Wave AI Note Taker & Recorder

Maker: Josh Mohrer / Mohrer Associates LLC. Classification: small_independent_team; cohort: qualified.

- [Maker or release evidence](https://wave.co/about)
- [Maker or release evidence](https://www.linkedin.com/company/waveapp-ai)

Official current about page says small team; its linked company profile reports one employee and Founded 2023. Those can distinguish principal staff from contractors; do not assert an audited current one-person workforce.

No significant VC funding or corporate acquisition was established in inspected sources. Self-Owned is a company-profile statement, not an independently audited cap table.

The app supports consumer lectures, personal conversations and doctor's appointments, but also professional meetings and team billing. Include as mixed consumer/prosumer, not an exclusively entertainment app.

Josh Mohrer's former Uber employment is not evidence that Uber owns this app.

## Interpretation limits

- This is a self-selected, international convenience sample of low-star reviews, not a measure of overall satisfaction, churn, prevalence among all users, or product efficacy.
- QUITTR, WhoLiked, and RIZZ contribute 1,468 of 2,139 qualified records (68.6%). Their volume must not be treated as eleven equally weighted apps. App count also differs from maker count.
- Dates are review-update timestamps, not necessarily first publication or incident dates. App histories and coverage windows vary.
- Apple feed provenance does not verify author identity, purchases, health outcomes, hacking allegations, data breach claims, or fraud. These claims have not been independently investigated here.
- Several low-star entries are positive, ambiguous, joking, or unrelated to product defects. Preserve them in the archive, but do not label all 2,139 as substantive complaints.
- The bounded feeds are not an exhaustive review archive. Zero collected is not proof of zero complaints.
- Earlier legacy-app research is preserved locally but excluded from this cohort and from these totals.
- No quantitative complaint-theme percentages or causal conclusions are claimed.
