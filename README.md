# Dioku

**Dioku** is a fast, searchable, AI-enhanced knowledge hub built for developers. Store and instantly retrieve your snippets, commands, prompts, notes, files, images, and links — all in one place.

The name is a portmanteau of **Developer** and **kioku** (記憶) — the Japanese word for *memory* — reflecting the product's purpose: a developer's persistent, always-accessible memory.

## Getting Started

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # run ESLint
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Tech Stack

- [Next.js 16](https://nextjs.org/docs) + React 19
- TypeScript
- Tailwind CSS v4
- PostgreSQL via Prisma + Neon
- NextAuth v5 (email/password + GitHub OAuth)
- Cloudflare R2 (file storage)
- OpenAI (AI features)
- Stripe (subscriptions)
