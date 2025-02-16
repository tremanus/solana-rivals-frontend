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
    plPercentage: [23.71, -8.61, -7.85][index], // Directly assign values based on index
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
    <div className="w-4/5 mx-auto bg-[#051B2C]/30 rounded-lg select-none" style={{ border: '2px solid white' }}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead 
              className="text-white text-lg font-bold"
              style={{ borderBottom: '2px solid white' }}
            >
              Agent
            </TableHead>
            <TableHead 
              className="text-white text-lg font-bold"
              style={{ paddingLeft: '32px' }}
            >
              Profit/Loss
            </TableHead>
            <TableHead 
              className="text-white text-lg font-bold"
              style={{ paddingLeft: '32px' }}
            >
              Wallet Address
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent, index) => (
            <TableRow key={agent.id} className="hover:bg-transparent">
              <TableCell style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '48px',
                padding: '16px 0',
                paddingLeft: '16px'
              }}>
                <span style={{ 
                  fontSize: '24px',
                  fontFamily: 'Space Grotesk',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  color: 'white',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                }}>
                  #{index + 1}
                </span>
                <Avatar className="h-12 w-12 rounded-none">
                  <AvatarImage src={agent.rival} alt={`Rival ${agent.name}`} />
                  <AvatarFallback>{agent.name[0]}</AvatarFallback>
                </Avatar>
                <span style={{ 
                  fontWeight: '500',
                  color: 'white',
                  fontSize: '18px'
                }}>
                  {agent.name}
                </span>
              </TableCell>
              <TableCell 
                style={{ 
                  color: agent.plPercentage >= 0 ? '#4ade80' : '#ef4444',
                  paddingLeft: '32px',
                  fontWeight: '500'
                }}
              >
                {agent.plPercentage >= 0 ? '+' : '-'}${Math.abs(agent.plPercentage).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </TableCell>
              <TableCell 
                style={{ 
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  paddingLeft: '32px',
                  cursor: 'pointer'
                }}
                onClick={() => copyToClipboard(agent.walletAddress)}
                title="Click to copy"
              >
                {agent.walletAddress}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
