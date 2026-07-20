# AFTERLIGHT - festival of moving image, sound, and digital culture

Create an exceptional, production-ready single-page website for **AFTERLIGHT**, a fictional three-day festival of moving image, experimental sound, performance, and digital culture in Marrakech.

This is a creative-development task, not a conventional marketing-page exercise. The finished site should feel distinctive enough to be considered for Awwwards-style recognition: confident art direction, memorable typography, expressive interaction, excellent pacing, and meticulous responsive execution. It must still be usable, accessible, and fast.

The visitor should understand the festival, explore its programme, and feel compelled to reserve a pass.

## Fixed event content

- Name: AFTERLIGHT
- Theme: **Between signal and shadow**
- Dates: **18-20 October 2026**
- Location: **Marrakech, Morocco**
- Venue: **Dar Atlas, Sidi Ghanem**
- Primary action: **Reserve a pass**
- Secondary action: **Explore the programme**
- Festival statement: **Three nights for images that move, sound that surrounds, and ideas that stay after the light is gone.**

Use these fictional programme entries:

1. **Nora Chraibi - Memory Is a Material** / Moving image / 18 Oct / 20:30
2. **Sonic Cartographies - Field Notes from the Atlas** / Sound / 18 Oct / 22:00
3. **Lina Benjelloun - Soft Machines** / Digital performance / 19 Oct / 19:30
4. **Studio Nadir - Synthetic Suns** / Installation / 19 Oct / 21:00
5. **Youssef Amrani - The City Dreams in Loops** / Moving image / 20 Oct / 20:00
6. **Kite Ensemble - Air Has a Memory** / Live performance / 20 Oct / 22:30

## Creative direction

- Establish one clear visual concept and carry it through the entire experience.
- Use typography, composition, contrast, rhythm, and motion as primary design materials.
- Aim for an editorial, cultural, contemporary tone with a strong sense of place; do not imitate a generic technology or SaaS website.
- The experience may be minimal, maximal, typographic, cinematic, or experimental, but every choice should feel intentional and coherent.
- Create original visual material in code when it supports the concept. Abstract graphics, canvas, CSS, and SVG are allowed, but decoration must serve the idea rather than fill empty space.
- Avoid generic purple gradients, glassmorphism, bento-card layouts, stock dashboard patterns, excessive pill-shaped controls, and template-like section stacking.
- Do not copy an existing studio, festival, or award-site design.

## Required experience

### Opening sequence and navigation

- A memorable first viewport containing the AFTERLIGHT name, theme, dates, Marrakech location, and a clear Reserve a pass action.
- Navigation linking to Manifesto, Programme, Schedule, Visit, and Passes.
- A functional mobile navigation pattern.
- An optional short opening transition is welcome, but it must not delay access to content or replay on every interaction.

### Manifesto

- Use the supplied festival statement as the central copy.
- Add one concise supporting paragraph explaining that AFTERLIGHT brings artists and audiences together across film, sound, performance, and digital practice.
- Treat this as an editorial moment, not a standard icon-and-copy feature section.

### Programme

- Present all six supplied programme entries with artist, title, discipline, date, and time.
- Provide functional filters for **All**, **Moving image**, **Sound**, **Performance**, and **Installation**. Digital performance may appear under Performance.
- Include at least one meaningful interactive reveal: expandable details, a preview panel, an overlay, or an equivalent keyboard-accessible treatment.
- Invent short, credible descriptions for the entries when needed.

### Schedule

- Organize the three festival days so visitors can quickly understand what happens on 18, 19, and 20 October.
- Day selection or another schedule interaction must work with mouse and keyboard.

### Visit and passes

- Present Dar Atlas, Sidi Ghanem, Marrakech as the venue.
- Include practical fictional information: doors at 18:30, programme ends at 00:30, venue is wheelchair accessible, and a festival shuttle leaves the city centre every 30 minutes.
- Present two pass options:
  - Single night - 280 MAD
  - Full festival - 680 MAD
- Reserve a pass actions must lead to a meaningful destination or visible confirmation state; do not leave them as inert controls.

### Closing and footer

- End with a strong closing composition that repeats AFTERLIGHT, the dates, and the reservation action without simply duplicating the opening layout.
- Include contact, Instagram, accessibility, and programme links with meaningful destinations.

## Motion and interaction requirements

- Use motion as part of the visual concept: transitions, scrolling rhythm, hover states, kinetic type, or reactive composition.
- At least two distinct motion or transition patterns must be visible in the main experience.
- Motion must remain smooth and must not make text difficult to read.
- Respect `prefers-reduced-motion` with a usable low-motion experience.
- Every visible control must work. Include clear hover, active, and keyboard-focus states.
- Do not replace the system cursor in a way that reduces usability.

## Responsive and accessibility requirements

- The layout must work without horizontal scrolling at 390 px, 768 px, and 1440 px widths.
- Mobile should feel intentionally recomposed, not merely scaled down.
- Use semantic landmarks and a sensible heading hierarchy.
- Programme filters, navigation, expandable content, schedule controls, and reservation actions must be keyboard accessible.
- Maintain readable contrast and avoid flashing or unsafe rapid animation.
- Keep body copy readable even when display typography is experimental.

## Technical constraints

- Use the provided React and Vite starter.
- Use only dependencies already present in `package-lock.json`.
- Keep all source code and visual assets self-contained in the repository.
- Do not make network requests at runtime.
- Do not use external image URLs, external fonts, analytics, third-party embeds, or remote APIs.
- The production build must pass with `npm run build`.

## What will be reviewed

- Strength, originality, and consistency of the visual concept.
- Typography, composition, color, image-making, and detail craft.
- Quality and purpose of motion and interaction.
- Fidelity to the fixed content and functional requirements.
- Responsive behavior, accessibility, and technical reliability.
- Whether the result feels authored and culturally credible rather than generated from a common landing-page template.
