import Link from 'next/link'
import {
  Code, Sparkles, Terminal, StickyNote, File, Image,
  Link as LinkIcon, Star, LucideIcon,
} from 'lucide-react'
import { CollectionWithTypes } from '@/lib/db/collections'

const ICON_MAP: Record<string, LucideIcon> = {
  Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon,
}

export function CollectionCard({ collection }: { collection: CollectionWithTypes }) {
  const { types, dominantType } = collection

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/40"
      style={dominantType ? { borderLeftColor: dominantType.color, borderLeftWidth: 3 } : undefined}
    >
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug">{collection.name}</h3>
        {collection.isFavorite && (
          <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
        )}
      </div>
      <p className="mb-1.5 text-xs text-muted-foreground/70">
        {collection.itemCount} item{collection.itemCount !== 1 ? 's' : ''}
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
