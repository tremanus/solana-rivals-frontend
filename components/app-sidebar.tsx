"use client"

import * as React from "react"
import { Trophy, Settings, ChevronLeft, Home } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const [userData, setUserData] = React.useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Error getting user:', authError);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('user_id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching username:', userError);
        return;
      }

      setUserData({
        name: userData.username,
        email: user.email || '',
        avatar: user.user_metadata.avatar_url || '/avatars/default.jpg'
      });
    };

    fetchUserData();
  }, []);

  const navItems = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: false,
    },
    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: Trophy,
      isActive: false,
    },
    {
      title: "Agent Settings",
      url: "/agent-settings",
      icon: Settings,
      isActive: false,
    },
  ];

  return (
    <Sidebar 
      collapsible="icon" 
      {...props}
      style={{
        background: 'linear-gradient(145deg, #000000, #111111)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        overflow: 'hidden'
      }}
      className="!overflow-hidden"
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="flex items-center justify-between px-4 pt-4">
          {state === "expanded" && (
            <h1 className="text-xl font-bold text-white">
              Solana Rivals
            </h1>
          )}
          <SidebarTrigger 
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              color: '#FFFFFF',
              backgroundColor: 'transparent',
              transition: 'all 0.2s ease'
            }}
            className={`hover:!bg-white/10 hover:!text-white ${state === "collapsed" ? "ml-auto" : ""}`}
          >
            <ChevronLeft style={{ height: '1.25rem', width: '1.25rem' }} />
          </SidebarTrigger>
        </div>
        <div 
          style={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
            marginTop: '1rem'
          }} 
        />
      </div>
      <SidebarContent 
        style={{ 
          paddingTop: '1rem', 
          color: '#FFFFFF',
          overflow: 'hidden'
        }}
      >
        <NavMain items={navItems} />
        {state === "expanded" && (
          <div className="flex flex-col mt-20 overflow-hidden">
            <div className="pl-0 flex justify-start" style={{ overflow: 'visible' }}>
              <Image
                src="/logo.png"
                alt="Solana Rivals Logo"
                width={350}
                height={350}
                className="rounded-full transition-all duration-300"
                style={{ 
                  marginTop: '2rem',
                  marginLeft: '-4rem',
                  filter: `
                    drop-shadow(0px 1px 1px rgba(255, 255, 255, 0.07))
                    drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.5))
                    drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.05))
                  `,
                  maxWidth: 'none',
                  overflow: 'visible',
                  opacity: 0.9,
                  transition: 'filter 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = `
                    drop-shadow(0px 1px 2px rgba(255, 255, 255, 0.1))
                    drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.6))
                    drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.08))
                  `
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = `
                    drop-shadow(0px 1px 1px rgba(255, 255, 255, 0.07))
                    drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.5))
                    drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.05))
                  `
                }}
              />
            </div>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter 
        style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF'
        }}
      >
        {userData && (
          <NavUser 
            user={{
              name: userData.name,
              email: userData.email,
              avatar: userData.avatar
            }} 
          />
        )}
      </SidebarFooter>
      <SidebarRail style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
    </Sidebar>
  )
}