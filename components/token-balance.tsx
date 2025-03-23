"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, CoinsIcon as CoinIcon, History, TrendingUp } from "lucide-react"

export function TokenBalance() {
  // Mock data for token balances
  const tokenData = {
    fund: {
      balance: 1250.75,
      staked: 500,
      available: 750.75,
      history: [
        { date: "2025-03-15", amount: 50, type: "Earned", description: "Staking Rewards" },
        { date: "2025-03-10", amount: -25, type: "Spent", description: "Donation to Education for All" },
        { date: "2025-03-05", amount: 100, type: "Earned", description: "Staking Rewards" },
        { date: "2025-03-01", amount: -50, type: "Spent", description: "Donation to Clean Water Initiative" },
      ],
    },
    sol: {
      balance: 10.5,
      staked: 8.25,
      available: 2.25,
      history: [
        { date: "2025-03-12", amount: -5, type: "Staked", description: "Staked SOL for 90 days" },
        { date: "2025-03-08", amount: 2, type: "Received", description: "Deposit from Exchange" },
        { date: "2025-03-03", amount: -3.25, type: "Staked", description: "Staked SOL for 30 days" },
        { date: "2025-02-25", amount: 15, type: "Received", description: "Initial Deposit" },
      ],
    },
  }

  return (
    <Card className="web3-card w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">Your Wallet</CardTitle>
        <CardDescription className="text-foreground/70">
          Manage your tokens and view transaction history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="fund" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="fund">$FUND</TabsTrigger>
            <TabsTrigger value="sol">SOL</TabsTrigger>
          </TabsList>
          <TabsContent value="fund" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Total Balance</p>
                <p className="text-3xl font-bold bg-web3-gradient bg-clip-text text-transparent">
                  {tokenData.fund.balance.toLocaleString()} $FUND
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CoinIcon className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-muted/30 border-primary/10">
                <CardContent className="p-4">
                  <p className="text-sm text-foreground/60">Available</p>
                  <p className="text-xl font-bold">{tokenData.fund.available.toLocaleString()} $FUND</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-primary/10">
                <CardContent className="p-4">
                  <p className="text-sm text-foreground/60">Staked</p>
                  <p className="text-xl font-bold">{tokenData.fund.staked.toLocaleString()} $FUND</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Recent Transactions</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-foreground/60 hover:text-foreground">
                  View All
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {tokenData.fund.history.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          transaction.type === "Earned" ? "bg-green-500/10" : "bg-red-500/10"
                        }`}
                      >
                        {transaction.type === "Earned" ? (
                          <TrendingUp
                            className={`h-4 w-4 ${transaction.type === "Earned" ? "text-green-500" : "text-red-500"}`}
                          />
                        ) : (
                          <History
                            className={`h-4 w-4 ${transaction.type === "Earned" ? "text-green-500" : "text-red-500"}`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-foreground/60">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-medium ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount} $FUND
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="sol" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Total Balance</p>
                <p className="text-3xl font-bold bg-web3-gradient bg-clip-text text-transparent">
                  {tokenData.sol.balance.toLocaleString()} SOL
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M93.94 42.63H13.78c-1.75 0-3.28.9-4.15 2.4-.87 1.5-.87 3.28 0 4.8l11.95 20.7c.87 1.5 2.4 2.4 4.15 2.4h80.16c1.75 0 3.28-.9 4.15-2.4.87-1.5.87-3.28 0-4.8L98.1 45.03c-.87-1.5-2.4-2.4-4.15-2.4z"
                    fill="url(#paint0_linear)"
                  />
                  <path
                    d="M93.94 85.37H13.78c-1.75 0-3.28.9-4.15 2.4-.87 1.5-.87 3.28 0 4.8l11.95 20.7c.87 1.5 2.4 2.4 4.15 2.4h80.16c1.75 0 3.28-.9 4.15-2.4.87-1.5.87-3.28 0-4.8L98.1 87.77c-.87-1.5-2.4-2.4-4.15-2.4z"
                    fill="url(#paint1_linear)"
                  />
                  <path
                    d="M93.94 0H13.78c-1.75 0-3.28.9-4.15 2.4-.87 1.5-.87 3.28 0 4.8l11.95 20.7c.87 1.5 2.4 2.4 4.15 2.4h80.16c1.75 0 3.28-.9 4.15-2.4.87-1.5.87-3.28 0-4.8L98.1 2.4c-.87-1.5-2.4-2.4-4.15-2.4z"
                    fill="url(#paint2_linear)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="11.69"
                      y1="70.62"
                      x2="101.62"
                      y2="39.43"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#9945FF" />
                      <stop offset="1" stopColor="#14F195" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear"
                      x1="11.69"
                      y1="113.36"
                      x2="101.62"
                      y2="82.17"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#9945FF" />
                      <stop offset="1" stopColor="#14F195" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear"
                      x1="11.69"
                      y1="27.99"
                      x2="101.62"
                      y2="-3.2"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#9945FF" />
                      <stop offset="1" stopColor="#14F195" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-muted/30 border-primary/10">
                <CardContent className="p-4">
                  <p className="text-sm text-foreground/60">Available</p>
                  <p className="text-xl font-bold">{tokenData.sol.available.toLocaleString()} SOL</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-primary/10">
                <CardContent className="p-4">
                  <p className="text-sm text-foreground/60">Staked</p>
                  <p className="text-xl font-bold">{tokenData.sol.staked.toLocaleString()} SOL</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Recent Transactions</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-foreground/60 hover:text-foreground">
                  View All
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {tokenData.sol.history.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          transaction.type === "Received" ? "bg-green-500/10" : "bg-blue-500/10"
                        }`}
                      >
                        {transaction.type === "Received" ? (
                          <TrendingUp
                            className={`h-4 w-4 ${
                              transaction.type === "Received" ? "text-green-500" : "text-blue-500"
                            }`}
                          />
                        ) : (
                          <History
                            className={`h-4 w-4 ${
                              transaction.type === "Received" ? "text-green-500" : "text-blue-500"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-foreground/60">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-medium ${transaction.amount > 0 ? "text-green-500" : "text-blue-500"}`}>
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount} SOL
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
          Deposit
        </Button>
        <Button className="web3-button">Stake & Earn</Button>
      </CardFooter>
    </Card>
  )
}

