import { BookMarked, Folders, Package, Star } from 'lucide-react'
import { mockCollections, mockItems } from '@/lib/mock-data'

const stats = [
  {
    label: 'Total Items',
    value: mockItems.length,
    icon: Package,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
  },
  {
    label: 'Collections',
    value: mockCollections.length,
    icon: Folders,
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-400/10',
  },
  {
    label: 'Favorite Items',
    value: mockItems.filter(i => i.isFavorite).length,
    icon: Star,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
  },
  {
    label: 'Fav Collections',
    value: mockCollections.filter(c => c.isFavorite).length,
    icon: BookMarked,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, iconColor, iconBg }) => (
        <div key={label} className="rounded-lg border border-border bg-card p-4">
          <div className={`mb-3 inline-flex rounded-md p-2 ${iconBg}`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  )
}
