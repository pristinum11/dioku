import Link from 'next/link'
import {
  Code, Sparkles, Terminal, StickyNote, File, Image,
  Link as LinkIcon, Star, LucideIcon,
} from 'lucide-react'
import { Collection, ItemType, mockItems, mockItemTypes } from '@/lib/mock-data'

const ICON_MAP: Record<string, LucideIcon> = {
  Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon,
}

function getCollectionTypes(collection: Collection): ItemType[] {
  const seen = new Set<string>()
  const types: ItemType[] = []
  for (const itemId of collection.itemIds) {
    const typeId = mockItems.find(i => i.id === itemId)?.itemTypeId
    if (typeId && !seen.has(typeId)) {
      const type = mockItemTypes.find(t => t.id === typeId)
      if (type) { types.push(type); seen.add(typeId) }
    }
  }
  return types
}

function getDominantType(collection: Collection): ItemType | null {
  const counts: Record<string, number> = {}
  for (const itemId of collection.itemIds) {
    const typeId = mockItems.find(i => i.id === itemId)?.itemTypeId
    if (typeId) counts[typeId] = (counts[typeId] ?? 0) + 1
  }
  const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
  return topId ? (mockItemTypes.find(t => t.id === topId) ?? null) : null
}

export function CollectionCard({ collection }: { collection: Collection }) {
  const types = getCollectionTypes(collection)
  const dominant = getDominantType(collection)

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/40"
      style={dominant ? { borderLeftColor: dominant.color, borderLeftWidth: 3 } : undefined}
    >
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug">{collection.name}</h3>
        {collection.isFavorite && (
          <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
        )}
      </div>
      <p className="mb-1.5 text-xs text-muted-foreground/70">
        {collection.itemIds.length} item{collection.itemIds.length !== 1 ? 's' : ''}
      </p>
      {collection.description && (
        <p className="mb-3 flex-1 line-clamp-2 text-xs text-muted-foreground">
          {collection.description}
        </p>
      )}
      {types.length > 0 && (
        <div className="mt-auto flex items-center gap-1.5 pt-1">
          {types.slice(0, 5).map(type => {
            const Icon = ICON_MAP[type.icon]
            return Icon ? (
              <Icon key={type.id} className="h-3.5 w-3.5" style={{ color: type.color }} />
            ) : null
          })}
        </div>
      )}
    </Link>
  )
}
