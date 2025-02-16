"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Leaderboard } from "@/src/components/leaderboard"
import { useEffect, useState } from "react"

export default function LeaderboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking if all resources are loaded
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#060606] relative">
          <div className="max-w-7xl mx-auto p-6 relative z-10">
            {isLoading ? (
              <div className="w-4/5 mx-auto h-2 bg-[#051B2C]/30 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-[loading_1s_ease-in-out_infinite]" 
                  style={{
                    width: '30%',
                    animation: 'loading 1s ease-in-out infinite',
                    background: 'linear-gradient(90deg, transparent, white, transparent)',
                  }}
                />
              </div>
            ) : (
              <Leaderboard />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
