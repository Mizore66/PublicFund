"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteLayout } from "@/components/site-layout"
import { Clock, AlertCircle } from "lucide-react"

export default function KYCPendingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // Redirect if not logged in
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    // // Redirect if KYC is approved
    // if (session?.user?.kycStatus === "approved") {
    //   router.push("/dashboard")
    // }

    // // Redirect if KYC is not submitted
    // if (session?.user?.kycStatus === "none") {
    //   router.push("/auth/kyc")
    // }
  }, [session, status, router])

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <SiteLayout>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </SiteLayout>
    )
  }

  // Show rejected state
  if (session?.user) {
    return (
      <SiteLayout>
        <div className="flex min-h-[80vh] items-center justify-center py-12">
          <Card className="web3-card w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-web3-gradient bg-clip-text text-transparent">
                KYC Verification Rejected
              </CardTitle>
              <CardDescription>
                Your KYC verification was not approved. Please review the feedback and try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-center text-muted-foreground">
                We couldn't verify your identity with the provided information. Please submit new documents.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full web3-button" onClick={() => router.push("/auth/kyc")}>
                Try Again
              </Button>
              <div className="text-center text-sm">
                <Link href="/support" className="text-primary hover:underline">
                  Contact Support
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </SiteLayout>
    )
  }

  // Show pending state
  return (
    <SiteLayout>
      <div className="flex min-h-[80vh] items-center justify-center py-12">
        <Card className="web3-card w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-web3-gradient bg-clip-text text-transparent">
              KYC Verification Pending
            </CardTitle>
            <CardDescription>
              Your KYC verification is being processed. This usually takes 1-2 business days.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <p className="text-center text-muted-foreground">
              We're reviewing your submitted documents. You'll receive an email notification once the verification is
              complete.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" variant="outline" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
            <div className="text-center text-sm">
              <Link href="/support" className="text-primary hover:underline">
                Contact Support
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </SiteLayout>
  )
}

