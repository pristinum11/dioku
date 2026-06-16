import prisma from '@/lib/prisma'

export interface ItemType {
  id: string
  name: string
  icon: string
  color: string
}

export interface ItemTag {
  id: string
  name: string
}

export interface ItemWithType {
  id: string
  title: string
  contentType: 'TEXT' | 'FILE' | 'URL'
  description: string | null
  isFavorite: boolean
  isPinned: boolean
  language: string | null
  lastUsedAt: Date | null
  createdAt: Date
  itemType: ItemType
  tags: ItemTag[]
}

const itemInclude = {
  itemType: true,
  tags: { include: { tag: true } },
} as const

function mapItem(item: {
  id: string
  title: string
  contentType: 'TEXT' | 'FILE' | 'URL'
  description: string | null
  isFavorite: boolean
  isPinned: boolean
  language: string | null
  lastUsedAt: Date | null
  createdAt: Date
  itemType: { id: string; name: string; icon: string; color: string }
  tags: { tag: { id: string; name: string } }[]
}): ItemWithType {
  return {
    id: item.id,
    title: item.title,
    contentType: item.contentType,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    language: item.language,
    lastUsedAt: item.lastUsedAt,
    createdAt: item.createdAt,
    itemType: item.itemType,
    tags: item.tags.map(t => t.tag),
  }
}

export async function getPinnedItems(): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { isPinned: true },
    orderBy: { updatedAt: 'desc' },
    include: itemInclude,
  })
  return items.map(mapItem)
}

export async function getRecentItems(limit = 10): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { isPinned: false },
    orderBy: [{ lastUsedAt: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    include: itemInclude,
  })
  return items.map(mapItem)
}

export async function getItemsByTypeName(typeName: string): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { itemType: { name: typeName } },
    orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
    include: itemInclude,
  })
  return items.map(mapItem)
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const TYPE_ORDER = ['snippet', 'prompt', 'command', 'note', 'file', 'image', 'link']

export interface SidebarItemType {
  id: string
  name: string
  icon: string
  color: string
  itemCount: number
}

export async function getItemTypesWithCounts(): Promise<SidebarItemType[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: { _count: { select: { items: true } } },
  })
  return types
    .sort((a, b) => {
      const ai = TYPE_ORDER.indexOf(a.name)
      const bi = TYPE_ORDER.indexOf(b.name)
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })
    .map(t => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      itemCount: t._count.items,
    }))
}
