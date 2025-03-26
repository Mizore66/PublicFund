"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserStatus = "unauthenticated" | "wallet-connected" | "kyc-pending" | "kyc-verified"

export interface UserProfile {
  walletAddress: string
  displayName?: string
  email?: string
  kycStatus: UserStatus
  kycCompletedAt?: Date
  kycId?: string
}

interface AuthContextType {
  user: UserProfile | null
  status: UserStatus
  connectWallet: () => Promise<boolean>
  disconnectWallet: () => void
  startKycVerification: () => void
  completeKycVerification: (userData: Partial<UserProfile>) => void
  isLoading: boolean
}

// Default context values for SSR
const defaultContextValue: AuthContextType = {
  user: null,
  status: "unauthenticated",
  connectWallet: async () => false,
  disconnectWallet: () => {},
  startKycVerification: () => {},
  completeKycVerification: () => {},
  isLoading: false,
}

// Create both contexts with the same shape
const AuthContext = createContext<AuthContextType>(defaultContextValue)
const WalletAuthContext = createContext<AuthContextType>(defaultContextValue)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [status, setStatus] = useState<UserStatus>("unauthenticated")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setStatus(parsedUser.kycStatus)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }, [user])

  const connectWallet = async (): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Check if Phantom is installed
      const provider = window.phantom?.solana

      if (!provider?.isPhantom) {
        alert("Phantom wallet is not installed. Please install it to continue.")
        window.open("https://phantom.app/", "_blank")
        setIsLoading(false)
        return false
      }

      // Connect to Phantom wallet
      const response = await provider.connect()
      const walletAddress = response.publicKey.toString()

      // Check if user exists in our system
      const existingUser = localStorage.getItem(`user_${walletAddress}`)

      if (existingUser) {
        const parsedUser = JSON.parse(existingUser)
        setUser(parsedUser)
        setStatus(parsedUser.kycStatus)
      } else {
        // Create new user with wallet connected status
        const newUser: UserProfile = {
          walletAddress,
          kycStatus: "wallet-connected",
        }
        setUser(newUser)
        setStatus("wallet-connected")

        // If new user, redirect to KYC flow
        router.push("/kyc")
      }

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Error connecting to wallet:", error)
      setIsLoading(false)
      return false
    }
  }

  const disconnectWallet = () => {
    setUser(null)
    setStatus("unauthenticated")
    localStorage.removeItem("user")

    // Try to disconnect from Phantom if available
    try {
      window.phantom?.solana?.disconnect()
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  const startKycVerification = () => {
    if (!user) return

    router.push("/kyc")
  }

  const completeKycVerification = (userData: Partial<UserProfile>) => {
    if (!user) return

    const updatedUser: UserProfile = {
      ...user,
      ...userData,
      kycStatus: "kyc-verified",
      kycCompletedAt: new Date(),
      kycId: `KYC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    }

    setUser(updatedUser)
    setStatus("kyc-verified")
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Redirect to dashboard or home
    router.push("/dashboard")
  }

  const contextValue = {
    user,
    status,
    connectWallet,
    disconnectWallet,
    startKycVerification,
    completeKycVerification,
    isLoading,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      <WalletAuthContext.Provider value={contextValue}>{children}</WalletAuthContext.Provider>
    </AuthContext.Provider>
  )
}

// Export both hooks with their respective names
export function useAuth() {
  const context = useContext(AuthContext)
  return context
}

export function useWalletAuth() {
  const context = useContext(WalletAuthContext)
  return context
}

