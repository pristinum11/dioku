import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FolderPlus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
            D
          </div>
          <span className="text-sm">Dioku</span>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-9 pr-16 bg-muted border-0 focus-visible:ring-1"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            ⌘K
          </kbd>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <FolderPlus className="h-4 w-4" />
            New Collection
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Item
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar placeholder */}
        <aside className="w-56 shrink-0 border-r border-border p-4">
          <h2 className="text-sm font-semibold text-muted-foreground">Sidebar</h2>
        </aside>

        {/* Main placeholder */}
        <main className="flex-1 overflow-auto p-6">
          <h2 className="text-sm font-semibold text-muted-foreground">Main</h2>
        </main>
      </div>
    </div>
  );
}
