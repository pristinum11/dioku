// Single source of truth for mock data — replace with real DB calls once Prisma is wired up

export type ContentType = "TEXT" | "FILE" | "URL";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  isPro: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
  userId: string | null;
}

export interface Tag {
  id: string;
  name: string;
  userId: string;
}

export interface Item {
  id: string;
  title: string;
  contentType: ContentType;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  url: string | null;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  language: string | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  itemTypeId: string;
  tagIds: string[];
  collectionIds: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  defaultTypeId: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  itemIds: string[];
}

// ─── User ─────────────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  isPro: true,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

// ─── Item Types ───────────────────────────────────────────────────────────────

export const mockItemTypes: ItemType[] = [
  {
    id: "type_snippet",
    name: "snippet",
    icon: "Code",
    color: "#3b82f6",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_prompt",
    name: "prompt",
    icon: "Sparkles",
    color: "#8b5cf6",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_command",
    name: "command",
    icon: "Terminal",
    color: "#f97316",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_note",
    name: "note",
    icon: "StickyNote",
    color: "#fde047",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_file",
    name: "file",
    icon: "File",
    color: "#6b7280",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_image",
    name: "image",
    icon: "Image",
    color: "#ec4899",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_link",
    name: "link",
    icon: "Link",
    color: "#10b981",
    isSystem: true,
    userId: null,
  },
];

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const mockTags: Tag[] = [
  { id: "tag_react", name: "react", userId: "user_1" },
  { id: "tag_auth", name: "auth", userId: "user_1" },
  { id: "tag_hooks", name: "hooks", userId: "user_1" },
  { id: "tag_typescript", name: "typescript", userId: "user_1" },
  { id: "tag_python", name: "python", userId: "user_1" },
  { id: "tag_git", name: "git", userId: "user_1" },
  { id: "tag_docker", name: "docker", userId: "user_1" },
  { id: "tag_nextjs", name: "nextjs", userId: "user_1" },
  { id: "tag_api", name: "api", userId: "user_1" },
  { id: "tag_ai", name: "ai", userId: "user_1" },
  { id: "tag_interview", name: "interview", userId: "user_1" },
  { id: "tag_patterns", name: "patterns", userId: "user_1" },
];

// ─── Items ────────────────────────────────────────────────────────────────────

export const mockItems: Item[] = [
  // Snippets
  {
    id: "item_1",
    title: "useAuth Hook",
    contentType: "TEXT",
    content:
      "import { useSession } from 'next-auth/react';\n\nexport function useAuth() {\n  const { data: session, status } = useSession();\n  return {\n    user: session?.user ?? null,\n    isLoading: status === 'loading',\n    isAuthenticated: status === 'authenticated',\n  };\n}",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Custom authentication hook for React applications",
    isFavorite: false,
    isPinned: true,
    language: "typescript",
    lastUsedAt: new Date("2026-01-15"),
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
    userId: "user_1",
    itemTypeId: "type_snippet",
    tagIds: ["tag_react", "tag_auth", "tag_hooks"],
    collectionIds: ["col_react_patterns"],
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    contentType: "TEXT",
    content:
      "async function fetchWithRetry(url: string, retries = 3): Promise<Response> {\n  for (let i = 0; i < retries; i++) {\n    try {\n      const res = await fetch(url);\n      if (!res.ok) throw new Error(res.statusText);\n      return res;\n    } catch (err) {\n      if (i === retries - 1) throw err;\n      await new Promise(r => setTimeout(r, 2 ** i * 1000));\n    }\n  }\n  throw new Error('Unreachable');\n}",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Fetch wrapper with exponential backoff retry logic",
    isFavorite: false,
    isPinned: true,
    language: "typescript",
    lastUsedAt: new Date("2026-01-12"),
    createdAt: new Date("2026-01-12"),
    updatedAt: new Date("2026-01-12"),
    userId: "user_1",
    itemTypeId: "type_snippet",
    tagIds: ["tag_api", "tag_typescript"],
    collectionIds: ["col_react_patterns", "col_interview_prep"],
  },
  {
    id: "item_3",
    title: "useDebounce Hook",
    contentType: "TEXT",
    content:
      "import { useState, useEffect } from 'react';\n\nexport function useDebounce<T>(value: T, delay = 300): T {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debounced;\n}",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Generic debounce hook for search inputs",
    isFavorite: true,
    isPinned: false,
    language: "typescript",
    lastUsedAt: new Date("2026-01-10"),
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-10"),
    userId: "user_1",
    itemTypeId: "type_snippet",
    tagIds: ["tag_react", "tag_hooks"],
    collectionIds: ["col_react_patterns"],
  },
  {
    id: "item_4",
    title: "Python List Comprehension Patterns",
    contentType: "TEXT",
    content:
      "# Filter and transform\nresult = [x * 2 for x in items if x > 0]\n\n# Nested\nmatrix = [[row[i] for row in grid] for i in range(len(grid[0]))]\n\n# Dict comprehension\nmapping = {k: v for k, v in pairs if v is not None}",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Common Python list and dict comprehension patterns",
    isFavorite: false,
    isPinned: false,
    language: "python",
    lastUsedAt: new Date("2026-01-08"),
    createdAt: new Date("2025-12-20"),
    updatedAt: new Date("2026-01-08"),
    userId: "user_1",
    itemTypeId: "type_snippet",
    tagIds: ["tag_python", "tag_patterns"],
    collectionIds: ["col_python_snippets"],
  },
  {
    id: "item_5",
    title: "Python Context Manager",
    contentType: "TEXT",
    content:
      "from contextlib import contextmanager\n\n@contextmanager\ndef managed_resource(name: str):\n    resource = acquire(name)\n    try:\n        yield resource\n    finally:\n        release(resource)",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Custom context manager using contextlib",
    isFavorite: false,
    isPinned: false,
    language: "python",
    lastUsedAt: null,
    createdAt: new Date("2025-12-15"),
    updatedAt: new Date("2025-12-15"),
    userId: "user_1",
    itemTypeId: "type_snippet",
    tagIds: ["tag_python"],
    collectionIds: ["col_python_snippets"],
  },
  {
    id: "item_6",
    title: "React Server Component Data Fetch",
    contentType: "TEXT",
    content:
      "// app/items/page.tsx\nexport default async function ItemsPage() {\n  const items = await prisma.item.findMany({\n    where: { userId: session.user.id },\n    include: { itemType: true, tags: { include: { tag: true } } },\n    orderBy: { updatedAt: 'desc' },\n  });\n  return <ItemList items={items} />;\n}",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Pattern for fetching data in Next.js RSC with Prisma",
    isFavorite: true,
    isPinned: false,
    language: "typescript",
    lastUsedAt: new Date("2026-01-14"),
    createdAt: new Date("2026-01-03"),
    updatedAt: new Date("2026-01-14"),
    userId: "user_1",
    itemTypeId: "type_snippet",
    tagIds: ["tag_nextjs", "tag_react", "tag_patterns"],
    collectionIds: ["col_react_patterns", "col_interview_prep"],
  },

  // Commands
  {
    id: "item_7",
    title: "Git Interactive Rebase",
    contentType: "TEXT",
    content: "git rebase -i HEAD~<n>",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Rewrite, squash, or reorder the last N commits",
    isFavorite: true,
    isPinned: false,
    language: null,
    lastUsedAt: new Date("2026-01-13"),
    createdAt: new Date("2025-11-10"),
    updatedAt: new Date("2026-01-13"),
    userId: "user_1",
    itemTypeId: "type_command",
    tagIds: ["tag_git"],
    collectionIds: ["col_git_commands"],
  },
  {
    id: "item_8",
    title: "Git Stash with Message",
    contentType: "TEXT",
    content: "git stash push -m 'description' --include-untracked",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Stash all changes including untracked files with a label",
    isFavorite: false,
    isPinned: false,
    language: null,
    lastUsedAt: new Date("2026-01-11"),
    createdAt: new Date("2025-11-15"),
    updatedAt: new Date("2026-01-11"),
    userId: "user_1",
    itemTypeId: "type_command",
    tagIds: ["tag_git"],
    collectionIds: ["col_git_commands"],
  },
  {
    id: "item_9",
    title: "Docker Compose Up with Build",
    contentType: "TEXT",
    content: "docker compose up --build --force-recreate -d",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Rebuild images and restart all containers detached",
    isFavorite: false,
    isPinned: false,
    language: null,
    lastUsedAt: new Date("2026-01-09"),
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2026-01-09"),
    userId: "user_1",
    itemTypeId: "type_command",
    tagIds: ["tag_docker"],
    collectionIds: ["col_interview_prep"],
  },

  // Notes
  {
    id: "item_10",
    title: "React Rendering Rules",
    contentType: "TEXT",
    content:
      "## Key Rules\n- Components re-render when state or props change\n- Context re-renders all consumers when value changes — memoize!\n- `React.memo` skips re-render if props are shallowly equal\n- `useCallback` / `useMemo` only help if the child is memoized\n- Keys must be stable — never use array index for dynamic lists",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Notes on React rendering behavior and optimization",
    isFavorite: false,
    isPinned: false,
    language: null,
    lastUsedAt: null,
    createdAt: new Date("2026-01-06"),
    updatedAt: new Date("2026-01-06"),
    userId: "user_1",
    itemTypeId: "type_note",
    tagIds: ["tag_react", "tag_patterns"],
    collectionIds: ["col_react_patterns", "col_interview_prep"],
  },
  {
    id: "item_11",
    title: "Interview Prep — System Design",
    contentType: "TEXT",
    content:
      "## System Design Checklist\n1. Clarify requirements (functional + non-functional)\n2. Estimate scale (DAU, QPS, storage)\n3. High-level design (components, data flow)\n4. Data model\n5. API design\n6. Deep dive into bottlenecks\n7. Trade-offs",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "System design interview framework and checklist",
    isFavorite: true,
    isPinned: false,
    language: null,
    lastUsedAt: new Date("2026-01-07"),
    createdAt: new Date("2025-12-28"),
    updatedAt: new Date("2026-01-07"),
    userId: "user_1",
    itemTypeId: "type_note",
    tagIds: ["tag_interview"],
    collectionIds: ["col_interview_prep"],
  },

  // Links
  {
    id: "item_12",
    title: "React Docs — Hooks Reference",
    contentType: "URL",
    content: null,
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: "https://react.dev/reference/react",
    description: "Official React hooks API reference",
    isFavorite: true,
    isPinned: false,
    language: null,
    lastUsedAt: new Date("2026-01-14"),
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date("2026-01-14"),
    userId: "user_1",
    itemTypeId: "type_link",
    tagIds: ["tag_react"],
    collectionIds: ["col_react_patterns"],
  },
  {
    id: "item_13",
    title: "TypeScript Handbook",
    contentType: "URL",
    content: null,
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    description: "The official TypeScript handbook",
    isFavorite: false,
    isPinned: false,
    language: null,
    lastUsedAt: null,
    createdAt: new Date("2025-11-05"),
    updatedAt: new Date("2025-11-05"),
    userId: "user_1",
    itemTypeId: "type_link",
    tagIds: ["tag_typescript"],
    collectionIds: ["col_interview_prep"],
  },
  {
    id: "item_14",
    title: "Git Flight Rules",
    contentType: "URL",
    content: null,
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: "https://github.com/k88hudson/git-flight-rules",
    description: "What to do when things go wrong in Git",
    isFavorite: false,
    isPinned: false,
    language: null,
    lastUsedAt: new Date("2026-01-10"),
    createdAt: new Date("2025-10-20"),
    updatedAt: new Date("2026-01-10"),
    userId: "user_1",
    itemTypeId: "type_link",
    tagIds: ["tag_git"],
    collectionIds: ["col_git_commands"],
  },

  // Prompts
  {
    id: "item_15",
    title: "Code Review Prompt",
    contentType: "TEXT",
    content:
      "Review the following code for: correctness, edge cases, performance issues, security vulnerabilities, and readability. Be concise. For each issue, state the line, the problem, and the fix.\n\n```\n{{code}}\n```",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Structured prompt for AI code review",
    isFavorite: true,
    isPinned: false,
    language: null,
    lastUsedAt: new Date("2026-01-15"),
    createdAt: new Date("2025-12-10"),
    updatedAt: new Date("2026-01-15"),
    userId: "user_1",
    itemTypeId: "type_prompt",
    tagIds: ["tag_ai"],
    collectionIds: ["col_ai_prompts"],
  },
  {
    id: "item_16",
    title: "Explain This Code",
    contentType: "TEXT",
    content:
      "Explain the following code to a mid-level developer. Cover: what it does, why it's written this way, and any non-obvious behavior. Keep it under 200 words.\n\n```\n{{code}}\n```",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Ask AI to explain a code snippet in plain English",
    isFavorite: false,
    isPinned: false,
    language: null,
    lastUsedAt: new Date("2026-01-13"),
    createdAt: new Date("2025-12-12"),
    updatedAt: new Date("2026-01-13"),
    userId: "user_1",
    itemTypeId: "type_prompt",
    tagIds: ["tag_ai"],
    collectionIds: ["col_ai_prompts"],
  },
  {
    id: "item_17",
    title: "Write Unit Tests Prompt",
    contentType: "TEXT",
    content:
      "Write comprehensive unit tests for the following function using Vitest. Cover: happy path, edge cases, and error cases. Use descriptive test names.\n\n```\n{{code}}\n```",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Generate unit tests for a function",
    isFavorite: false,
    isPinned: false,
    language: null,
    lastUsedAt: null,
    createdAt: new Date("2026-01-02"),
    updatedAt: new Date("2026-01-02"),
    userId: "user_1",
    itemTypeId: "type_prompt",
    tagIds: ["tag_ai", "tag_typescript"],
    collectionIds: ["col_ai_prompts"],
  },

  // Files
  {
    id: "item_18",
    title: "Next.js Project Context",
    contentType: "FILE",
    content: null,
    fileUrl: "https://r2.example.com/files/nextjs-context.md",
    fileName: "nextjs-context.md",
    fileSize: 4200,
    url: null,
    description: "AI context file describing this Next.js project structure",
    isFavorite: false,
    isPinned: false,
    language: null,
    lastUsedAt: new Date("2026-01-14"),
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-14"),
    userId: "user_1",
    itemTypeId: "type_file",
    tagIds: ["tag_nextjs", "tag_ai"],
    collectionIds: ["col_context_files"],
  },
  {
    id: "item_19",
    title: "React Component Guidelines",
    contentType: "FILE",
    content: null,
    fileUrl: "https://r2.example.com/files/react-guidelines.md",
    fileName: "react-guidelines.md",
    fileSize: 3100,
    url: null,
    description: "Team conventions for React component authoring",
    isFavorite: false,
    isPinned: false,
    language: null,
    lastUsedAt: new Date("2026-01-11"),
    createdAt: new Date("2025-12-20"),
    updatedAt: new Date("2026-01-11"),
    userId: "user_1",
    itemTypeId: "type_file",
    tagIds: ["tag_react"],
    collectionIds: ["col_context_files"],
  },

  // Images
  {
    id: "item_20",
    title: "System Architecture Diagram",
    contentType: "FILE",
    content: null,
    fileUrl: "https://r2.example.com/images/architecture.png",
    fileName: "architecture.png",
    fileSize: 184320,
    url: null,
    description: "High-level architecture diagram for the Dioku system",
    isFavorite: false,
    isPinned: false,
    language: null,
    lastUsedAt: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    userId: "user_1",
    itemTypeId: "type_image",
    tagIds: [],
    collectionIds: ["col_context_files"],
  },
];

// ─── Collections ──────────────────────────────────────────────────────────────

export const mockCollections: Collection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    defaultTypeId: "type_snippet",
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date("2026-01-15"),
    userId: "user_1",
    itemIds: ["item_1", "item_2", "item_3", "item_6", "item_10", "item_12"],
  },
  {
    id: "col_python_snippets",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    defaultTypeId: "type_snippet",
    createdAt: new Date("2025-11-05"),
    updatedAt: new Date("2026-01-08"),
    userId: "user_1",
    itemIds: ["item_4", "item_5"],
  },
  {
    id: "col_context_files",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    defaultTypeId: "type_file",
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2026-01-14"),
    userId: "user_1",
    itemIds: ["item_18", "item_19", "item_20"],
  },
  {
    id: "col_interview_prep",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: true,
    defaultTypeId: "type_snippet",
    createdAt: new Date("2025-12-15"),
    updatedAt: new Date("2026-01-13"),
    userId: "user_1",
    itemIds: ["item_2", "item_6", "item_9", "item_10", "item_11", "item_13"],
  },
  {
    id: "col_git_commands",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    defaultTypeId: "type_command",
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date("2026-01-13"),
    userId: "user_1",
    itemIds: ["item_7", "item_8", "item_14"],
  },
  {
    id: "col_ai_prompts",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    defaultTypeId: "type_prompt",
    createdAt: new Date("2025-12-10"),
    updatedAt: new Date("2026-01-15"),
    userId: "user_1",
    itemIds: ["item_15", "item_16", "item_17"],
  },
];
