"use client"

import { createContext, useContext, useState } from 'react'

type OnboardingContextType = {
  walletAddress: string
  setWalletAddress: (address: string) => void
}

const OnboardingContext = createContext<OnboardingContextType>({
  walletAddress: '',
  setWalletAddress: () => {}
})

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState('')

  return (
    <OnboardingContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboardingContext = () => useContext(OnboardingContext) 