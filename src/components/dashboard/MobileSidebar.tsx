'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { SidebarContent, type SidebarData } from '@/components/dashboard/Sidebar'
import { Menu } from 'lucide-react'

export function MobileSidebar(props: SidebarData) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-56 p-0 border-r border-border">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent {...props} />
        </SheetContent>
      </Sheet>
    </>
  )
}
