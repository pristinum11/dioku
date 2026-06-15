# Current Feature

Dashboard UI — Phase 3 of 3. Implements the main content area to the right of the sidebar.

## Status

In Progress

## Goals

### Phase 3 — Main Content Area

- 4 stats cards at the top: total items, total collections, favorite items, favorite collections
- Recent collections section
- Pinned items section
- 10 most recent items section

## Notes

- Reference screenshot: `@context/screenshots/dashboard-ui-main.png`
- Import data directly from `@src/lib/mock-data.ts`
- Phase 3 spec: `@context/features/dashboard-phase-3-spec.md`
- Branch: `feature/dashboard-upgrade`

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

### Dashboard UI — Phase 2 · Completed 2026-06-15

Collapsible sidebar with item types, favorite/recent collections, and user avatar area.

- Collapsible desktop sidebar with `PanelLeft` toggle icon
- Item type links to `/items/TYPE` with per-type icon, color, and item count
- Favorites and Recent collections sections (collapsible)
- All Collections section (collapsible, collapsed by default)
- User avatar with name, email, and settings icon at the bottom
- Mobile: always-open Sheet drawer triggered from the top bar
- Branch: `feature/dashboard-phase-2`

### Prisma + Neon PostgreSQL Setup · Completed 2026-06-15

Configured the database layer with Prisma 7 ORM and Neon serverless PostgreSQL.

- Installed prisma@7, @prisma/adapter-neon, @neondatabase/serverless
- Full schema: User, Item, Collection, ItemType, Tag, NextAuth models, join tables, indexes, cascade deletes
- `prisma.config.ts` for Prisma 7 CLI (uses DIRECT_URL for migrations)
- `src/lib/prisma.ts` singleton with PrismaNeon adapter
- `scripts/test-db.ts` + `db:test` npm script for connection testing
- Initial migration applied to Neon development branch
- Branch: `feature/database-setup`
