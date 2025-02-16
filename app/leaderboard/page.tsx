"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Leaderboard } from "@/src/components/leaderboard"

export default function LeaderboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#060606] relative">
          <div className="max-w-7xl mx-auto p-6 relative z-10">
            <Leaderboard />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
