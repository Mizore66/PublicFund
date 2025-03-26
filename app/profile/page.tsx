"use client"
import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWalletAuth } from "@/context/wallet-auth-context"
import { Shield, CheckCircle2, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Achievements } from "@/components/achievements"
import { DonationHistory } from "@/components/donation-history"

export default function ProfilePage() {
  const { user, status, disconnectWallet, startKycVerification } = useWalletAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Mock data for donations
  const donations = [
    {
      id: "1",
      projectId: "1",
      projectTitle: "Clean Water Initiative",
      amount: 50,
      date: "2025-03-15",
      txHash: "0x1234...5678",
    },
    {
      id: "2",
      projectId: "2",
      projectTitle: "Education for All",
      amount: 100,
      date: "2025-03-10",
      txHash: "0x8765...4321",
    },
    {
      id: "3",
      projectId: "3",
      projectTitle: "Renewable Energy Project",
      amount: 75,
      date: "2025-03-05",
      txHash: "0xabcd...efgh",
    },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Wallet address copied to clipboard",
    })
  }

  if (!user) {
    router.push("/")
    return null
  }

  return (
    <SiteLayout>
      <section className="py-12 md:py-24 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-web3-gradient bg-clip-text text-transparent animate-glow">
                Your Profile
              </h1>
              <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                Manage your account, view your contributions, and track your achievements
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="web3-card sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
                    Account Information
                  </CardTitle>
                  <CardDescription className="text-foreground/70">Your wallet and verification status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-foreground/60">Wallet Address</div>
                    <div className="flex items-center justify-between">
                      <code className="bg-muted/30 px-2 py-1 rounded font-mono text-sm">{user.walletAddress}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(user.walletAddress)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-foreground/60">Verification Status</div>
                    <div className="flex items-center">
                      {status === "kyc-verified" ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <span className="font-medium">Verified</span>
                        </>
                      ) : status === "kyc-pending" ? (
                        <>
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="font-medium">Verification Pending</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 text-primary mr-2" />
                          <span className="font-medium">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>

                  {user.displayName && (
                    <div className="space-y-2">
                      <div className="text-sm text-foreground/60">Name</div>
                      <div className="font-medium">{user.displayName}</div>
                    </div>
                  )}

                  {user.email && (
                    <div className="space-y-2">
                      <div className="text-sm text-foreground/60">Email</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                  )}

                  {user.kycCompletedAt && (
                    <div className="space-y-2">
                      <div className="text-sm text-foreground/60">Verified On</div>
                      <div className="font-medium">{new Date(user.kycCompletedAt).toLocaleDateString()}</div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  {status !== "kyc-verified" && (
                    <Button className="w-full web3-button" onClick={startKycVerification}>
                      Complete Verification
                      <Shield className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-primary/20 hover:bg-primary/10"
                    onClick={() => {
                      disconnectWallet()
                      router.push("/")
                    }}
                  >
                    Disconnect Wallet
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-8">
                  <Card className="web3-card">
                    <CardHeader>
                      <CardTitle>Donation History</CardTitle>
                      <CardDescription>Your contributions to public good projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DonationHistory donations={donations} />
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full border-primary/20 hover:bg-primary/10"
                        onClick={() => router.push("/dashboard")}
                      >
                        View Full Dashboard
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements">
                  <Achievements />
                </TabsContent>

                <TabsContent value="settings" className="space-y-8">
                  <Card className="web3-card">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        Account settings will be available soon. Stay tuned for updates!
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

