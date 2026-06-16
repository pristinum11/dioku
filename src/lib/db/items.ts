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
