"use client"

import { createContext, useContext } from "react"
import type { UserProfile, UserStatus } from "@/context/auth-context"

interface WalletAuthContextType {
  user: UserProfile | null
  status: UserStatus
  startKycVerification: () => void
}

// Default context values for SSR
const defaultContextValue: WalletAuthContextType = {
  user: null,
  status: "unauthenticated",
  startKycVerification: () => {},
}

const WalletAuthContext = createContext<WalletAuthContextType>(defaultContextValue)

export function useWalletAuth() {
  const context = useContext(WalletAuthContext)
  if (!context) {
    throw new Error("useWalletAuth must be used within a WalletAuthProvider")
  }
  return context
}

