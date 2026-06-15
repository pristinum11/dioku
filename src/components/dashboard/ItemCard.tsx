import {
  Code, Sparkles, Terminal, StickyNote, File, Image,
  Link as LinkIcon, Star, LucideIcon,
} from 'lucide-react'
import { Item, mockItemTypes, mockTags } from '@/lib/mock-data'

const ICON_MAP: Record<string, LucideIcon> = {
  Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon,
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ItemCard({ item }: { item: Item }) {
  const type = mockItemTypes.find(t => t.id === item.itemTypeId)
  const Icon = type ? ICON_MAP[type.icon] : null
  const tags = item.tagIds.map(id => mockTags.find(t => t.id === id)).filter(Boolean)
  const date = item.lastUsedAt ?? item.createdAt

  return (
    <div
      className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3.5 transition-colors hover:bg-muted/40"
      style={type ? { borderLeftColor: type.color, borderLeftWidth: 3 } : undefined}
    >
      {Icon && type && (
        <div
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${type.color}20` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: type.color }} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium">{item.title}</p>
          <div className="flex shrink-0 items-center gap-1.5">
            {item.isFavorite && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
            <span className="text-[10px] text-muted-foreground/60">{formatDate(date)}</span>
          </div>
        </div>
        {item.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.description}</p>
        )}
        {tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {tags.slice(0, 4).map(tag => tag && (
              <span key={tag.id} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
