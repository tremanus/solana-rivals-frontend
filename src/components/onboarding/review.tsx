import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewProps {
  userData: {
    username?: string;
    avatar?: {
      avatarId: string;
      name: string;
    };
    agentBehavior?: {
      liquidity: { slider: number; option: string };
      projectHistory: { slider: number; option: string };
      marketCap: { slider: number; option: string };
      socialSentiment: { slider: number; option: string };
      whaleMovements: { slider: number; option: string };
      riskTolerance: { slider: number; option: string };
    };
  };
}

const behaviorLabels: Record<string, { label: string; colors: [string, string] }> = {
  liquidity: {
    label: "Trading Speed",
    colors: ['#00A3FF', '#0058AA']  // Blue
  },
  projectHistory: {
    label: "Track Record",
    colors: ['#FF6B6B', '#C92A2A']  // Red
  },
  marketCap: {
    label: "Market Size",
    colors: ['#51CF66', '#2B8A3E']  // Green
  },
  socialSentiment: {
    label: "Sentiment",
    colors: ['#FFD43B', '#F08C00']  // Yellow
  },
  whaleMovements: {
    label: "Whale Activity",
    colors: ['#CC5DE8', '#862E9C']  // Purple
  },
  riskTolerance: {
    label: "Risk Level",
    colors: ['#FF922B', '#D9480F']  // Orange
  }
};

const barStyles = {
  container: {
    position: 'relative',
    width: '180px',
    height: '20px',
    backgroundColor: '#1a1a1a',
    borderRadius: '2px',
    overflow: 'visible'
  },
  labelContainer: {
    width: '120px',  // Fixed width for labels
    textAlign: 'left' as const
  },
  barContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: '2px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '50%',
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0))',
    borderRadius: '2px'
  },
  value: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    left: '100%',
    marginLeft: '8px',
    whiteSpace: 'nowrap'
  }
} as const;

export function Review({ userData }: ReviewProps) {
  return (
    <Card className="w-full max-w-4xl bg-[#0B1220] border-none">
      <CardHeader className="text-center pb-2">
        <div className="text-white text-2xl mb-2">You have built:</div>
        <CardTitle 
          className="text-7xl font-bold" 
          style={{ color: '#F59E0B' }}
        >
          {userData.avatar?.name?.toUpperCase() || "UNNAMED AGENT"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center p-6 relative min-h-[600px] gap-8">
        {/* Left Side - Stats Section */}
        <div 
          className="bg-[#0B1220] p-6 rounded-lg border border-white/10"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          {Object.entries(behaviorLabels).map(([key, { label, colors }]) => {
            const value = userData.agentBehavior?.[key as keyof typeof userData.agentBehavior]?.slider || 0;
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={barStyles.labelContainer} className="text-base text-white font-medium">
                  {label}
                </div>
                <div style={barStyles.container}>
                  <div 
                    style={{
                      ...barStyles.fill,
                      width: `${value}%`,
                      background: `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`
                    }}
                  >
                    <div style={barStyles.value}>{value}</div>
                  </div>
                  <div 
                    style={{
                      ...barStyles.shine,
                      width: `${value}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side - Avatar Section */}
        <div className="relative w-[400px] h-[400px]">
          <Image
            src={`/${userData.avatar?.avatarId || 'default'}.png`}
            alt={userData.avatar?.name || "Selected Avatar"}
            width={400}
            height={400}
            priority
            className="rounded-xl object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}