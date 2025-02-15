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

const behaviorLabels = {
  liquidity: "Trading Volume",
  projectHistory: "Track Record",
  marketCap: "Market Size",
  socialSentiment: "Sentiment",
  whaleMovements: "Whale Activity",
  riskTolerance: "Risk Level"
};

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
      <CardContent className="flex justify-between p-6 relative min-h-[600px]">
        {/* Left Side - Stats Section */}
        <div className="space-y-2 bg-[#0B1220] p-6 rounded-lg border border-white/10">
          {Object.entries(behaviorLabels).map(([key, label]) => {
            const value = userData.agentBehavior?.[key as keyof typeof userData.agentBehavior]?.slider || 0;
            return (
              <div key={key} className="flex items-center gap-3">
                <div className="w-44 text-base text-white font-medium">{label}</div>
                <div className="relative w-[200px] h-5">
                  {/* Background bar */}
                  <div className="absolute inset-0 bg-[#1a1a1a] rounded-sm" />
                  {/* Main blue bar */}
                  <div 
                    className="absolute inset-0 rounded-sm"
                    style={{ 
                      width: `${value}%`,
                      background: 'linear-gradient(180deg, #4299E1 0%, #2B6CB0 100%)',
                      boxShadow: '0 0 8px rgba(66, 153, 225, 0.5)'
                    }}
                  />
                  {/* Lighter blue overlay */}
                  <div 
                    className="absolute inset-0 rounded-sm opacity-50"
                    style={{ 
                      width: `${value}%`,
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)'
                    }}
                  />
                  {/* Value box at the end */}
                  <div 
                    className="absolute -right-7 top-0 bottom-0 flex items-center"
                  >
                    <div className="text-sm font-bold text-white">
                      {value}
                    </div>
                  </div>
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