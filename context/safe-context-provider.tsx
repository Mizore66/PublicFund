"use client"

import { type ReactNode, useEffect, useState } from "react"
import { AuthProvider } from "@/context/auth-context"

export function SafeContextProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Only render the children when the component is mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR and initial client render, provide a minimal UI
  // This prevents the "useWalletAuth must be used within a WalletAuthProvider" error
  if (!mounted) {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  return <AuthProvider>{children}</AuthProvider>
}

