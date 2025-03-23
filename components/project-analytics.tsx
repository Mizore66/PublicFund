"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ExternalLink, Download, Info } from "lucide-react"

export function ProjectAnalytics() {
  // Mock data for analytics
  const analyticsData = {
    donations: [
      { date: "Jan", amount: 1200 },
      { date: "Feb", amount: 1800 },
      { date: "Mar", amount: 2400 },
      { date: "Apr", amount: 3000 },
      { date: "May", amount: 2700 },
      { date: "Jun", amount: 3500 },
    ],
    donors: [
      { date: "Jan", count: 15 },
      { date: "Feb", count: 22 },
      { date: "Mar", count: 28 },
      { date: "Apr", count: 35 },
      { date: "May", count: 30 },
      { date: "Jun", count: 42 },
    ],
    distribution: [
      { name: "Water Filtration Systems", value: 40 },
      { name: "Community Training", value: 25 },
      { name: "Infrastructure", value: 20 },
      { name: "Administrative", value: 10 },
      { name: "Other", value: 5 },
    ],
    transactions: [
      {
        id: "tx1",
        type: "Donation",
        amount: 50,
        from: "0x1234...5678",
        to: "Project Wallet",
        date: "2025-03-15T14:30:00",
        txHash: "0xabcd...efgh",
      },
      {
        id: "tx2",
        type: "Matching",
        amount: 150,
        from: "Matching Pool",
        to: "Project Wallet",
        date: "2025-03-15T14:35:00",
        txHash: "0xijkl...mnop",
      },
      {
        id: "tx3",
        type: "Expense",
        amount: 200,
        from: "Project Wallet",
        to: "Supplier",
        date: "2025-03-20T10:15:00",
        txHash: "0xqrst...uvwx",
      },
    ],
  }

  const COLORS = ["#6366f1", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="web3-card w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
          Project Analytics & Transparency
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Track the impact of your donations and see how funds are being used
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="distribution">Fund Distribution</TabsTrigger>
            <TabsTrigger value="transactions">On-Chain Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted/30 border-primary/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Donations Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.donations} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(222 47% 9%)",
                            borderColor: "hsl(223 47% 15%)",
                            color: "hsl(210 40% 98%)",
                          }}
                        />
                        <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-primary/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Donor Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.donors} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(222 47% 9%)",
                            borderColor: "hsl(223 47% 15%)",
                            color: "hsl(210 40% 98%)",
                          }}
                        />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
              <Info className="h-4 w-4" />
              <p>All data is stored on-chain for complete transparency</p>
            </div>
          </TabsContent>
          <TabsContent value="distribution" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted/30 border-primary/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Fund Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.distribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(222 47% 9%)",
                            borderColor: "hsl(223 47% 15%)",
                            color: "hsl(210 40% 98%)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-primary/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.distribution.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="h-3 w-3 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.value}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/30 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-foreground/60">Communities Served</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-foreground/60">People Impacted</p>
                    <p className="text-2xl font-bold">5,400+</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-foreground/60">Water Systems Built</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-foreground/60">Training Sessions</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="transactions" className="space-y-4 pt-4">
            <Card className="bg-muted/30 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">On-Chain Transactions</CardTitle>
                <CardDescription>
                  All transactions are recorded on the Solana blockchain for transparency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 border border-border/20"
                    >
                      <div>
                        <div className="flex items-center">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full mr-2 ${
                              tx.type === "Donation"
                                ? "bg-green-500/20 text-green-500"
                                : tx.type === "Matching"
                                  ? "bg-blue-500/20 text-blue-500"
                                  : "bg-yellow-500/20 text-yellow-500"
                            }`}
                          >
                            {tx.type}
                          </span>
                          <span className="text-sm font-medium">{tx.amount} $FUND</span>
                        </div>
                        <div className="mt-1 text-xs text-foreground/60">
                          <span>From: {tx.from}</span>
                          <span className="mx-2">→</span>
                          <span>To: {tx.to}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-foreground/60">{formatDate(tx.date)}</div>
                        <a
                          href={`https://explorer.solana.com/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center justify-end mt-1"
                        >
                          {tx.txHash.substring(0, 6)}...{tx.txHash.substring(tx.txHash.length - 4)}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10">
                  Export Transaction History
                  <Download className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

