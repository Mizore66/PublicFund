"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { SiteLayout } from "@/components/site-layout"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
        })

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(data.message || "Email verified successfully")
        } else {
          setStatus("error")
          setMessage(data.message || "Failed to verify email")
        }
      } catch (error) {
        setStatus("error")
        setMessage("An unexpected error occurred")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <SiteLayout>
      <div className="flex min-h-[80vh] items-center justify-center py-12">
        <Card className="web3-card w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-web3-gradient bg-clip-text text-transparent">
              Email Verification
            </CardTitle>
            <CardDescription>{status === "loading" ? "Verifying your email address..." : ""}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
            {status === "loading" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-center text-muted-foreground">Verifying your email address...</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <Alert variant="default" className="border-green-500/50 bg-green-500/10">
                  <AlertDescription className="text-center">{message}</AlertDescription>
                </Alert>
                <p className="text-center text-muted-foreground">
                  Your email has been verified. You can now sign in to your account.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <Alert variant="destructive">
                  <AlertDescription className="text-center">{message}</AlertDescription>
                </Alert>
                <p className="text-center text-muted-foreground">
                  There was a problem verifying your email. The link may have expired or is invalid.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {status === "success" && (
              <Button className="w-full web3-button" onClick={() => router.push("/auth/login")}>
                Sign in
              </Button>
            )}
            {status === "error" && (
              <Button className="w-full web3-button" onClick={() => router.push("/auth/resend-verification")}>
                Resend verification email
              </Button>
            )}
            <div className="text-center text-sm">
              <Link href="/" className="text-primary hover:underline">
                Return to home page
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </SiteLayout>
  )
}

