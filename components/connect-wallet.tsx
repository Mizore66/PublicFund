"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, Shield, CheckCircle2, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

interface ConnectWalletProps {
  className?: string
  onConnect?: () => void
}

export function ConnectWallet({ className, onConnect }: ConnectWalletProps) {
  const { user, status, connectWallet, disconnectWallet, isLoading } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  // Check if Phantom is installed
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false)

  useEffect(() => {
    const checkPhantom = () => {
      const provider = window.phantom?.solana
      setIsPhantomInstalled(provider?.isPhantom || false)
    }

    // Check immediately
    checkPhantom()

    // Also check when window is fully loaded
    window.addEventListener("load", checkPhantom)
    return () => window.removeEventListener("load", checkPhantom)
  }, [])

  const handleConnect = async () => {
    const success = await connectWallet()
    if (success) {
      setIsDialogOpen(false)
      // if (onConnect) onConnect()
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
  }

  const handleKycRedirect = () => {
    setIsDialogOpen(false)
    router.push("/kyc")
  }

  const handleProfileRedirect = () => {
    setIsDialogOpen(false)
    router.push("/profile")
  }

  const getStatusIcon = () => {
    switch (status) {
      case "wallet-connected":
        return <Shield className="h-4 w-4 text-yellow-500" />
      case "kyc-pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "kyc-verified":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "wallet-connected":
        return "bg-yellow-500/20"
      case "kyc-pending":
        return "bg-yellow-500/20"
      case "kyc-verified":
        return "bg-green-500/20"
      default:
        return "bg-web3-highlight"
    }
  }

  if (user) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={`${className} border-primary/20 hover:bg-primary/10 transition-colors font-mono text-sm`}
          >
            <span className={`w-2 h-2 rounded-full ${getStatusColor()} mr-2 animate-pulse`}></span>
            {user.walletAddress.substring(0, 4)}...{user.walletAddress.substring(user.walletAddress.length - 4)}
            {getStatusIcon()}
          </Button>
        </DialogTrigger>
        <DialogContent className="web3-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
              Wallet Connected
            </DialogTitle>
            <DialogDescription className="text-foreground/70">
              {status === "kyc-verified"
                ? "Your wallet is connected and your identity is verified."
                : "Complete KYC verification to access all features."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/80">Wallet Address</span>
              <span className="font-mono text-sm">
                {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 6)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/80">Status</span>
              <div className="flex items-center">
                {getStatusIcon()}
                <span className="ml-1 text-sm">
                  {status === "wallet-connected" && "Wallet Connected"}
                  {status === "kyc-pending" && "KYC Pending"}
                  {status === "kyc-verified" && "Verified"}
                </span>
              </div>
            </div>
            {user.displayName && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">Name</span>
                <span className="text-sm">{user.displayName}</span>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-4">
              {status !== "kyc-verified" && (
                <Button className="web3-button" onClick={handleKycRedirect}>
                  Complete KYC Verification
                  <Shield className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
                onClick={handleProfileRedirect}
              >
                View Profile
              </Button>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/10" onClick={handleDisconnect}>
                Disconnect Wallet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={`${className} web3-button`}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="web3-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
            Connect your wallet
          </DialogTitle>
          <DialogDescription className="text-foreground/70">
            Connect your wallet to donate to projects and track your contributions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isPhantomInstalled && (
            <div className="rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20 mb-4">
              <h3 className="text-sm font-medium text-yellow-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Phantom Wallet Not Detected
              </h3>
              <p className="text-xs mt-1 text-foreground/70">
                Please install the Phantom wallet extension to continue.
              </p>
              <Button
                className="mt-2 w-full"
                variant="outline"
                onClick={() => window.open("https://phantom.app/", "_blank")}
              >
                Install Phantom
              </Button>
            </div>
          )}

          <Button
            onClick={handleConnect}
            disabled={!isPhantomInstalled || isLoading}
            className="web3-card hover:bg-muted/50 transition-colors flex items-center justify-between"
          >
            <span>Phantom Wallet</span>
            <svg width="32" height="32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="128" height="128" rx="64" fill="#AB9FF2" />
              <path
                d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.753 23 15 41.4057 15 64.9142C15 88.4227 33.753 106.828 56.7724 106.828H64.6716C85.7290 106.828 102.685 89.8956 102.685 68.8859C102.685 67.8278 103.550 66.9714 104.619 66.9714H110.584C111.653 66.9714 112.519 67.8278 112.519 68.8859C112.519 94.0172 91.4573 114.828 65.9905 114.828H56.7724C29.2604 114.828 7 92.7863 7 64.9142C7 37.0421 29.2604 15 56.7724 15C84.2843 15 106.545 37.0421 106.545 64.9142H110.584V64.9142Z"
                fill="white"
              />
              <path
                d="M96.3992 64.9142C96.3992 66.9714 94.7558 68.8859 92.6809 68.8859H89.0716C86.9967 68.8859 85.3533 67.2571 85.3533 64.9142C85.3533 62.5714 86.9967 60.9428 89.0716 60.9428H92.6809C94.7558 60.9428 96.3992 62.8571 96.3992 64.9142Z"
                fill="white"
              />
            </svg>
          </Button>

          <div className="text-xs text-foreground/60 text-center mt-2">
            By connecting your wallet, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConnectWallet

