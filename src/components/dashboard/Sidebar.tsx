'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Code, Sparkles, Terminal, StickyNote, File, Image,
  Link as LinkIcon, Star, Settings, PanelLeft,
  ChevronDown, ChevronRight, LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { mockUser } from '@/lib/mock-data'
import type { SidebarItemType } from '@/lib/db/items'
import type { SidebarCollection } from '@/lib/db/collections'

// ─── Static mappings ──────────────────────────────────────────────────────────

const PRO_TYPES = new Set(['file', 'image'])

const ICON_MAP: Record<string, LucideIcon> = {
  Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon,
}

const TYPE_PATH: Record<string, string> = {
  snippet: '/items/snippets',
  prompt: '/items/prompts',
  command: '/items/commands',
  note: '/items/notes',
  file: '/items/files',
  image: '/items/images',
  link: '/items/links',
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarData {
  itemTypes: SidebarItemType[]
  favoriteCollections: SidebarCollection[]
  recentCollections: SidebarCollection[]
  allCollections: SidebarCollection[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const NAV_LINK_CLASS =
  'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'

function NavItem({
  href, collapsed, tooltip, children,
}: {
  href: string; collapsed: boolean; tooltip: string; children: React.ReactNode
}) {
  if (!collapsed) {
    return <Link href={href} className={NAV_LINK_CLASS}>{children}</Link>
  }
  return (
    <Tooltip>
      <TooltipTrigger render={<Link href={href} className={cn(NAV_LINK_CLASS, 'justify-center px-0')} />}>
        {children}
      </TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

function SectionHeader({
  label, open, onToggle,
}: {
  label: string; open: boolean; onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="mb-1 flex w-full items-center justify-between px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
    >
      {label}
      {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
    </button>
  )
}

// ─── Sidebar content ──────────────────────────────────────────────────────────

export function SidebarContent({
  collapsed = false,
  onToggleCollapse,
  itemTypes,
  favoriteCollections,
  recentCollections,
  allCollections,
}: {
  collapsed?: boolean
  onToggleCollapse?: () => void
} & SidebarData) {
  const [favoritesOpen, setFavoritesOpen] = useState(true)
  const [recentOpen, setRecentOpen] = useState(true)
  const [allOpen, setAllOpen] = useState(false)

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* Navigation header */}
      <div className={cn(
        'flex items-center border-b border-border px-3 py-2.5',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        {!collapsed && (
          <span className="text-xs font-semibold text-foreground/70">Navigation</span>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">

        {/* Types */}
        {!collapsed && (
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Types
          </p>
        )}
        <nav className="space-y-0.5 px-2">
          {itemTypes.map(type => {
            const Icon = ICON_MAP[type.icon]
            return (
              <NavItem key={type.id} href={TYPE_PATH[type.name] ?? '#'} collapsed={collapsed} tooltip={type.name}>
                {Icon && <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />}
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate capitalize">{type.name}</span>
                    {PRO_TYPES.has(type.name) && (
                      <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 text-[10px] font-bold tracking-wider">
                        PRO
                      </Badge>
                    )}
                    <span className="text-xs tabular-nums text-muted-foreground/60">{type.itemCount}</span>
                  </>
                )}
              </NavItem>
            )
          })}
        </nav>

        {/* Collections — only shown when expanded */}
        {!collapsed && (
          <>
            <div className="my-3 mx-2 h-px bg-border" />

            {/* Favorites */}
            <div className="mb-2">
              <SectionHeader label="Favorites" open={favoritesOpen} onToggle={() => setFavoritesOpen(o => !o)} />
              {favoritesOpen && (
                <nav className="space-y-0.5 px-2">
                  {favoriteCollections.map(col => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className={NAV_LINK_CLASS}
                    >
                      <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
                      <span className="flex-1 truncate">{col.name}</span>
                      <span className="text-xs tabular-nums text-muted-foreground/60">
                        {col.itemCount}
                      </span>
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            {/* Recent */}
            <div className="mb-2">
              <SectionHeader label="Recent" open={recentOpen} onToggle={() => setRecentOpen(o => !o)} />
              {recentOpen && (
                <nav className="space-y-0.5 px-2">
                  {recentCollections.map(col => (
                    <Link key={col.id} href={`/collections/${col.id}`} className={NAV_LINK_CLASS}>
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                        <div
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: col.dominantColor ?? '#6b7280' }}
                        />
                      </div>
                      <span className="flex-1 truncate">{col.name}</span>
                      <span className="text-xs tabular-nums text-muted-foreground/60">
                        {col.itemCount}
                      </span>
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            {/* All Collections */}
            <div className="mb-2">
              <SectionHeader label="All Collections" open={allOpen} onToggle={() => setAllOpen(o => !o)} />
              {allOpen && (
                <nav className="space-y-0.5 px-2">
                  {allCollections.map(col => (
                    <Link key={col.id} href={`/collections/${col.id}`} className={NAV_LINK_CLASS}>
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                        {col.isFavorite
                          ? <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                        }
                      </div>
                      <span className="flex-1 truncate">{col.name}</span>
                      <span className="text-xs tabular-nums text-muted-foreground/60">
                        {col.itemCount}
                      </span>
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            {/* View all collections */}
            <div className="px-3 mt-1">
              <Link
                href="/collections"
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                View all collections →
              </Link>
            </div>
          </>
        )}
      </div>

      {/* User area */}
      <div className="border-t border-border p-2">
        <div className={cn(
          'flex items-center gap-2.5 rounded-md px-2 py-2',
          collapsed && 'justify-center',
        )}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
            {getInitials(mockUser.name)}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-xs font-medium leading-none text-foreground">
                  {mockUser.name}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                  {mockUser.email}
                </p>
              </div>
              <button className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Settings className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Desktop sidebar (owns collapse state) ────────────────────────────────────

export function Sidebar(props: SidebarData) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'hidden md:flex flex-col border-r border-border bg-background transition-all duration-200 shrink-0',
      collapsed ? 'w-14' : 'w-56',
    )}>
      <SidebarContent
        {...props}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />
    </aside>
  )
}
