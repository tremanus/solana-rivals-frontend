"use client"

import * as React from "react"
import { Trophy, User, ChevronLeft } from "lucide-react"
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
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      
      // Get auth user data
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Error getting user:', authError);
        return;
      }

      // Get username from users table
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
      title: "Leaderboard",
      url: "/leaderboard",
      icon: Trophy,
      isActive: false,
    },
    {
      title: "About",
      url: "/about",
      icon: User,
      isActive: false,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <div className="relative">
        <SidebarTrigger className="absolute right-2 top-2 p-2 hover:bg-white/5 rounded-lg">
          <ChevronLeft className="h-5 w-5" />
        </SidebarTrigger>
      </div>
      <SidebarContent className="pt-16">
        <NavMain items={navItems} />
        <div className="flex flex-col mt-8">
          <div className="pr-4 flex justify-end">
            <Image
              src="/logo.png"
              alt="Solana Rivals Logo"
              width={240}
              height={240}
              className="rounded-full"
              style={{ marginBottom: '-1rem', marginTop: '4rem' }}
            />
          </div>
          <div 
            className="text-center w-full"
            style={{ 
              fontFamily: 'Audiowide, cursive',
              color: '#1A0033',
              fontSize: '3rem',
              lineHeight: '3.5rem',
              textShadow: '0 0 10px rgba(255,255,255,0.3)'
            }}
          >
            <div>Solana</div>
            <div>Rivals</div>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10">
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
      <SidebarRail />
    </Sidebar>
  )
}
