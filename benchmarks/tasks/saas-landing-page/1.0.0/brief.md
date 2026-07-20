# Relay — project operations for client teams

Build a polished, production-ready landing page for **Relay**, a fictional SaaS product that helps agencies and product studios plan projects, coordinate client approvals, and deliver work on time.

The goal is to convince an operations lead at a 10–50 person client-services company to start a free trial.

## Brand direction

- Relay should feel calm, capable, editorial, and modern—not playful or overly futuristic.
- Use a warm neutral foundation with one confident accent color.
- Typography should have a strong display hierarchy and highly readable body copy.
- Avoid generic purple gradients, excessive rounded cards, stock illustrations, and decorative dashboard clutter.
- The page must look intentionally designed at desktop and mobile sizes.

## Required page structure

### Navigation

- Relay wordmark.
- Links to Product, Workflow, Pricing, and FAQ sections.
- Secondary “Sign in” action.
- Primary “Start free” action.
- A functional mobile navigation pattern.

### Hero

- Eyebrow: “Project operations for client teams”.
- Headline communicating that Relay keeps projects, feedback, and approvals moving.
- Supporting copy explaining the product in concrete language.
- Primary CTA: “Start a free trial”.
- Secondary CTA: “See how it works”.
- A credible product-interface composition that demonstrates project health, an approval waiting for review, and upcoming delivery milestones.

### Trust and outcomes

- A concise customer-logo or customer-name row using fictional companies.
- Three outcome metrics:
  - 31% fewer status meetings
  - 2.4× faster client approvals
  - 96% of milestones delivered on time

### Product features

Explain and visually distinguish these capabilities:

1. One operational view for every client project.
2. Structured feedback and approval checkpoints.
3. Delivery signals that surface risk before deadlines slip.

### Workflow

Show a clear three-step process:

1. Import or create a project plan.
2. Invite the team and client stakeholders.
3. Track work, approvals, and delivery signals in one place.

### Pricing

- A functional monthly/annual billing toggle.
- Three tiers: Studio, Agency, and Network.
- Agency should be the recommended plan.
- Annual billing should visibly reduce the displayed monthly-equivalent price.
- Include realistic feature differences and one CTA per plan.

### FAQ

- At least four relevant questions.
- Functional accordion behavior.
- Include questions about client access, integrations, onboarding, and cancellation.

### Final CTA and footer

- Restate the core value in a concise closing section.
- Include “Start a free trial”.
- Footer navigation for Product, Company, Resources, Legal, and social links.

## Interaction and quality requirements

- Every navigation anchor and CTA must have a meaningful destination or action.
- The pricing toggle, FAQ accordion, and mobile menu must work with mouse and keyboard.
- Include visible hover and focus states.
- Use semantic HTML and sensible heading order.
- Maintain readable contrast and respect `prefers-reduced-motion`.
- The layout must work without horizontal scrolling at 390 px, 768 px, and 1440 px widths.
- Do not make network requests at runtime.
- Do not use external image URLs, external fonts, analytics, or third-party embeds.

## Technical constraints

- Use the provided React and Vite starter.
- Use only the dependencies already present in `package-lock.json`.
- Keep the implementation self-contained in the repository.
- The production build must pass with `npm run build`.
