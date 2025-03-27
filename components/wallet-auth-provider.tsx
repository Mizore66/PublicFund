"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  walletAddress: string
  name?: string
  role: string
  kycStatus: "none" | "pending" | "approved" | "rejected"
}

interface WalletAuthContextType {
  user: User | null
  isLoading: boolean
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  getWalletAddress: () => string | null
}

const WalletAuthContext = createContext<WalletAuthContextType | undefined>(undefined)

export function useWalletAuth() {
  const context = useContext(WalletAuthContext)
  if (context === undefined) {
    throw new Error("useWalletAuth must be used within a WalletAuthProvider")
  }
  return context
}

interface WalletAuthProviderProps {
  children: ReactNode
}

export function WalletAuthProvider({ children }: WalletAuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          console.log('response', response)
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Get wallet address from browser
  const getWalletAddress = (): string | null => {
    // Check if Solana wallet is available
    if (typeof window !== "undefined" && window.solana?.isPhantom) {
      return window.solana.publicKey?.toString() || null
    }
    return null
  }

  // Connect wallet and authenticate
  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      // Check if Solana wallet is available
      if (typeof window === "undefined" || !window.solana?.isPhantom) {
        throw new Error("No Solana wallet found. Please install Phantom or another wallet.")
      }

      // Request account access
      const response = await window.solana.connect()
      const walletAddress = response.publicKey.toString()

      if (!walletAddress) {
        throw new Error("No wallet address found")
      }

      // Get nonce from server
      console.log("Wallet address:", walletAddress)
      const nonceResponse = await fetch(`/api/auth/nonce?walletAddress=${walletAddress}`)
      const { nonce } = await nonceResponse.json()

      // Create message to sign
      const message = `Sign this message to authenticate with PublicFund: ${nonce}`

      console.log("Message to sign:", message)

      // Request signature
      const encodedMessage = new TextEncoder().encode(message)
      let signedMessage;
      try {
        signedMessage = await window.solana.signMessage(encodedMessage, "utf8")
      } catch (error) {
        throw new Error("Failed to sign the message. Ensure your wallet supports message signing.")
      }

      console.log("Signed message:", signedMessage)
      // Verify signature on server
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress, signature: signedMessage?.signature }),
      })

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json()
        throw new Error(error.message || "Authentication failed")
      }

      const { user } = await verifyResponse.json()
      setUser(user)

      // Refresh the page to update UI
      router.refresh()

      return user
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.refresh()
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  const value = {
    user,
    isLoading,
    isConnecting,
    connectWallet,
    disconnectWallet,
    getWalletAddress,
  }

  return <WalletAuthContext.Provider value={value}>{children}</WalletAuthContext.Provider>
}

// Add TypeScript support for window.solana
declare global {
  interface Window {
    solana?: any
  }
}

