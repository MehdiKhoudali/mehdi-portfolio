# Mehdi Khoudali Portfolio

Personal portfolio for Mehdi Khoudali, built with Next.js, TypeScript, and Tailwind CSS.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the site.

## UGC Lead Magnet

The landing page is at `/ugc-library`. Four short onboarding steps save name/email,
work details, optional social links, and goals to the dedicated `ugc-leads` Supabase
project. Each successful step is saved independently, including incomplete leads.
The form keeps its draft in memory, not persistent browser storage.

The final author introduction is shared across pages through `AuthorIntro`. It
includes the portrait, biography, newsletter link, and its responsive styles:

```tsx
import { AuthorIntro } from "@/components/author-intro";

<AuthorIntro />
```

Netlify's build configuration includes `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Set these in the build environment when
using another host. Local development uses `.env.local`. These are public
client configuration, never a service-role key. Rebuild static exports after
changing these variables. See `supabase/README.md` for backend deployment,
security, and delivery configuration.

Library delivery is intentionally pending. Configure `UGC_LIBRARY_URL` in Supabase
Edge Function Secrets when the real destination is available. Until then, the form
honestly confirms a saved request without claiming access or an email delivery.
Before a public campaign, approve the privacy copy, establish a retention policy,
and add server-verified Turnstile. No email campaign is sent by this implementation.

## Checks

```bash
npm run lint
npm run build
```
