"use client";

import React from "react";
import { createClient } from '@/utils/supabase/client';

interface StatsProps {
  userId?: string;  // Optional since we can get it from auth if not provided
}

const behaviorLabels: Record<string, { label: string }> = {
  liquidity: {
    label: "Trade Speed"
  },
  history: {
    label: "Track Record"
  },
  market_cap: {
    label: "Market Size"
  },
  sentiment: {
    label: "Sentiment"
  },
  whale: {
    label: "Whale Watch"
  },
  risk: {
    label: "Risk Level"
  }
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

export function Stats({ userId }: StatsProps) {
  const [agentStats, setAgentStats] = React.useState<{
    liquidity_num: number;
    history_num: number;
    market_cap_num: number;
    sentiment_num: number;
    whale_num: number;
    risk_num: number;
  } | null>(null);

  React.useEffect(() => {
    const fetchAgentStats = async () => {
      const supabase = createClient();

      // If userId is not provided, get it from auth
      if (!userId) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('Error getting user:', authError);
          return;
        }
        userId = user.id;
      }

      // Get agent stats using user_id
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
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching agent stats:', error);
        return;
      }

      setAgentStats(data);
    };

    fetchAgentStats();
  }, [userId]);

  if (!agentStats) {
    return <div>Loading...</div>;
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
    <div 
      className="bg-[#0B1220] p-6 rounded-lg border border-white/10"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      {Object.entries(behaviorLabels).map(([key, { label }]) => {
        const value = statsMap[key as keyof typeof statsMap];
        return (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
  );
}