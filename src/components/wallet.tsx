"use client"

import React from "react"
import { Button } from "@/components/ui/button"

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
  contentContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    width: '100%'
  },
  balance: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: '8px',
    textAlign: 'center'
  },
  profitContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: '#4ADE80'
  },
  profitText: {
    fontSize: '24px',
    fontWeight: '500'
  },
  profitPercentage: {
    fontSize: '24px',
    fontWeight: '500',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    padding: '6px 12px',
    borderRadius: '6px'
  },
  solBalance: {
    fontSize: '24px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '12px',
    textAlign: 'center',
    width: '80%'
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    width: '100%'
  },
  withdrawContainer: {
    display: 'flex',
    gap: '20px',
    width: '100%'
  }
} as const

export function Wallet() {
  return (
    <div style={styles.container}>
      <div style={styles.contentContainer}>
        {/* Main Balance Display */}
        <div style={styles.balance}>
          $17,382.82
        </div>

        {/* Profit Stats */}
        <div style={styles.profitContainer}>
          <span style={styles.profitText}>+$1,399.22</span>
          <span style={styles.profitPercentage}>+13.3%</span>
        </div>

        {/* SOL Balance */}
        <div style={styles.solBalance}>
          68.94 SOL
        </div>
      </div>

      {/* Buttons Section */}
      <div style={styles.buttonsContainer}>
        <Button 
          className="bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all mx-auto"
          style={{ 
            fontFamily: 'Courier, monospace',
            fontSize: '28px',
            padding: '24px',
            borderRadius: '12px'
          }}
        >
          Add Funds
        </Button>
        <div style={styles.withdrawContainer}>
          <Button 
            className="flex-1 py-8 bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all"
            style={{ 
              fontFamily: 'Courier, monospace',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              borderRadius: '12px'
            }}
          >
            Withdraw SOL
          </Button>
          <Button 
            className="flex-1 py-8 bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all"
            style={{ 
              fontFamily: 'Courier, monospace',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              borderRadius: '12px'
            }}
          >
            Withdraw All
          </Button>
        </div>
      </div>
    </div>
  )
}
