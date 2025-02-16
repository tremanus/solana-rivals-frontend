"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

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
    textAlign: 'center',
    marginBottom: '8px',
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

interface WalletBalance {
    solBalance: number;
    solValue: number;
    totalUsdValue: number;
    totalSolValue: number;
  }
  
  export function Wallet() {
    const [balance, setBalance] = useState<WalletBalance | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    const fetchBalance = async () => {
      try {
        console.log('Starting balance fetch...');
        setIsLoading(true);
        
        const response = await fetch('/api/balance');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error response:', errorData);
          throw new Error(`Failed to fetch balance: ${response.status} ${errorData}`);
        }
  
        const data: WalletBalance = await response.json();
        console.log('Received balance data:', data);
        setBalance(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Detailed fetch error:', error);
          console.error('Error stack:', error.stack);
        } else {
          console.error('Detailed fetch error:', String(error));
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      console.log('Wallet component mounted');
      fetchBalance();
      
      const intervalId = setInterval(() => {
        console.log('Running periodic balance update');
        fetchBalance();
      }, 600000);
  
      return () => {
        console.log('Cleaning up interval');
        clearInterval(intervalId);
      };
    }, []);
  
    if (isLoading && !balance) {
      return (
        <div style={styles.container}>
          <div style={styles.contentContainer}>
            <div style={styles.balance}>Loading...</div>
          </div>
        </div>
      );
    }
  
    return (
      <div style={styles.container}>
        <div style={styles.contentContainer}>
          {/* Main Balance Display */}
          <div style={styles.balance}>
            ${balance?.totalUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}
          </div>
  {/* SOL Balance */}
  <div style={styles.solBalance}>
            <span className="flex items-center justify-center gap-2">
              {balance?.solBalance.toFixed(2) ?? '0.00'} <img src="/solana.png" alt="SOL" className="w-5 h-5" />
            </span>
          </div>
          {/* Profit Stats */}
          <div style={styles.profitContainer}>
            <span style={styles.profitText}>
              ${balance?.solValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}
            </span>
            <span style={styles.profitPercentage} className="flex items-center gap-1">
              {balance?.totalSolValue.toFixed(2) ?? '0.00'} <img src="/solana.png" alt="SOL" className="w-5 h-5" />
            </span>
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
                fontSize: '16px',
                padding: '16px',
                whiteSpace: 'nowrap',
                borderRadius: '12px'
              }}
            >
              <span className="flex items-center gap-2">
                Convert to <img src="/solana.png" alt="SOL" className="w-4 h-4" />
              </span>
            </Button>
            <Button 
              className="flex-1 py-8 bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all"
              style={{ 
                fontFamily: 'Courier, monospace',
                fontSize: '16px',
                padding: '16px',
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