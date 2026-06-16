import prisma from '@/lib/prisma'

export interface CollectionType {
  id: string
  name: string
  icon: string
  color: string
}

export interface CollectionWithTypes {
  id: string
  name: string
  description: string | null
  isFavorite: boolean
  updatedAt: Date
  itemCount: number
  types: CollectionType[]
  dominantType: CollectionType | null
}

export interface DashboardStats {
  totalItems: number
  totalCollections: number
  favoriteItems: number
  favoriteCollections: number
}

export async function getRecentCollections(limit = 6): Promise<CollectionWithTypes[]> {
  const collections = await prisma.collection.findMany({
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  })

  return collections.map(col => {
    const typeCounts: Record<string, { type: CollectionType; count: number }> = {}

    for (const ic of col.items) {
      const t = ic.item.itemType
      if (!typeCounts[t.id]) {
        typeCounts[t.id] = {
          type: { id: t.id, name: t.name, icon: t.icon, color: t.color },
          count: 0,
        }
      }
      typeCounts[t.id].count++
    }

    const entries = Object.values(typeCounts)
    const types = entries.map(e => e.type)
    const dominantType =
      entries.sort((a, b) => b.count - a.count)[0]?.type ?? null

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      updatedAt: col.updatedAt,
      itemCount: col.items.length,
      types,
      dominantType,
    }
  })
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] =
    await Promise.all([
      prisma.item.count(),
      prisma.collection.count(),
      prisma.item.count({ where: { isFavorite: true } }),
      prisma.collection.count({ where: { isFavorite: true } }),
    ])

  return { totalItems, totalCollections, favoriteItems, favoriteCollections }
}
