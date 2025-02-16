"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { fetchAndSortAgents } from "./leaderboard"

const styles = {
  container: {
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '32px',
    width: '400px'
  },
  rankContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    gap: '24px'
  },
  rankBox: {
    flex: 1,
    textAlign: 'center' as const,
    color: '#FFFFFF'
  },
  rankNumber: {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  rankLabel: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Courier, monospace'
  }
}

export function Rank() {
  const [profitRank, setProfitRank] = useState<string>("...")
  const [totalReturnRank, setTotalReturnRank] = useState<string>("...")

  useEffect(() => {
    const getRank = async () => {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Error getting user:', authError)
        return
      }

      // Get sorted agents list
      const sortedAgents = await fetchAndSortAgents()
      
      // Find user's rank
      const userRank = sortedAgents.findIndex(agent => agent.id === user.id) + 1
      
      // Format rank with #
      const formattedRank = `#${userRank}`
      setProfitRank(formattedRank)
      setTotalReturnRank(formattedRank) // Using same rank for both for now
    }

    getRank()
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.rankContainer}>
        <div style={styles.rankBox}>
          <div style={styles.rankNumber}>{profitRank}</div>
          <div style={styles.rankLabel}>% Profit</div>
        </div>
        <div style={styles.rankBox}>
          <div style={styles.rankNumber}>{totalReturnRank}</div>
          <div style={styles.rankLabel}>Total Return</div>
        </div>
      </div>
    </div>
  )
}
