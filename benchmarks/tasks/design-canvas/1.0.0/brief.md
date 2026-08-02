# Design Canvas — a small, serious design tool

Build a polished, original mini design editor called **Mosaic**. This is a coding task about interaction quality and state management, not a static mockup. A reviewer should be able to open the app, place a few objects on a canvas, select and transform them, and return later to the same document.

## Product direction

- Make the interface feel like a focused professional tool: dark chrome, quiet borders, one clear accent, and excellent spacing.
- Do not copy Figma branding, logos, or exact visual treatment. Use the Mosaic name and your own visual language.
- Keep the first viewport useful at desktop widths while making the core canvas usable on a narrow screen.
- Do not use external images, fonts, runtime network requests, analytics, or third-party embeds.

## Required workspace

Create a single-page editor with these regions:

1. A top bar with the Mosaic wordmark, document name, undo/redo controls, zoom controls, a save indicator, and an export action.
2. A left tool rail with pointer/select, rectangle, ellipse, text, image placeholder, and frame tools. Every tool must have a tooltip or accessible label and a visible active state.
3. A central canvas with a subtle grid or dot field. It must support panning, zooming, a visible page/artboard, and objects rendered from application state.
4. A right inspector with position/size fields, rotation, fill, border, opacity, and corner radius for the selected object. Include a layers list with visibility controls and reordering affordances.
5. A compact bottom status area showing the current selection, canvas zoom, and a short keyboard-shortcut hint.

Seed the document with a restrained example composition so the product is understandable on first load. The seed may include a frame, a text block, a card, and a couple of geometric accents.

## Required behavior

- Add objects with the toolbar tools. Rectangle, ellipse, text, image placeholder, and frame must create real objects in the scene.
- Select one object, multi-select with Shift, move it by dragging, resize it with handles, and rotate it with a rotation affordance or inspector field. Keep selection bounds clear.
- Edit the selected object from the inspector. Changes should be reflected on the canvas immediately and remain after reload.
- Rename layers and change their visibility. The selected layer and selected object must stay in sync.
- Duplicate and delete selected objects. Support sensible keyboard shortcuts: Delete/Backspace, Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z (or Cmd/Ctrl+Y), and Cmd/Ctrl+D.
- Pan the canvas by dragging empty space or holding Space; zoom with controls and a wheel/pinch-friendly gesture. Never trap keyboard focus in the canvas.
- Export the document as JSON and provide a PNG or SVG export affordance. A browser-download data URL is sufficient; it must work without a server.
- Show an unsaved/saved status when edits occur and persist the document in localStorage under a stable key.
- Include an empty-state or helpful message when no object is selected, plus visible hover and focus states throughout.

## Responsive and accessibility requirements

- At 390 px, 768 px, and 1440 px wide there must be no horizontal page scrolling. Collapse the inspector and tool labels gracefully on small screens while leaving the canvas and essential controls usable.
- Use semantic buttons and inputs, accessible names, keyboard focus styles, and sensible tab order. Respect `prefers-reduced-motion`.
- Keep text readable and maintain strong contrast in both the chrome and the canvas.

## Deterministic review hooks

Expose a small, documented diagnostic API on `window.__MOSAIC_CANVAS__` for future automated review. It should provide deterministic helpers such as `reset()`, `getDocument()`, `addObject(type)`, `select(id)`, `updateObject(id, patch)`, `undo()`, `redo()`, `save()`, and `exportJSON()`. The helpers may delegate to the same state actions used by the UI; they must not bypass persistence or create random data.

## Technical constraints

- Use the provided React and Vite starter and only the dependencies already present in `package-lock.json`.
- Keep the implementation self-contained in the repository. Canvas rendering may use regular DOM/SVG/CSS; a heavy graphics library is unnecessary.
- The production build must pass with `npm run build`, and `npm run verify` must continue to pass.
