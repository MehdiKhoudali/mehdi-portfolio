# Project Command Center — an opinionated work tracker

Build an original, polished project-management workspace called **Northstar**. It should feel like a tool a small product team would use every day: dense enough for real work, calm enough to scan, and quick to operate from the keyboard. This is a functional application task, not a static dashboard screenshot.

## Product direction

- Use a confident editorial layout with a warm light surface, charcoal text, thin dividers, and one restrained accent color. A dark mode is welcome but not required.
- Do not copy Linear, Notion, Jira, or another product's name, logo, icon set, or exact layout. Northstar should have its own identity.
- Seed the workspace with believable data so the first screen feels alive: at least two projects, eight issues, several statuses, labels, priorities, and assignees.
- Do not use external images, fonts, runtime network requests, analytics, or third-party embeds.

## Required workspace

Create a responsive single-page command center with:

1. A collapsible sidebar containing the Northstar wordmark, Inbox, My issues, Projects, a Favorites area, and workspace settings. Show useful counts for inbox and open work.
2. A main header with the current view name, breadcrumb/project context, search, filter/sort controls, a view switcher for list and board, and a primary “New issue” action.
3. A project overview strip or summary with project status, progress, target date, and a small activity/health signal. It should not overwhelm the issue list.
4. A list view with grouped issues or a compact table showing issue identifier, title, status, priority, labels, assignee, and updated time.
5. A board view with columns for the seeded statuses. Issues must be draggable between columns (with a keyboard-accessible alternative) and the status must update in state.
6. An issue detail drawer or modal that opens from an issue row/card. Include editable title, description, status, priority, assignee, labels, due date, activity/comments, and a close action that returns focus sensibly.

## Required behavior

- Create an issue from the primary action. Validate a non-empty title, assign a stable identifier, and place the issue in the selected project and initial status.
- Edit issue fields in the detail view and reflect changes immediately in the list, board, counts, and project progress.
- Drag an issue to another status column. Provide a visible drop target and a non-drag alternative such as a status menu in the detail view.
- Search across issue title, identifier, description, labels, project, and assignee. Add filters for status, priority, assignee, and label; make active filters obvious and removable.
- Switch between list and board views without losing filters. Sort the list by updated time, priority, or identifier.
- Support useful shortcuts: `c` to create, `/` to focus search, `Escape` to close the drawer, and arrow-key navigation where practical. Buttons must remain usable with a mouse and keyboard.
- Persist the workspace in localStorage under a stable key. Include a reset/demo-data action in settings or a menu so a reviewer can return to a deterministic seed.
- Show empty states for a project with no matching issues and a clear “clear filters” action. Include visible hover, focus, loading-free success, and destructive confirmation states.

## Responsive and accessibility requirements

- At 390 px, 768 px, and 1440 px wide there must be no horizontal page scrolling. The sidebar may collapse into a drawer, and the board may scroll inside its own bounded region, but the page itself must remain usable.
- Use semantic headings, buttons, labels, dialogs, and inputs. Manage focus when the issue drawer opens/closes, provide keyboard-visible focus, and respect `prefers-reduced-motion`.
- Maintain readable contrast and do not rely on color alone to communicate priority or status.

## Deterministic review hooks

Expose a small, documented diagnostic API on `window.__NORTHSTAR_COMMAND_CENTER__` for future automated review. It should include deterministic helpers such as `reset()`, `getState()`, `createIssue(input)`, `updateIssue(id, patch)`, `moveIssue(id, status)`, `setFilters(filters)`, `getVisibleIssues()`, and `save()`. The helpers must use the same state and persistence path as the UI and must not generate random identifiers.

## Technical constraints

- Use the provided React and Vite starter and only the dependencies already present in `package-lock.json`.
- Keep the implementation self-contained in the repository. Do not add authentication, a backend, realtime collaboration, or network-backed integrations.
- The production build must pass with `npm run build`, and `npm run verify` must continue to pass.
