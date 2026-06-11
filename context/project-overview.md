# Dioku — Project Overview

> **One fast, searchable, AI-enhanced hub for all dev knowledge & resources.**

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Target Users](#target-users)
3. [Core Features](#core-features)
4. [Item Types](#item-types)
5. [Data Models & Prisma Schema](#data-models--prisma-schema)
6. [Architecture Diagram](#architecture-diagram)
7. [Tech Stack](#tech-stack)
8. [UI/UX Guidelines](#uiux-guidelines)
9. [Monetization](#monetization)
10. [AI Features](#ai-features)
11. [Key Links & Resources](#key-links--resources)

---

## Problem Statement

Developers scatter their essential resources across a dozen tools:

| Resource | Where it lives |
|---|---|
| Code snippets | VS Code, Notion |
| AI prompts | Chat histories |
| Context files | Buried in project folders |
| Useful links | Browser bookmarks |
| Documentation | Random folders |
| Commands | `.txt` files, bash history |
| Templates | GitHub Gists |

This causes **context switching**, **lost knowledge**, and **inconsistent workflows**. Dioku solves this with a single, unified hub.

---

## Target Users

| User | Primary Need |
|---|---|
| **Everyday Developer** | Fast access to snippets, prompts, commands, links |
| **AI-first Developer** | Save prompts, contexts, workflows, system messages |
| **Content Creator / Educator** | Store code blocks, explanations, course notes |
| **Full-stack Builder** | Collect patterns, boilerplates, API examples |

---

## Core Features

### A. Items & Item Types

Items are the core unit of Dioku. Each item has a **type** that determines how it's stored and displayed. System types are built-in and cannot be modified by users.

**Content categories:**
- `text` — snippet, note, prompt, command
- `url` — link
- `file` — file, image *(Pro only)*

Items are accessed and created quickly via a **slide-out drawer**, without leaving the current view.

### B. Collections

Users group items into named collections. A single item can belong to **multiple collections**.

Examples:
- `React Patterns` — snippets, notes
- `Context Files` — files
- `Python Snippets` — snippets
- `Interview Prep` — snippets, commands, links

### C. Search

Full-text search across:
- Content body
- Title
- Tags
- Item type

### D. Authentication

- Email / password
- GitHub OAuth

via **NextAuth v5**.

### E. General Features

- Favorite collections and items
- Pin items to top
- Recently used items list
- Import code from a file
- Markdown editor for text-type items
- File upload for `file` / `image` types *(Pro)*
- Export data as JSON / ZIP *(Pro)*
- Dark mode (default) + light mode toggle
- Add / remove items to / from multiple collections
- View all collections an item belongs to
- Toast notifications for actions
- Loading skeletons during async operations

---

## Item Types

| Type | Icon | Color | Hex | URL Path |
|---|---|---|---|---|
| Snippet | `Code` | Blue | `#3b82f6` | `/items/snippets` |
| Prompt | `Sparkles` | Purple | `#8b5cf6` | `/items/prompts` |
| Command | `Terminal` | Orange | `#f97316` | `/items/commands` |
| Note | `StickyNote` | Yellow | `#fde047` | `/items/notes` |
| File *(Pro)* | `File` | Gray | `#6b7280` | `/items/files` |
| Image *(Pro)* | `Image` | Pink | `#ec4899` | `/items/images` |
| Link | `Link` | Emerald | `#10b981` | `/items/links` |

> Icons reference [Lucide React](https://lucide.dev/icons/) — used via `lucide-react`.

---

## Data Models & Prisma Schema

> **Important:** Never use `db push` or directly alter the database schema. Always create and run migrations:
> ```bash
> npx prisma migrate dev --name <migration_name>
> npx prisma migrate deploy   # production
> ```

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── User ────────────────────────────────────────────────────────────────────

model User {
  id                   String    @id @default(cuid())
  name                 String?
  email                String?   @unique
  emailVerified        DateTime?
  image                String?
  isPro                Boolean   @default(false)
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  // NextAuth relations
  accounts    Account[]
  sessions    Session[]

  // App relations
  items       Item[]
  collections Collection[]
  itemTypes   ItemType[]
  tags        Tag[]
}

// ─── NextAuth ─────────────────────────────────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── ItemType ─────────────────────────────────────────────────────────────────

model ItemType {
  id       String @id @default(cuid())
  name     String // "snippet" | "prompt" | "note" | "command" | "file" | "image" | "link"
  icon     String // Lucide icon name e.g. "Code"
  color    String // Hex e.g. "#3b82f6"
  isSystem Boolean @default(false)

  // null for system types, set for user-created custom types
  userId String?
  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items Item[]
}

// ─── Item ─────────────────────────────────────────────────────────────────────

enum ContentType {
  TEXT
  FILE
  URL
}

model Item {
  id          String      @id @default(cuid())
  title       String
  contentType ContentType
  content     String?     @db.Text   // text content; null for file/url types
  fileUrl     String?                // Cloudflare R2 URL; null for text/url types
  fileName    String?                // original filename
  fileSize    Int?                   // bytes
  url         String?                // for link types
  description String?     @db.Text
  isFavorite  Boolean     @default(false)
  isPinned    Boolean     @default(false)
  language    String?                // e.g. "typescript", "python" (for snippet types)
  lastUsedAt  DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  itemTypeId String
  itemType   ItemType @relation(fields: [itemTypeId], references: [id])

  tags        TagsOnItems[]
  collections ItemCollection[]
}

// ─── Collection ───────────────────────────────────────────────────────────────

model Collection {
  id            String   @id @default(cuid())
  name          String
  description   String?  @db.Text
  isFavorite    Boolean  @default(false)
  defaultTypeId String?  // used when collection has no items yet
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items ItemCollection[]
}

// ─── ItemCollection (Join Table) ──────────────────────────────────────────────

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

// ─── Tag ──────────────────────────────────────────────────────────────────────

model Tag {
  id   String @id @default(cuid())
  name String

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items TagsOnItems[]

  @@unique([name, userId])
}

// ─── TagsOnItems (Join Table) ─────────────────────────────────────────────────

model TagsOnItems {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js 16 App                        │
│                                                              │
│  ┌──────────────┐    ┌────────────────────────────────────┐  │
│  │   Pages/RSC  │    │           API Routes               │  │
│  │              │    │  /api/items  /api/collections      │  │
│  │  /dashboard  │    │  /api/tags   /api/upload           │  │
│  │  /items/[t]  │    │  /api/ai/*   /api/export           │  │
│  │  /settings   │    │  /api/auth/[...nextauth]           │  │
│  └──────┬───────┘    └───────────┬────────────────────────┘  │
│         │                        │                            │
└─────────┼────────────────────────┼────────────────────────────┘
          │                        │
          ▼                        ▼
┌─────────────────┐    ┌───────────────────────┐
│   Neon Postgres  │    │   External Services   │
│   via Prisma    │    │                       │
│                 │    │  Cloudflare R2        │
│  Users          │    │  (file storage)       │
│  Items          │    │                       │
│  Collections    │    │  OpenAI gpt-5-nano    │
│  ItemTypes      │    │  (AI features)        │
│  Tags           │    │                       │
│  Sessions       │    │  Stripe               │
└─────────────────┘    │  (subscriptions)      │
                       │                       │
                       │  GitHub OAuth         │
                       │  (NextAuth)           │
                       └───────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/docs) + React 19 | SSR + API routes, one repo |
| **Language** | TypeScript | Strict mode recommended |
| **Database** | [Neon](https://neon.tech/docs) (PostgreSQL) | Serverless Postgres |
| **ORM** | [Prisma 7](https://www.prisma.io/docs) | Always use migrations, never `db push` |
| **Auth** | [NextAuth v5](https://authjs.dev) | Email/password + GitHub OAuth |
| **File Storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/) | S3-compatible, no egress fees |
| **AI** | [OpenAI](https://platform.openai.com/docs) `gpt-5-nano` | Auto-tagging, summaries, code explain |
| **Payments** | [Stripe](https://stripe.com/docs) | Subscriptions + customer portal |
| **CSS** | [Tailwind CSS v4](https://tailwindcss.com/docs) | |
| **Components** | [shadcn/ui](https://ui.shadcn.com) | Built on Radix UI |
| **Icons** | [Lucide React](https://lucide.dev) | |
| **Syntax Highlighting** | [Shiki](https://shiki.style) or [Prism](https://prismjs.com) | For code snippet display |
| **Caching** | Redis *(optional)* | Session/query caching if needed |

---

## UI/UX Guidelines

### Design Principles

- **Modern, minimal, developer-focused** — reference: [Notion](https://notion.so), [Linear](https://linear.app), [Raycast](https://raycast.com)
- Dark mode by default; light mode optional
- Clean typography, generous whitespace
- Subtle borders and shadows
- Syntax highlighting on all code blocks

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Header (logo, search bar, user menu, new item button)   │
├───────────────┬──────────────────────────────────────────┤
│               │                                          │
│   Sidebar     │   Main Content                           │
│               │                                          │
│   Item Types  │   Collection cards (color-coded grid)    │
│   ─────────   │   └── Items (color-coded border cards)   │
│   Snippets    │                                          │
│   Prompts     │   Item drawer slides in on click         │
│   Commands    │                                          │
│   Notes       │                                          │
│   Files       │                                          │
│   Images      │                                          │
│   Links       │                                          │
│   ─────────   │                                          │
│   Collections │                                          │
│   (latest 5)  │                                          │
│               │                                          │
└───────────────┴──────────────────────────────────────────┘
```

- **Sidebar** is collapsible; becomes a drawer on mobile
- **Collection cards** background color reflects the dominant item type in that collection
- **Item cards** use a colored left border matching their type color
- **Item drawer** opens on the right, without navigating away

### Micro-interactions

- Smooth transitions on drawer open/close and sidebar collapse
- Hover states on all cards
- Toast notifications for create / update / delete / copy actions
- Loading skeletons during data fetches

---

## Monetization

### Free Plan

| Limit | Value |
|---|---|
| Items | 50 total |
| Collections | 3 |
| Item types | All system types except File & Image |
| Search | Basic |
| File uploads | ❌ |
| AI features | ❌ |
| Export | ❌ |

### Pro Plan — $8/month or $72/year

| Feature | |
|---|---|
| Items | Unlimited |
| Collections | Unlimited |
| File & Image uploads | ✅ |
| Custom item types | ✅ *(coming later)* |
| AI auto-tagging | ✅ |
| AI code explanation | ✅ |
| AI prompt optimizer | ✅ |
| Export (JSON / ZIP) | ✅ |
| Priority support | ✅ |

> **During development:** All users have full Pro access. Pro gating logic should be scaffolded but feature-flagged off.

---

## AI Features

All AI features are **Pro only** and powered by `gpt-5-nano`.

| Feature | Description |
|---|---|
| **Auto-tag suggestions** | Analyzes item content and suggests relevant tags on save |
| **AI Summary** | Generates a short summary for long snippets, notes, or files |
| **Explain This Code** | Walks through a code snippet in plain English |
| **Prompt Optimizer** | Rewrites a saved prompt to be clearer and more effective |

AI calls should be made via **Next.js API routes** (never from the client directly) to keep the OpenAI key server-side.

---

## Key Links & Resources

| Resource | URL |
|---|---|
| Next.js Docs | https://nextjs.org/docs |
| Prisma Docs (v7) | https://www.prisma.io/docs |
| Neon Docs | https://neon.tech/docs |
| NextAuth v5 Docs | https://authjs.dev |
| Cloudflare R2 Docs | https://developers.cloudflare.com/r2/ |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| shadcn/ui | https://ui.shadcn.com |
| Lucide Icons | https://lucide.dev/icons/ |
| OpenAI API Docs | https://platform.openai.com/docs |
| Stripe Docs | https://stripe.com/docs |
| Shiki (syntax highlight) | https://shiki.style |

---

> *Last updated: June 2026. This document is the living source of truth for the Dioku project.*
