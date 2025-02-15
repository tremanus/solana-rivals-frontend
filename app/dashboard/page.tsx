"use client";

import { Stats } from "@/src/components/stats";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Wallet } from "@/src/components/wallet";
import { Rank } from "@/src/components/rank";

export default function DashboardPage() {
  const [agent, setAgent] = useState<{ card: string; name: string } | null>(null);
  const [stars, setStars] = useState<Array<{top: string, left: string, animationDelay: string}>>([])

  useEffect(() => {
    // Generate stars only on client-side
    setStars(Array.from({ length: 100 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`
    })))
  }, [])

  const starStyles = {
    container: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      opacity: 0.3,
      pointerEvents: 'none' as const
    },
    star: {
      position: 'absolute' as const,
      width: '3px',
      height: '3px',
      backgroundColor: '#FFFFFF',
      borderRadius: '50%',
      opacity: 0.7
    },
    componentBackground: {
      backgroundColor: 'rgba(6, 6, 6, 0.7)',
      backdropFilter: 'blur(2px)',
      borderRadius: '12px'
    }
  }

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
        <div className="min-h-screen bg-[#060606] relative">
          {/* Stars background */}
          <div style={starStyles.container}>
            {stars.map((star, index) => (
              <div
                key={index}
                style={{
                  ...starStyles.star,
                  top: star.top,
                  left: star.left,
                  animation: `
                    twinkle 3s infinite,
                    drift 15s infinite linear
                  `,
                  animationDelay: `${star.animationDelay}, ${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="max-w-7xl mx-auto p-6 relative z-10">
            <div className="flex justify-center items-start gap-16">
              {/* Left Side - Rank and Wallet */}
              <div className="flex flex-col gap-8 mt-20">
                <div style={starStyles.componentBackground}>
                  <Wallet />
                </div>
                <div style={starStyles.componentBackground}>
                  <Rank />
                </div>
              </div>

              {/* Right Side - Agent Data */}
              <div className="flex flex-col items-center">
                {agent && (
                  <div style={{
                    ...starStyles.componentBackground,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '24px'
                  }}>
                    <div 
                      className="text-5xl font-bold mb-4 text-white"
                      style={{ 
                        fontFamily: 'Courier, monospace',
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      {agent.name}
                    </div>
                    <div className="relative w-[400px] h-[400px] mb-4">
                      <video
                        src={`/${agent.card}.mp4`}
                        width={400}
                        height={400}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="rounded-lg"
                        style={{
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Stats Section */}
                <div className="w-fit" style={starStyles.componentBackground}>
                  <Stats />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Add to your global.css
const globalStyles = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  @keyframes drift {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(100px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`
