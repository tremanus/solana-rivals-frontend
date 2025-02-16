"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpDown } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

// Define the type for our agent data
type Agent = {
  id: number
  rival: string
  name: string
  plPercentage: number
  walletAddress: string
}

export function Leaderboard() {
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    const fetchAgents = async () => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('agents')
        .select('user_id, name, card')

      if (error) {
        console.error('Error fetching agents:', error)
        return
      }

      // Combine DB data with dummy P/L% and wallet data
      const agentsWithDummyData = data.map(agent => ({
        id: agent.user_id,
        rival: `${agent.card}.png`,
        name: agent.name,
        plPercentage: Math.random() * 20, // Random P/L between 0-20%
        walletAddress: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`
      }))

      setAgents(agentsWithDummyData)
    }

    fetchAgents()
  }, [])

  // Sort agents by P/L% in descending order
  const sortedAgents = [...agents].sort((a, b) => b.plPercentage - a.plPercentage)

  return (
    <div className="w-4/5 mx-auto bg-[#051B2C]/30 border-2 border-white rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-white border-white text-lg font-bold border-b-2 pl-8">
              Rival
            </TableHead>
            <TableHead className="text-center border-x-2 border-white/50 border-dashed px-0 w-16 text-white text-lg font-bold">
              Rank
            </TableHead>
            <TableHead className="text-white border-b-2 border-white/50 border-dashed text-lg font-bold pl-8">
              Agent
            </TableHead>
            <TableHead className="text-white border-b-2 border-white/50 border-dashed text-lg font-bold pl-8">
              P/L% <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
            </TableHead>
            <TableHead className="text-white border-b-2 border-white/50 border-dashed text-lg font-bold pl-8">
              Wallet Address
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAgents.map((agent, index) => (
            <TableRow key={agent.id}>
              <TableCell className="py-2 border-white pl-8">
                <div className="flex justify-center items-center">
                  <Avatar className="h-12 w-12 rounded-none">
                    <AvatarImage src={agent.rival} alt={`Rival ${agent.name}`} />
                    <AvatarFallback>{agent.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </TableCell>
              <TableCell className="text-center font-bold border-x-2 border-white/50 border-dashed px-0 text-white">
                <span className="text-xl font-['Space_Grotesk'] font-bold tracking-wider">
                  {index + 1}
                </span>
              </TableCell>
              <TableCell className="font-medium text-white border-b-2 border-white/50 border-dashed pl-8">
                {agent.name}
              </TableCell>
              <TableCell className="text-white border-b-2 border-white/50 border-dashed pl-8">
                {agent.plPercentage.toFixed(2)}%
              </TableCell>
              <TableCell className="font-mono text-sm text-white/60 border-b-2 border-white/50 border-dashed pl-8">
                {agent.walletAddress}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
