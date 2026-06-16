# Current Feature

None — no feature in progress.

## Status

Idle

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

### Database Seed Script · Completed 2026-06-15

Populates the Neon development database with realistic sample data.

- Demo user: `demo@devstash.io`, password hashed with bcryptjs (12 rounds)
- 7 system item types seeded (snippet, prompt, command, note, file, image, link)
- 5 collections with 18 items total: React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources
- Idempotent — safe to re-run via `npm run db:seed`
- Branch: `feature/seed-data`

### Dashboard UI — Phase 3 · Completed 2026-06-15

Main content area to the right of the sidebar.

- 4 stats cards: total items, total collections, favorite items, favorite collections
- Collections grid sorted by most recently updated, with dominant-type left border, type icons, and favorite star
- Pinned items section with type-colored cards, tags, and dates
- 10 most recent items section (excluding pinned)
- Components: `StatsCards`, `CollectionCard`, `ItemCard`, `DashboardMain`
- Branch: `feature/dashboard-phase-3`

### Dashboard Collections · Completed 2026-06-16

Wired up real database data for the collections grid on the dashboard.

- Created `src/lib/db/collections.ts` with Prisma data fetching functions
- Fetched collections directly in server component (no mock data)
- Collection card border color derived from most-used content type in the collection
- Small type icons rendered on each collection card
- Stats cards now use live database counts
- Branch: `feature/dashboard-collections`
