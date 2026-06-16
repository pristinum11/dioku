import { notFound } from 'next/navigation'
import { ItemCard } from '@/components/dashboard/ItemCard'
import { getItemsByTypeName, getItemTypesWithCounts } from '@/lib/db/items'

// Maps plural URL slug → singular DB type name
const SLUG_TO_TYPE: Record<string, string> = {
  snippets: 'snippet',
  prompts: 'prompt',
  commands: 'command',
  notes: 'note',
  files: 'file',
  images: 'image',
  links: 'link',
}

export default async function ItemsTypePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const typeName = SLUG_TO_TYPE[type]
  if (!typeName) notFound()

  const [items, allTypes] = await Promise.all([
    getItemsByTypeName(typeName),
    getItemTypesWithCounts(),
  ])

  const typeInfo = allTypes.find(t => t.name === typeName)
  if (!typeInfo) notFound()

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-6">

          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${typeInfo.color}20` }}
            >
              <span className="text-sm" style={{ color: typeInfo.color }}>
                {typeInfo.itemCount}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-semibold capitalize">{typeName}s</h1>
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No {typeName}s yet.
            </p>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
