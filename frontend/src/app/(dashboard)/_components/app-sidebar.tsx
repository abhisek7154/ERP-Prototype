"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "~/app/(dashboard)/_components/nav-main"
import { NavSecondary } from "~/app/(dashboard)/_components/nav-secondary"
import {
  sidebarNavCategories,
  sidebarSecondaryNav,
} from "~/app/(dashboard)/_components/sidebar-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { FaBookOpenReader } from "react-icons/fa6"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <FaBookOpenReader className="size-6!" />
                <span className="text-base font-semibold">Shri ERP</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain categories={sidebarNavCategories} />
        <NavSecondary items={sidebarSecondaryNav} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
