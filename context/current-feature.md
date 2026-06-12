# Current Feature

Dashboard UI — Phase 2 of 3. Implements the collapsible sidebar with item types, favorite/recent collections, and user avatar area.

## Status

In Progress

## Goals

- Collapsible sidebar with toggle icon
- Item type links to `/items/TYPE` (e.g. `/items/snippets`)
- Favorites collections section
- Most recent collections section
- User avatar area at the bottom of the sidebar
- Always a drawer on mobile view

## Notes

- Reference screenshot: `@context/screenshots/dashboard-ui-main.png`
- Import data directly from `@src/lib/mock-data.ts`
- Phase 1 established the sidebar placeholder — replace `<h2>Sidebar</h2>` with the real component
- Phase 3 spec: `@context/features/dashboard-phase-3-spec.md`

## History

<!-- Keep this updated, earliest to latest -->

### Dashboard UI — Phase 1 · Completed 2026-06-12

Sets up the foundation: ShadCN, global layout, dark mode, top bar, and route scaffolding.

- Initialized ShadCN UI with Tailwind v4 support; added Button, Input, lucide-react
- Created dashboard route at `/dashboard`
- Dark mode by default via `dark` class on `<html>`
- Top bar with logo, search input + ⌘K badge, New Collection and New Item buttons (display only)
- Placeholder sidebar and main area
- Branch: `feature/dashboard-phase-1`