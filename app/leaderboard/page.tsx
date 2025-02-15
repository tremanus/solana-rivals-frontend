"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen bg-[#060606]">
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
      <main className="flex-1 p-6">
        {/* Your leaderboard content here */}
        <h1 className="text-white text-2xl font-semibold">Leaderboard</h1>
        {/* Add your leaderboard table/content */}
      </main>
    </div>
  )
}
