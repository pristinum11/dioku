import { BookMarked, Folders, Package, Star } from 'lucide-react'
import { DashboardStats } from '@/lib/db/collections'

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const items = [
    {
      label: 'Total Items',
      value: stats.totalItems,
      icon: Package,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-400/10',
    },
    {
      label: 'Collections',
      value: stats.totalCollections,
      icon: Folders,
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-400/10',
    },
    {
      label: 'Favorite Items',
      value: stats.favoriteItems,
      icon: Star,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-400/10',
    },
    {
      label: 'Fav Collections',
      value: stats.favoriteCollections,
      icon: BookMarked,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(({ label, value, icon: Icon, iconColor, iconBg }) => (
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
