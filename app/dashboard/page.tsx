"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ConnectWallet from "@/components/connect-wallet"
import { ProjectTable } from "@/components/project-table"
import { DonationHistory } from "@/components/donation-history"
import { getUserDonations } from "@/lib/actions"
import { useAuth } from "@/context/auth-context"

export default function DashboardPage() {
  const { user, status } = useAuth()
  const [donations, setDonations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user donations when wallet is connected
  useEffect(() => {
    async function fetchDonations() {
      if (user?.walletAddress) {
        try {
          const userDonations = await getUserDonations(user.walletAddress)
          setDonations(userDonations)
        } catch (error) {
          console.error("Error fetching donations:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchDonations()
  }, [user?.walletAddress])

  // Mock data for projects
  const projects = [
    {
      id: "1",
      title: "Clean Water Initiative",
      raised: 1250,
      donors: 42,
      matchAmount: 3750,
      totalAmount: 5000,
    },
    {
      id: "2",
      title: "Education for All",
      raised: 3400,
      donors: 78,
      matchAmount: 6600,
      totalAmount: 10000,
    },
    {
      id: "3",
      title: "Renewable Energy Project",
      raised: 2100,
      donors: 35,
      matchAmount: 4900,
      totalAmount: 7000,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">PublicFund</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/projects" className="text-sm font-medium hover:underline">
              Projects
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
            <ConnectWallet onConnect={() => {}} />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">View your donations and track the impact of your contributions.</p>
            </div>
          </div>
          {user ? (
            <div className="mt-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="donations">My Donations</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${isLoading ? "..." : donations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">Across {donations.length} projects</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Matching Impact</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${isLoading ? "..." : donations.reduce((sum, d) => sum + (d.matchAmount || 0), 0).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">Quadratic funding match</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projects Supported</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {isLoading ? "..." : new Set(donations.map((d) => d.project)).size}
                        </div>
                        <p className="text-xs text-muted-foreground">In the current funding round</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle>Recent Donations</CardTitle>
                        <CardDescription>Your most recent contributions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DonationHistory donations={isLoading ? [] : donations.slice(0, 3)} />
                      </CardContent>
                    </Card>
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle>Impact Summary</CardTitle>
                        <CardDescription>How your donations are amplified</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <div className="text-center py-4 text-muted-foreground">Loading...</div>
                        ) : donations.length > 0 ? (
                          <div className="space-y-4">
                            {donations.slice(0, 3).map((donation) => (
                              <div key={donation.id} className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium leading-none">{donation.project.title}</p>
                                  <p className="text-sm text-muted-foreground">Your donation: ${donation.amount}</p>
                                </div>
                                <div className="text-sm font-medium">
                                  Impact: ${(donation.amount + (donation.matchAmount || 0)).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">No donations yet</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="donations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Donation History</CardTitle>
                      <CardDescription>A complete record of your contributions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="text-center py-4 text-muted-foreground">Loading...</div>
                      ) : (
                        <DonationHistory donations={donations} />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="projects" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Status</CardTitle>
                      <CardDescription>Current funding status of all projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProjectTable projects={projects} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
              <p className="mt-2 text-muted-foreground">
                Connect your wallet to view your dashboard and donation history.
              </p>
              <ConnectWallet className="mt-4" onConnect={() => {}} />
            </div>
          )}
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 PublicFund. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm font-medium hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm font-medium hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

