"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { fetchAndSortAgents } from "./leaderboard"

const styles = {
  container: {
    padding: '20px 32px',
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
    justifyContent: 'center',
    width: '100%'
  },
  rankBox: {
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
  const [rank, setRank] = useState<string>("...")

  useEffect(() => {
    const getRank = async () => {
      const supabase = createClient()
      
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Error getting user:', authError)
        return
      }

      const sortedAgents = await fetchAndSortAgents()
      const userRank = sortedAgents.findIndex(agent => agent.id === user.id) + 1
      setRank(`#${userRank}`)
    }

    getRank()
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.rankContainer}>
        <div style={styles.rankBox}>
          <div style={styles.rankNumber}>{rank}</div>
          <div style={styles.rankLabel}>Global Leaderboard</div>
        </div>
      </div>
    </div>
  )
}
