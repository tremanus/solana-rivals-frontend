"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { toast } from 'sonner'

// Move this type to a shared types file later if needed
export type Agent = {
  id: number
  rival: string
  name: string
  plPercentage: number
  walletAddress: string
}

// Function to get fixed P/L value based on user_id
const getFixedValue = (userId: string): number => {
  // Just return values based on index position
  const values = [23.71, -8.61, -7.85]
  return values[0] // First agent gets 23.71
}

// Update the fetchAndSortAgents function
export const fetchAndSortAgents = async () => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('agents')
    .select('user_id, name, card')
    .limit(3) // Only get first 3 agents

  if (error) {
    console.error('Error fetching agents:', error)
    return []
  }

  const agentsWithData = data.map((agent, index) => ({
    id: agent.user_id,
    rival: `${agent.card}.png`,
    name: agent.name,
    plPercentage: [23.71, 62.85, -7.85][index], // Directly assign values based on index
    walletAddress: `0x${agent.user_id.slice(0, 4)}...${agent.user_id.slice(-4)}`
  }))

  return agentsWithData.sort((a, b) => b.plPercentage - a.plPercentage)
}

export function Leaderboard() {
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    const getAgents = async () => {
      const sortedAgents = await fetchAndSortAgents()
      setAgents(sortedAgents)
    }

    getAgents()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard', {
      duration: 1000 // 1 second
    })
  }

  return (
    <div style={{
      width: '80%',
      margin: '0 auto',
      backgroundColor: '#1a1b1e',
      borderRadius: '8px',
      padding: '24px'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '24px'
      }}>
        Top Performers
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {agents.map((agent, index) => (
          <div 
            key={agent.id} 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#25262b',
              padding: '16px',
              borderRadius: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Rank with trophy/medal styling */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {index === 0 && <span style={{ fontSize: '20px' }}>🏆</span>}
                {index === 1 && <span style={{ fontSize: '20px' }}>🥈</span>}
                {index === 2 && <span style={{ fontSize: '20px' }}>🥉</span>}
                <span style={{ color: 'white', marginLeft: '8px' }}>#{index + 1}</span>
              </div>

              {/* Agent info */}
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage src={agent.rival} alt={agent.name} />
                <AvatarFallback>{agent.name[0]}</AvatarFallback>
              </Avatar>
              <span style={{ color: 'white', fontWeight: 500 }}>{agent.name}</span>
            </div>

            {/* Right side info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <span style={{ 
                fontSize: '18px',
                fontWeight: 500,
                color: agent.plPercentage >= 0 ? '#4ade80' : '#ef4444'
              }}>
                {agent.plPercentage >= 0 ? '+' : '-'}${Math.abs(agent.plPercentage).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
              <span 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontFamily: 'monospace',
                  cursor: 'pointer'
                }}
                onClick={() => copyToClipboard(agent.walletAddress)}
                title="Click to copy"
              >
                {agent.walletAddress}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
