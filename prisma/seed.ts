import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Item Types ───────────────────────────────────────────────────────────────

const ITEM_TYPES = [
  { name: "snippet", icon: "Code",       color: "#3b82f6" },
  { name: "prompt",  icon: "Sparkles",   color: "#8b5cf6" },
  { name: "command", icon: "Terminal",   color: "#f97316" },
  { name: "note",    icon: "StickyNote", color: "#fde047" },
  { name: "file",    icon: "File",       color: "#6b7280" },
  { name: "image",   icon: "Image",      color: "#ec4899" },
  { name: "link",    icon: "Link",       color: "#10b981" },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding database...\n");

  // ── User ──────────────────────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      emailVerified: new Date(),
      isPro: false,
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "demo@devstash.io",
          access_token: passwordHash,
        },
      },
    },
  });

  console.log(`✓ User: ${user.email}`);

  // ── Item Types ─────────────────────────────────────────────────────────────

  const typeMap: Record<string, string> = {};

  for (const t of ITEM_TYPES) {
    const type = await prisma.itemType.upsert({
      where: {
        // unique by name+userId where userId is null for system types
        id: (await prisma.itemType.findFirst({ where: { name: t.name, isSystem: true } }))?.id ?? `__new__${t.name}`,
      },
      update: {},
      create: { name: t.name, icon: t.icon, color: t.color, isSystem: true },
    });
    typeMap[t.name] = type.id;
  }

  console.log(`✓ Item types: ${Object.keys(typeMap).join(", ")}`);

  // ── Helper ─────────────────────────────────────────────────────────────────

  async function createCollection(data: {
    name: string;
    description: string;
    isFavorite?: boolean;
    items: {
      title: string;
      typeName: string;
      content?: string;
      url?: string;
      description?: string;
      language?: string;
      isPinned?: boolean;
      isFavorite?: boolean;
    }[];
  }) {
    const existing = await prisma.collection.findFirst({
      where: { name: data.name, userId: user.id },
    });

    const collection = existing ?? (await prisma.collection.create({
      data: {
        name: data.name,
        description: data.description,
        isFavorite: data.isFavorite ?? false,
        userId: user.id,
      },
    }));

    for (const itemData of data.items) {
      const existingItem = await prisma.item.findFirst({
        where: { title: itemData.title, userId: user.id },
      });

      const item = existingItem ?? (await prisma.item.create({
        data: {
          title: itemData.title,
          contentType: itemData.url ? "URL" : "TEXT",
          content: itemData.content ?? null,
          url: itemData.url ?? null,
          description: itemData.description ?? null,
          language: itemData.language ?? null,
          isPinned: itemData.isPinned ?? false,
          isFavorite: itemData.isFavorite ?? false,
          userId: user.id,
          itemTypeId: typeMap[itemData.typeName],
        },
      }));

      await prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: collection.id } },
        update: {},
        create: { itemId: item.id, collectionId: collection.id },
      });
    }

    console.log(`✓ Collection: "${collection.name}" (${data.items.length} items)`);
  }

  // ── Collections & Items ────────────────────────────────────────────────────

  await createCollection({
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
    items: [
      {
        title: "useDebounce Hook",
        typeName: "snippet",
        language: "typescript",
        description: "Delays updating a value until after a specified wait period",
        isPinned: true,
        content: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}`,
      },
      {
        title: "useLocalStorage Hook",
        typeName: "snippet",
        language: "typescript",
        description: "Sync state to localStorage with SSR safety",
        content: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        title: "Compound Component Pattern",
        typeName: "snippet",
        language: "typescript",
        description: "Share implicit state between a parent and its children",
        content: `import { createContext, useContext, useState } from 'react';

interface ToggleContext { on: boolean; toggle: () => void }
const Ctx = createContext<ToggleContext | null>(null);

function Toggle({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  return <Ctx.Provider value={{ on, toggle: () => setOn(o => !o) }}>{children}</Ctx.Provider>;
}

function useToggle() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToggle must be used within <Toggle>');
  return ctx;
}

Toggle.Button = function ToggleButton() {
  const { on, toggle } = useToggle();
  return <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>;
};

Toggle.Display = function ToggleDisplay({ children }: { children: React.ReactNode }) {
  const { on } = useToggle();
  return on ? <>{children}</> : null;
};

export { Toggle };`,
      },
    ],
  });

  await createCollection({
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    isFavorite: true,
    items: [
      {
        title: "Code Review Prompt",
        typeName: "prompt",
        description: "Structured prompt for thorough AI code review",
        isFavorite: true,
        content: `Review the following code for correctness, edge cases, performance, security vulnerabilities, and readability. Be concise. For each issue state: the line, the problem, and the fix.

\`\`\`
{{code}}
\`\`\``,
      },
      {
        title: "Documentation Generator",
        typeName: "prompt",
        description: "Generate JSDoc or inline docs for a function",
        content: `Write clear documentation for the following function. Include: a one-line summary, parameter descriptions with types, return value, and one usage example. Output as JSDoc.

\`\`\`
{{code}}
\`\`\``,
      },
      {
        title: "Refactoring Assistant",
        typeName: "prompt",
        description: "Ask AI to suggest clean refactoring improvements",
        content: `Refactor the following code to improve readability, reduce duplication, and follow best practices. Explain each change you make in a bullet list below the refactored code.

\`\`\`
{{code}}
\`\`\``,
      },
    ],
  });

  await createCollection({
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        title: "Docker Multi-Stage Build",
        typeName: "snippet",
        language: "dockerfile",
        description: "Lean production image using multi-stage builds",
        content: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        title: "Deploy with Zero Downtime",
        typeName: "command",
        description: "Rolling deploy via Docker Compose with health checks",
        content: `docker compose pull && docker compose up -d --no-deps --scale app=2 app && sleep 10 && docker compose up -d --no-deps --scale app=1 app`,
      },
      {
        title: "GitHub Actions Docs",
        typeName: "link",
        description: "Official GitHub Actions workflow syntax reference",
        url: "https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions",
      },
      {
        title: "Docker Compose Reference",
        typeName: "link",
        description: "Full Docker Compose file specification",
        url: "https://docs.docker.com/compose/compose-file/",
      },
    ],
  });

  await createCollection({
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    isFavorite: true,
    items: [
      {
        title: "Git Interactive Rebase",
        typeName: "command",
        description: "Rewrite, squash, or reorder the last N commits",
        isPinned: true,
        content: `git rebase -i HEAD~<n>`,
      },
      {
        title: "Docker System Prune",
        typeName: "command",
        description: "Remove all stopped containers, unused networks, images, and build cache",
        content: `docker system prune -af --volumes`,
      },
      {
        title: "Find and Kill Port",
        typeName: "command",
        description: "Kill whichever process is listening on a given port",
        content: `lsof -ti:<port> | xargs kill -9`,
      },
      {
        title: "NPM Clean Install",
        typeName: "command",
        description: "Delete node_modules and lock file, then reinstall cleanly",
        content: `rm -rf node_modules package-lock.json && npm install`,
      },
    ],
  });

  await createCollection({
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        title: "Tailwind CSS Docs",
        typeName: "link",
        description: "Official Tailwind CSS utility class reference",
        url: "https://tailwindcss.com/docs",
      },
      {
        title: "shadcn/ui Components",
        typeName: "link",
        description: "Copy-paste component library built on Radix UI and Tailwind",
        url: "https://ui.shadcn.com/docs/components",
        isFavorite: true,
      },
      {
        title: "Radix UI Primitives",
        typeName: "link",
        description: "Accessible, unstyled UI primitives for building design systems",
        url: "https://www.radix-ui.com/primitives",
      },
      {
        title: "Lucide Icons",
        typeName: "link",
        description: "Open-source icon library used throughout Dioku",
        url: "https://lucide.dev/icons/",
      },
    ],
  });

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
