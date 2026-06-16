import Link from 'next/link'
import { StatsCards } from './StatsCards'
import { CollectionCard } from './CollectionCard'
import { ItemCard } from './ItemCard'
import { mockItems } from '@/lib/mock-data'
import { getRecentCollections, getDashboardStats } from '@/lib/db/collections'

const pinnedItems = mockItems.filter(i => i.isPinned)

const recentItems = [...mockItems]
  .filter(i => !i.isPinned)
  .sort((a, b) => {
    const aDate = (a.lastUsedAt ?? a.createdAt).getTime()
    const bDate = (b.lastUsedAt ?? b.createdAt).getTime()
    return bDate - aDate
  })
  .slice(0, 10)

export async function DashboardMain() {
  const [collections, stats] = await Promise.all([
    getRecentCollections(),
    getDashboardStats(),
  ])

  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-6">

        {/* Page header */}
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Your developer knowledge hub</p>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Collections */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Collections</h2>
            <Link
              href="/collections"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map(col => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        </section>

        {/* Pinned */}
        {pinnedItems.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold">Pinned</h2>
            <div className="space-y-2">
              {pinnedItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Recent */}
        {recentItems.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold">Recent</h2>
            <div className="space-y-2">
              {recentItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
