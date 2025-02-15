"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: React.ElementType
  isActive?: boolean
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <SidebarMenu>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={item.url} passHref>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  padding: '0.75rem 1.5rem',
                  justifyContent: state === "expanded" ? 'flex-start' : 'center',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  transition: 'all 0.2s ease',
                  height: '2rem'
                }}
                className="hover:!bg-white/10 hover:!text-white"
              >
                <div className={`flex items-center ${state === "expanded" ? 'gap-4' : 'justify-center w-full'}`}>
                  <item.icon className="h-5 w-5" />
                  {state === "expanded" && <span className="translate-y-[1px]">{item.title}</span>}
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </div>
    </SidebarMenu>
  )
}
