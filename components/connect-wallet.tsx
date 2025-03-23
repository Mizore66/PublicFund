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
import { Wallet } from "lucide-react"

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
      <Button
        variant="outline"
        className={`${className} border-primary/20 hover:bg-primary/10 transition-colors font-mono text-sm`}
        onClick={handleDisconnect}
      >
        <span className="w-2 h-2 rounded-full bg-web3-highlight mr-2 animate-pulse"></span>
        {walletAddress}
      </Button>
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
          <Button
            onClick={handleConnect}
            className="web3-card hover:bg-muted/50 transition-colors flex items-center justify-between"
          >
            <span>MetaMask</span>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M27.2684 4.03027L17.5018 11.2841L19.3079 7.00442L27.2684 4.03027Z"
                fill="#E17726"
                stroke="#E17726"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.7218 4.03027L14.4156 11.3397L12.6921 7.00442L4.7218 4.03027Z"
                fill="#E27625"
                stroke="#E27625"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23.7544 21.8987L21.1532 26.2583L26.7187 27.9308L28.3912 21.9839L23.7544 21.8987Z"
                fill="#E27625"
                stroke="#E27625"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.62891 21.9839L5.28143 27.9308L10.8469 26.2583L8.24578 21.8987L3.62891 21.9839Z"
                fill="#E27625"
                stroke="#E27625"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5611 14.7148L8.99609 17.2608L14.5061 17.5164L14.3061 11.5695L10.5611 14.7148Z"
                fill="#E27625"
                stroke="#E27625"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.4291 14.7148L17.6285 11.5139L17.502 17.5164L23.012 17.2608L21.4291 14.7148Z"
                fill="#E27625"
                stroke="#E27625"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.8469 26.2583L14.1344 24.5302L11.2747 22.0121L10.8469 26.2583Z"
                fill="#E27625"
                stroke="#E27625"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.8555 24.5302L21.1529 26.2583L20.7152 22.0121L17.8555 24.5302Z"
                fill="#E27625"
                stroke="#E27625"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.1529 26.2583L17.8555 24.5302L18.1389 26.9631L18.1111 27.8752L21.1529 26.2583Z"
                fill="#D5BFB2"
                stroke="#D5BFB2"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.8469 26.2583L13.8887 27.8752L13.8708 26.9631L14.1344 24.5302L10.8469 26.2583Z"
                fill="#D5BFB2"
                stroke="#D5BFB2"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.9442 20.4429L11.1953 19.5864L13.1121 18.6187L13.9442 20.4429Z"
                fill="#233447"
                stroke="#233447"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.0459 20.4429L18.878 18.6187L20.8047 19.5864L18.0459 20.4429Z"
                fill="#233447"
                stroke="#233447"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.8471 26.2583L11.3026 21.8987L8.24609 21.9839L10.8471 26.2583Z"
                fill="#CC6228"
                stroke="#CC6228"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.6973 21.8987L21.1528 26.2583L23.7539 21.9839L20.6973 21.8987Z"
                fill="#CC6228"
                stroke="#CC6228"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23.0117 17.2608L17.502 17.5164L18.0464 20.4429L18.8785 18.6187L20.8052 19.5864L23.0117 17.2608Z"
                fill="#CC6228"
                stroke="#CC6228"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.1949 19.5864L13.1216 18.6187L13.9437 20.4429L14.5059 17.5164L8.99609 17.2608L11.1949 19.5864Z"
                fill="#CC6228"
                stroke="#CC6228"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.99609 17.2608L11.2747 22.0121L11.1949 19.5864L8.99609 17.2608Z"
                fill="#E27525"
                stroke="#E27525"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.8049 19.5864L20.7148 22.0121L23.0114 17.2608L20.8049 19.5864Z"
                fill="#E27525"
                stroke="#E27525"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5061 17.5164L13.9438 20.4429L14.6526 24.1746L14.7969 19.1586L14.5061 17.5164Z"
                fill="#E27525"
                stroke="#E27525"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5022 17.5164L17.2212 19.1408L17.3378 24.1746L18.0466 20.4429L17.5022 17.5164Z"
                fill="#E27525"
                stroke="#E27525"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.0466 20.4429L17.3379 24.1746L17.8556 24.5302L20.7153 22.0121L20.8054 19.5864L18.0466 20.4429Z"
                fill="#F5841F"
                stroke="#F5841F"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.1953 19.5864L11.2747 22.0121L14.1344 24.5302L13.9438 20.4429L11.1953 19.5864Z"
                fill="#F5841F"
                stroke="#F5841F"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <Button
            onClick={handleConnect}
            className="web3-card hover:bg-muted/50 transition-colors flex items-center justify-between"
          >
            <span>WalletConnect</span>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.58818 12.0055C13.1755 8.40234 19.0245 8.40234 22.6118 12.0055L23.0709 12.4664C23.2618 12.6582 23.2618 12.9673 23.0709 13.1591L21.6827 14.5527C21.5873 14.6486 21.4336 14.6486 21.3382 14.5527L20.7055 13.9173C18.2064 11.4091 14.0064 11.4091 11.5073 13.9173L10.8309 14.5964C10.7355 14.6923 10.5818 14.6923 10.4864 14.5964L9.09818 13.2027C8.90727 13.0109 8.90727 12.7018 9.09818 12.51L9.58818 12.0055ZM25.8373 15.24L27.0518 16.46C27.2427 16.6518 27.2427 16.9609 27.0518 17.1527L20.9609 23.2727C20.77 23.4645 20.4627 23.4645 20.2718 23.2727L16.0718 19.0545C16.0245 19.0073 15.9509 19.0073 15.9036 19.0545L11.7036 23.2727C11.5127 23.4645 11.2055 23.4645 11.0145 23.2727L4.92364 17.1527C4.73273 16.9609 4.73273 16.6518 4.92364 16.46L6.13818 15.24C6.32909 15.0482 6.63636 15.0482 6.82727 15.24L11.0273 19.4582C11.0745 19.5055 11.1482 19.5055 11.1955 19.4582L15.3955 15.24C15.5864 15.0482 15.8936 15.0482 16.0845 15.24L20.2845 19.4582C20.3318 19.5055 20.4055 19.5055 20.4527 19.4582L24.6527 15.24C24.8436 15.0482 25.1509 15.0482 25.3418 15.24H25.8373Z"
                fill="#3B99FC"
              />
            </svg>
          </Button>
          <Button
            onClick={handleConnect}
            className="web3-card hover:bg-muted/50 transition-colors flex items-center justify-between"
          >
            <span>Coinbase Wallet</span>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4Z"
                fill="#0052FF"
              />
              <path
                d="M16.0008 20.4C13.5554 20.4 11.6008 18.4454 11.6008 16C11.6008 13.5546 13.5554 11.6 16.0008 11.6C18.2658 11.6 20.0954 13.2658 20.3636 15.4H23.9954C23.7136 11.2863 20.2658 8 16.0008 8C11.5828 8 8.00085 11.582 8.00085 16C8.00085 20.418 11.5828 24 16.0008 24C20.2658 24 23.7136 20.7137 23.9954 16.6H20.3636C20.0954 18.7342 18.2658 20.4 16.0008 20.4Z"
                fill="white"
              />
            </svg>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Make sure we're exporting the component as default as well
export default ConnectWallet

