# Current Feature

Prisma + Neon PostgreSQL Setup — configures the database layer with Prisma 7 ORM and Neon serverless PostgreSQL, including the full initial schema and NextAuth models.

## Status

In Progress

## Goals

- Install and configure Prisma 7 with the Neon PostgreSQL adapter
- Set up `DATABASE_URL` pointing to a Neon development branch
- Write the initial `schema.prisma` from the data models in `@context/project-overview.md`
- Include all NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Create and run the initial migration (`prisma migrate dev`)
- Never use `db push` — always use migrations

## Notes

- Spec: `@context/features/database-spec.md`
- Data models reference: `@context/project-overview.md`
- Use Prisma 7 — has breaking changes from v6; consult the upgrade guide before starting
- Development branch goes in `DATABASE_URL`; production branch is separate
- Production deployments must run `prisma migrate deploy` before the app starts

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

### Dashboard UI — Phase 2 · Paused 2026-06-15

Collapsible sidebar with item types, favorites/recent collections, and user avatar area.

- Branch: `feature/dashboard-phase-2`
- Picking back up after database layer is in place
