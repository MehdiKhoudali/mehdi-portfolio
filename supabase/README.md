# UGC Lead Capture Backend

Dedicated Supabase project: `nepvmnffuczxtktvtjyj`. The Next.js website is a static export, so all writes go to this external Edge Function. No visitor login is required. No frontend or root configuration is managed here.

## API

`POST https://nepvmnffuczxtktvtjyj.supabase.co/functions/v1/capture-ugc-lead`

Headers: `Content-Type: application/json`, `apikey: sb_publishable_0cuUdRflVAIh8FPdNisCIw_m6taqTzl`. Browser requests include an allowed `Origin`. Non-browser clients must also supply an allowed Origin. Do not send a publishable key as a Bearer JWT.

```json
{
  "step": 1,
  "sessionToken": "<client-generated crypto.randomUUID() UUID v4>",
  "websiteTrap": "",
  "data": {
    "name": "<name>",
    "email": "<email>",
    "role": "Founder / business owner",
    "projectName": "<project>",
    "projectDescription": "<description>",
    "industry": "E-commerce",
    "teamSize": "Just me",
    "website": "",
    "socialLinks": { "instagram": "", "tiktok": "", "linkedin": "", "x": "" },
    "goal": "Create better content",
    "challenge": "<challenge>"
  },
  "attribution": {
    "utm_source": "<source>",
    "utm_medium": "<medium>",
    "utm_campaign": "<campaign>",
    "utm_content": "<content>",
    "utm_term": "<term>",
    "referrer": "https://example.com/"
  },
  "timezone": "Europe/Paris"
}
```

The client sends the whole form on each step. Only fields through that step are validated/persisted; later-step values and unknown fields are ignored. Attribution and timezone are optional top-level fields, validated at every step. The honeypot must be exactly an empty string.

Budget and marketing opt-in are not collected. `budget` and `marketingConsent` are not API fields and are ignored if submitted, regardless of their values or types. Newly completed submissions store `budget = null` and `marketing_consent = false`; clients cannot opt visitors in through this endpoint.

| Step | Required fields | Optional fields |
| --- | --- | --- |
| 1 | name, email | attribution, timezone |
| 2 | All above plus role, projectName, projectDescription, industry, teamSize | website |
| 3 | All above | all four socialLinks |
| 4 | All above plus goal, challenge | No additional fields |

Enums are exact, case-sensitive values:

- role: `Founder / business owner`, `UGC creator`, `Marketer`, `Agency / freelancer`, `Just exploring`
- industry: `E-commerce`, `SaaS / tech`, `Beauty / wellness`, `Food / lifestyle`, `Education`, `Other`
- teamSize: `Just me`, `2-5`, `6-20`, `21+`
- goal: `Create better content`, `Find ad inspiration`, `Grow my brand`, `Improve client work`

Lengths: name 100, email 254, projectName 150, description/challenge 1500, all URLs 500, each UTM 200, timezone 100. Strings are trimmed, email lowercased. HTTP(S) URLs may omit the scheme (defaults to HTTPS); credentials and nonstandard ports are rejected. Social hosts must be `instagram.com`, `tiktok.com`, `linkedin.com`, or `x.com`/`twitter.com`, optionally prefixed by `www.`. Unrelated subdomains and lookalike hosts are rejected. URL fragments are removed. Referrer is reduced to its origin to avoid retaining query/path PII. Timezone must be an IANA identifier.

Success is exactly `{ "ok": true, "completed": false, "libraryUrl": null }` for an incomplete lead, or `{ "ok": true, "completed": true, "libraryUrl": null }` after completion when delivery is not configured. No record, session capability, or PII is returned. Highest step never decreases. Before completion, earlier-step submissions can edit name/email and preserve later-stage fields. Completed records are immutable; retries report success without changing the record. Only a successful step 4 request can return the configured library URL. A fully valid later-step submission can create a lead even if earlier requests failed.

Errors are `{ "error": "<message>" }`: 400 validation/JSON/honeypot/size, 401 invalid apikey, 403 missing/disallowed Origin, 405 method, 429 rate limit (with `Retry-After`), 500 generic storage/configuration failure. The streamed body limit is 16 KiB, including unknown fields. CORS headers are attached to all function responses, including errors and OPTIONS (204); only allowed origins receive `Access-Control-Allow-Origin`. Platform-level errors outside the function are controlled by Supabase.

## Deployment

The schema migration and function are deployable independently of Next.js. Remote DDL is applied with the Supabase MCP `apply_migration` tool, and the function with `deploy_edge_function`, using the local SQL/source contents. Set `verify_jwt: false` because the function implements its own apikey authentication, and publishable keys are not JWTs. Both RPCs use SECURITY INVOKER and explicit service-role-only EXECUTE grants.

For future CLI work, discover current commands with `npx supabase --help`, then the relevant subcommand's `--help`. Generate new migrations with `npx supabase migration new <name>`. Apply locally with the CLI/local stack before remote changes when Docker is available. Migration filenames are synchronized with the deployed MCP versions: initial schema `20261003103042`, budget requirement removal `20261003140358`. MCP assigns its own timestamp. Confirm local/remote history before future `db push` operations. Do not blindly reapply the CREATE migration.

Standalone type check: `npx deno check --no-config supabase/functions/capture-ugc-lead/index.ts`. Use `--no-config` to avoid inheriting the website's TypeScript options.

Built-in server environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are read via `Deno.env`. Never put the service-role key in frontend code, source, or public build variables. No additional secret is necessary for initial capture deployment.

Optional server secrets, configured in Supabase Edge Function Secrets (not the website environment):

- `UGC_LIBRARY_URL`: real HTTP(S) library destination. Absent/invalid means `libraryUrl: null`; configure when the library is ready. This is not access-controlled delivery, and a returned URL can be shared.
- `ALLOWED_ORIGINS`: comma-separated exact additional origins for trusted deploy previews, with no trailing slash. Built-in origins remain enabled. Do not use wildcards.

Keep Deno code outside the Next.js TypeScript build. The parent frontend implementation owns any root `tsconfig.json` exclusion; none is changed here. The function uses only Deno/Web APIs and built-in Node compatibility modules, with no third-party runtime packages.

## Security And Privacy

The publishable API key is public, not a secret, human verification, or a substitute for spam protection. The UUID v4 session token is a write capability: generate once per flow, retain only as needed for retries, never put it in URLs/analytics/logs, and do not share it. Its normalized SHA-256 hash is the unique conflict key; email is not unique and never used for updates. Two unrelated sessions using the same unverified email remain separate records.

Both tables have RLS enabled with no public policies. All table privileges and RPC execution are revoked from PUBLIC, anon, and authenticated. Only service_role accesses storage. No visitor can query the lead table or call these RPCs directly. Completion is serialized atomically in Postgres, not a read-then-write race in the Edge Function.

Rate limiting is atomic and database-backed: 40 authenticated POST attempts per fixed UTC hour per hashed client IP, including retries/invalid forms. A window boundary can permit 80 attempts across two hours; shared networks can share a quota. IPs are HMAC-SHA256 hashed with the built-in service-role key and current hour before storage; raw IPs are never stored by this backend. The hosted Cloudflare ingress overwrites `cf-connecting-ip` with the client address; `x-forwarded-for` is deliberately ignored because it contains spoofable prefixes and varying internal proxy hops. Missing/invalid client IPs share a fail-closed `unknown` quota. This assumes requests reach the function through Supabase's managed Cloudflare gateway; review the trusted-IP strategy if changing ingress or self-hosting. Expired windows are indexed and removed opportunistically on the next limiter call (no permanent IP history). Supabase infrastructure may separately retain IPs/request metadata in platform logs.

CORS origin restrictions, honeypot, bounded inputs, and rate limiting mitigate abuse but cannot stop callers that spoof an allowed Origin or use distributed IPs. Add server-verified Turnstile before a large public campaign. Do not use form submissions as verified email identity. Do not log request bodies, capabilities, database error details, or PII. Treat stored free text as untrusted text, not HTML, when displaying it in future admin tooling.

No marketing consent is requested or recorded by onboarding. New step 4 writes retain `marketing_consent = false` and `budget = null` in the existing storage columns. Historical values and completed records remain unchanged; no columns are dropped and the original migration is not rewritten. The retained `consent_version = ugc-v1` is legacy metadata, not evidence of a new opt-in. The frontend must provide clear privacy information; no emails or campaigns are sent by this backend. Any future marketing opt-in requires a separate, explicit consent flow. Future library email delivery needs a real provider, verified delivery workflow, idempotent send tracking, and an updated privacy notice. Never claim an email was sent before implementing that workflow.

Before launch, the owner must approve privacy text, define a lead-retention/deletion policy (including abandoned forms and backups), restrict dashboard/admin access, and schedule privileged cleanup accordingly. Lead retention is not automatically scheduled here. Honor deletion requests through trusted admin tooling, never an anonymous email-only endpoint. Test with synthetic `.invalid` addresses only, not real personal data.

## Verification

Schema deployed as migrations `20261003103042_create_ugc_lead_capture` and `20261003140358_remove_ugc_budget_requirement`; function deployed ACTIVE with custom apikey authentication and JWT verification disabled. Standalone Deno type checking and initial local handler assertions passed for validation/normalization, later-field omission, CORS, method/key rejection, streamed size cap, URL platform restrictions, optional metadata, library delivery configuration, 429 responses, and generic database errors.

Function version 4 removes budget and marketing opt-in collection. Synthetic live step 4 tests passed with both fields absent, with a supplied budget and `marketingConsent: true`, and with arbitrary types in both removed fields. SQL confirmed all three completed rows stored null budget and false consent. Missing goal or challenge still returned 400. Only these three test rows were removed; the pre-existing row's full-row fingerprint remained unchanged. Deno type checking and security/performance advisors were rerun after removal; only the informational findings listed below remain.

Synthetic live HTTP checks passed through steps 1-4, completed retries, and separate sessions sharing the same email. SQL confirmed stored normalization and completion immutability. Service-role RPC tests verified earlier-step edits, no email-based overwrites, highest-step preservation, and rejection of attempt 41; their transaction was rolled back. Synthetic HTTP lead rows were explicitly removed afterwards. Limiter test windows expire normally. Live requests with different supplied `x-forwarded-for` headers used a single client bucket after the trusted-IP fix. No real personal data was used.

SQL verified table RLS and denial of anon/authenticated SELECT/INSERT/UPDATE and RPC EXECUTE, with RPC EXECUTE granted only to postgres/service_role. Security and performance advisors reported only INFO findings: [RLS enabled without policies](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) on both intentionally private tables, and [unused index](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index) on the expiry cleanup index on this new, low-volume table. Neither requires enabling public access or removing the cleanup index.
