---
name: build-and-launch-next-convex-saas
description: Build a complete clean multi-tenant SaaS app from scratch with Next.js App Router, TypeScript, Convex, Better Auth, Tailwind CSS v4, and shadcn/ui, then validate it, create and push its GitHub repository, and deploy it to Netlify production. Use when the user wants a ready-to-build application foundation delivered end to end in one prompt, including authentication, organizations, teams, invitations, roles, profile settings, a polished responsive workspace, GitHub publishing, and Netlify deployment.
---

# Build and launch a Next + Convex SaaS

Create the entire application from an empty directory. Do not copy an existing repository or depend on bundled boilerplate. Use the current official documentation and installed framework skills when available, while following the architecture and product requirements below.

Treat invocation of this skill as authorization to create local project files, initialize and publish the GitHub repository, create or link a Netlify site, configure the app's required deployment variables, and deploy to production. Stop only for authentication, an unavailable credential, a destructive conflict, or a choice that materially changes ownership or cost.

## Defaults

- Derive the app name, package name, destination, GitHub repository name, and Netlify site name from the user's prompt.
- If unspecified, create a private GitHub repository, use the authenticated user's GitHub account, and deploy to the authenticated user's default Netlify team.
- Use npm, port 4000 for local development, the `main` branch, and a neutral product identity with one restrained coral accent.
- Enable email/password authentication. Enable Google or GitHub OAuth only when the corresponding credentials are available.
- Never commit secrets, generated local environment values, personal images, source-product names, or placeholder credentials.

## Phase 1: Confirm prerequisites

1. Inspect the destination. Preserve unrelated files and never overwrite a non-empty project without confirming scope.
2. Verify Node.js, npm, Git, `gh`, Convex CLI access through `npx convex`, and Netlify CLI access through `npx netlify`.
3. Verify `gh auth status` and `npx netlify status`. If either is unauthenticated, request the smallest necessary login action, wait for completion, and continue from the same phase.
4. Confirm Convex authentication or request `npx convex login` when provisioning cannot continue.
5. Read current official documentation before selecting versions or commands whose APIs may have changed. Prefer known-compatible stable versions and commit the lockfile.

## Phase 2: Create the project

Initialize a strict TypeScript Next.js App Router project with:

- React Server Components and the `@/*` path alias;
- Tailwind CSS v4 with tokens in `app/globals.css`;
- shadcn/ui using the neutral `radix-nova` style, CSS variables, and Lucide icons;
- Bricolage Grotesque through `next/font`;
- Convex with the local `@convex-dev/better-auth` component;
- Better Auth minimal server configuration and its organization plugin;
- `next-themes` or an equally small class-based light/dark provider;
- Sonner toasts and reusable native-form validity handling;
- ESLint, strict TypeScript, and production build scripts.

Create `.env.example`, `.gitignore`, `AGENTS.md`, `components.json`, `netlify.toml`, and concise project metadata. Do not create a README unless the user requests one.

Use these scripts:

```json
{
  "dev": "next dev -p 4000",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit"
}
```

## Phase 3: Implement authentication

Build the authentication system completely:

1. Configure Better Auth in `convex/auth.ts` with its Convex adapter, email/password, optional Google/GitHub providers, database rate limiting, profile updates, email changes, and trusted origins.
2. Add `convex/auth.config.ts`; without it Convex identity will not work.
3. Mount the local Better Auth component in `convex/convex.config.ts`, register routes in `convex/http.ts`, and keep its schema under `convex/betterAuth/`.
4. Generate Better Auth tables after configuring plugins. Keep custom indexes outside regenerated output.
5. Create the Next.js auth proxy at `app/api/auth/[...all]/route.ts`.
6. Create browser and server bridges: `lib/auth-client.ts`, `lib/auth-server.ts`, and a root `ConvexBetterAuthProvider` hydrated with an initial server token.
7. Build `/sign-in` and `/sign-up` as server-protected public routes with a focused form column and desktop-only brand panel.
8. Support email sign-up/sign-in, configured social sign-in, sign-out, expired-session redirect, duplicate-email errors, pending states, and profile name/email updates through Better Auth APIs.
9. Never query or patch Better Auth component tables directly from UI code.

Required environment variables:

```dotenv
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
BETTER_AUTH_SECRET=
SITE_URL=http://localhost:4000
```

Optional OAuth variables:

```dotenv
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Phase 4: Implement organizations and teams

Use Better Auth's organization plugin with teams and dynamic access control enabled.

Implement:

- automatic first-organization creation after sign-up;
- an idempotent signed-in fallback for social sign-in or interrupted onboarding;
- organization creation, switching, editing, avatar/logo, and deletion;
- member list, invitations, invitation cancel/accept/reject, member removal, and role changes;
- team create, rename, delete, member assignment, and team removal;
- built-in owner, admin, and member roles;
- custom role creation and permission selection;
- organization settings tabs for General, Members, Invitations, Teams, and Roles;
- account settings tabs for Profile and My invitations.

Extend Better Auth's default access statements with a product resource:

```ts
workspace: ["read", "update"]
```

Owners and admins may update the workspace; members may read it. Custom roles may select explicit permissions.

Protect invariants on the server:

- owners cannot be removed or demoted;
- an organization can be deleted only when its owner owns another organization;
- after deletion, activate a verified fallback organization;
- every organization-scoped backend function derives the signed-in identity and revalidates membership or permission;
- client-supplied user IDs never authorize access;
- active organization is stored by Better Auth and mirrored only as a SameSite=Lax preference cookie for server rendering.

Keep identity, membership, organization, invitation, team, and role records in the Better Auth component namespace. Keep product tables in the main Convex schema.

## Phase 5: Implement the clean product shell

Create these routes:

- `/` — minimal public landing page;
- `/sign-in`, `/sign-up`;
- `/privacy`, `/terms`;
- `/dashboard` — organization-scoped starter dashboard;
- `/organizations` — complete organization/team administration;
- `/settings` — account profile and invitations;
- `/help` — simple support page.

The authenticated route group must use a server layout that calls cached guards such as `requireUser`, `requireWorkspaceContext`, and `requireOrganization`. Load page data in Server Components and pass the smallest useful typed payload to focused Client Components.

Build a responsive shadcn-native workspace:

- collapsible desktop/mobile sidebar;
- organization switcher in the sidebar header;
- minimal navigation containing only real routes;
- user menu at the bottom with settings, invitation count, theme, and sign-out;
- centered command-palette search synchronized with real routes;
- compact top bar and quiet neutral surfaces;
- rounded-square organization and user avatars;
- persisted light, dark, and system themes;
- `text-xl` page headings, one muted description, and `gap-5` or `gap-6` sections;
- `max-w-4xl` for account settings and `max-w-6xl` for organization administration;
- horizontally contained data tables and purposeful cards only.

Use a small organization-scoped example resource such as `projects` to prove the extension pattern. Store `organizationId`, index queries by organization and ordering fields, validate membership in every query/mutation, bound list results, server-load the dashboard, and provide create/list behavior. Keep the example small enough to replace immediately.

## Phase 6: Complete every UX state

For each data-driven surface, implement all applicable states:

- route-matched loading skeleton;
- first-use empty state with a primary next action;
- filtered empty state when filtering exists;
- local pending state that prevents duplicate actions;
- success toast and refresh/navigation after confirmed success;
- recoverable error with retained input and retry path;
- permission-restricted/read-only state;
- long-name and long-email behavior;
- destructive confirmation dialog with consequences and typed confirmation;
- expired-session redirect.

Use native form validity, explicit dirty checks for edit forms, disabled invalid/pending submits, meaningful spinner labels, and a typed result union such as `{ ok: true, data } | { ok: false, error }` for UI-facing wrappers.

## Phase 7: Validate locally

Run and fix all failures:

```bash
npx convex codegen
npm run typecheck
npm run lint
npm run build
```

Run the app for functional verification when needed. Check sign-up, sign-in, sign-out, organization auto-creation, switching, invitations, members, teams, roles, permissions, profile changes, the example resource, unauthorized direct navigation, and cross-organization IDs.

Review desktop and mobile widths in light and dark themes. Check console errors, overflow, truncation, keyboard focus, dialogs, dropdowns, toasts, disabled states, and route transitions. Do not claim visual or functional verification without evidence.

## Phase 8: Publish to GitHub

1. Run `git status -sb` and inspect the complete scope.
2. Initialize Git when needed, set the default branch to `main`, and stage only project files. Confirm `.env*` secrets are ignored.
3. Commit with a terse message such as `Initialize <app name>`.
4. Create the repository with GitHub CLI using private visibility unless the user requested public:

```bash
gh repo create <repo-name> --private --source . --remote origin --push
```

5. If the repository already exists, verify its remote before pushing; never assume ownership from a name collision.
6. Verify the pushed commit and report the repository URL. A new standalone app does not need a pull request unless the user requests one.

## Phase 9: Provision Convex production and deploy Netlify

Use the authenticated Convex and Netlify accounts. Follow current official CLI output rather than assuming prompts.

1. Create or select the production Convex deployment and deploy backend functions.
2. Capture the production Convex cloud URL and site URL.
3. Create or link the Netlify site to the GitHub remote. Prefer Git-based linking; use `npx netlify init` when a site must be created.
4. Set build configuration in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"
```

5. Determine the final Netlify production URL.
6. Set Convex production variables: a strong unique `BETTER_AUTH_SECRET`, final `SITE_URL`, and configured OAuth credentials.
7. Set Netlify variables `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL` to the same production Convex deployment. Set any Next-runtime variables required by the implementation.
8. Never expose or echo secret values. Generate a secret securely when authorized; otherwise request it through the environment rather than chat.
9. Deploy a preview first when practical, smoke-test it, then deploy production:

```bash
npx netlify deploy
npx netlify deploy --prod
```

10. If changing `SITE_URL` or OAuth callback origins after learning the production URL, update them and redeploy so auth callbacks use the final domain.
11. Verify the production homepage, sign-in route, one authenticated flow when credentials permit, Netlify deploy logs, and Convex function health.

If continuous deployment was not established by Netlify's Git integration, configure it before completion or clearly report why it remains manual.

## Completion standard

Do not stop after scaffolding, local validation, pushing, or a preview deployment. The task is complete only when the app is implemented, validations pass, the GitHub repository is pushed, and the production Netlify deployment succeeds.

Return a concise handoff containing:

- local project path;
- architecture and included capabilities;
- validation commands and results;
- GitHub repository and commit URLs;
- Netlify production and deploy-log URLs;
- Convex production deployment identifier without secrets;
- any OAuth callback URLs the user must register;
- any exact check that could not be completed and why.
