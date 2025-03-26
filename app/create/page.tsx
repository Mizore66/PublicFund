"use client"
import { useRouter } from "next/navigation"
import { DonationRequestForm } from "@/components/donation-request-form"
import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function CreatePage() {
  const { user, status, startKycVerification } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <SiteLayout>
        <section className="py-12 md:py-24 hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-web3-gradient bg-clip-text text-transparent animate-glow">
                  Create a Donation Request
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                  Connect your wallet to create a project and receive funding
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <Card className="web3-card max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
                  Authentication Required
                </CardTitle>
                <CardDescription className="text-foreground/70">
                  Please connect your wallet to create a project
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-yellow-500/20 p-4 mb-4">
                  <AlertCircle className="h-12 w-12 text-yellow-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Wallet Not Connected</h3>
                <p className="text-center text-foreground/70 mb-6">
                  You need to connect your wallet to create a project and receive funding.
                </p>
                <Button className="web3-button" onClick={() => router.push("/")}>
                  Go to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <section className="py-12 md:py-24 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-web3-gradient bg-clip-text text-transparent animate-glow">
                Create a Donation Request
              </h1>
              <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                Share your public good project and receive funding through quadratic funding
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <DonationRequestForm />
        </div>
      </section>
    </SiteLayout>
  )
}

