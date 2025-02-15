"use client";

import React from "react";
import { createClient } from '@/utils/supabase/client';

interface StatsProps {
  userId?: string;
}

const behaviorLabels: Record<string, { label: string }> = {
  liquidity: { label: "Trade Speed" },
  history: { label: "Track Record" },
  market_cap: { label: "Market Size" },
  sentiment: { label: "Sentiment" },
  whale: { label: "Whale Watch" },
  risk: { label: "Risk Level" }
};

const barStyles = {
  container: {
    position: 'relative',
    width: '180px',
    height: '20px',
    backgroundColor: 'transparent',
    borderRadius: '2px',
    overflow: 'visible',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  labelContainer: {
    width: '120px',
    textAlign: 'left' as const,
    fontFamily: 'Courier, monospace'
  },
  barContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: '2px',
    border: '1px solid rgba(255, 255, 255, 0.6)'
  },
  value: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    left: '100%',
    marginLeft: '16px',
    whiteSpace: 'nowrap'
  }
} as const;

interface AgentStats {
  liquidity_num: number;
  history_num: number;
  market_cap_num: number;
  sentiment_num: number;
  whale_num: number;
  risk_num: number;
}

export function Stats({ userId }: StatsProps) {
  const [agentStats, setAgentStats] = React.useState<AgentStats | null>(null);

  React.useEffect(() => {
    const fetchAgentStats = async () => {
      try {
        const supabase = createClient();

        // If userId is not provided, get it from auth
        let effectiveUserId = userId;
        if (!effectiveUserId) {
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            console.error('Error getting user:', authError);
            return;
          }
          effectiveUserId = user.id;
        }

        const { data, error } = await supabase
          .from('agents')
          .select(`
            liquidity_num,
            history_num,
            market_cap_num,
            sentiment_num,
            whale_num,
            risk_num
          `)
          .eq('user_id', effectiveUserId)
          .single();

        if (error) {
          console.error('Error fetching agent stats:', error);
          return;
        }

        setAgentStats(data);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchAgentStats();
  }, [userId]);

  if (!agentStats) {
    return <div className="text-white">Loading...</div>;
  }

  const statsMap = {
    liquidity: agentStats.liquidity_num,
    history: agentStats.history_num,
    market_cap: agentStats.market_cap_num,
    sentiment: agentStats.sentiment_num,
    whale: agentStats.whale_num,
    risk: agentStats.risk_num
  };

  return (
    <div className="p-6 border border-white/10 rounded-lg">
      <h3 
        className="text-white text-xl font-medium mb-4 text-center relative inline-block w-full"
        style={{ 
          fontFamily: 'Courier, monospace',
        }}
      >
        <span
          className="relative"
          style={{
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
            width: '80%',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          Agent Statistics
        </span>
      </h3>
      <div className="space-y-2">
        {Object.entries(behaviorLabels).map(([key, { label }]) => {
          const value = statsMap[key as keyof typeof statsMap];
          return (
            <div key={key} className="flex items-center gap-6">
              <div style={barStyles.labelContainer} className="text-base text-white font-medium">
                {label}
              </div>
              <div style={barStyles.container}>
                <div 
                  style={{
                    ...barStyles.fill,
                    width: `${value}%`
                  }}
                >
                  <div style={barStyles.value}>{value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}