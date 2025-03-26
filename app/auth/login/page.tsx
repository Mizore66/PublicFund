"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteLayout } from "@/components/site-layout"
import { Wallet } from "lucide-react"
import { useWalletAuth } from "@/components/wallet-auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading, connectWallet } = useWalletAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  const handleConnect = async () => {
    try {
      alert("1 BIG BOOM")
      await connectWallet()
      alert("5 BIG BOOMS")
      
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  return (
    <SiteLayout>
      <div className="flex min-h-[80vh] items-center justify-center py-12">
        <Card className="web3-card w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-web3-gradient bg-clip-text text-transparent">
              Connect Your Wallet
            </CardTitle>
            <CardDescription>
              Connect your wallet to access the platform and participate in quadratic funding
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 pt-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-12 w-12 text-primary" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Web3 Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Authenticate securely using your crypto wallet. No password needed.
              </p>
            </div>

            <Button onClick={handleConnect} disabled={isLoading} className="web3-button">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              By connecting your wallet, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have a wallet?</span>{" "}
              <Link href="https://metamask.io/download/" target="_blank" className="text-primary hover:underline">
                Get Phantom
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </SiteLayout>
  )
}

