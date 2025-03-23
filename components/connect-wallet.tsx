"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ConnectWalletProps {
  className?: string
  onConnect?: () => void
}

export function ConnectWallet({ className, onConnect }: ConnectWalletProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleConnect = () => {
    // In a real app, this would connect to MetaMask or another Web3 wallet
    // For this demo, we'll simulate a connection
    setTimeout(() => {
      const mockAddress =
        "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6)
      setWalletAddress(mockAddress)
      setIsConnected(true)
      setIsDialogOpen(false)
      if (onConnect) onConnect()
    }, 1000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setWalletAddress("")
  }

  if (isConnected) {
    return (
      <Button variant="outline" className={className} onClick={handleDisconnect}>
        {walletAddress}
      </Button>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={className}>Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>Connect your wallet to donate to projects and track your contributions.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleConnect}>MetaMask</Button>
          <Button onClick={handleConnect}>WalletConnect</Button>
          <Button onClick={handleConnect}>Coinbase Wallet</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

