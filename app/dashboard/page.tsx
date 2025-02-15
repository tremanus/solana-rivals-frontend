"use client";

import { Stats } from "@/src/components/stats";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardPage() {
  const [agent, setAgent] = useState<{ card: string; name: string } | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      const supabase = createClient();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Error getting user:', authError);
        return;
      }

      const { data, error } = await supabase
        .from('agents')
        .select('card, name')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching agent:', error);
        return;
      }

      setAgent(data);
    };

    fetchAgent();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#0B1220]">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                {agent && (
                  <>
                    <div 
                      className="text-5xl font-bold mb-4 text-white"
                      style={{ fontFamily: 'Courier, monospace' }}
                    >
                      {agent.name}
                    </div>
                    <div className="relative w-[400px] h-[400px] mb-4">
                      <Image
                        src={`/${agent.card}.png`}
                        alt="Agent Avatar"
                        width={400}
                        height={400}
                        priority
                        className="rounded-xl object-cover"
                      />
                    </div>
                  </>
                )}
                
                {/* Stats Section */}
                <div className="w-fit">
                  <Stats />
                </div>
              </div>

              {/* Buttons Section */}
              <div className="flex flex-col gap-4 mt-20">
                <Button 
                  className="w-[240px] py-6 bg-white/5 hover:bg-white/10 text-white font-medium text-lg border border-white/10 transition-all"
                  style={{ fontFamily: 'Courier, monospace' }}
                >
                  Add Funds
                </Button>
                <div className="flex gap-4">
                  <Button 
                    className="w-[116px] py-6 bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all"
                    style={{ fontFamily: 'Courier, monospace' }}
                  >
                    Withdraw
                    <br />
                    SOL
                  </Button>
                  <Button 
                    className="w-[116px] py-6 bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all"
                    style={{ fontFamily: 'Courier, monospace' }}
                  >
                    Withdraw
                    <br />
                    All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
