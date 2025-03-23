"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CoinsIcon as CoinIcon, Lock, Unlock } from "lucide-react"

export function StakingInterface() {
  const [amount, setAmount] = useState<number>(1)
  const [stakingPeriod, setStakingPeriod] = useState<number>(30)
  const [isStaking, setIsStaking] = useState(false)

  // Mock data for staking stats
  const stakingStats = {
    totalStaked: 125.5,
    estimatedApr: 5.2,
    fundEarned: 12.75,
    stakingPeriods: [
      { label: "30 Days", value: 30, multiplier: 1 },
      { label: "90 Days", value: 90, multiplier: 1.2 },
      { label: "180 Days", value: 180, multiplier: 1.5 },
      { label: "365 Days", value: 365, multiplier: 2 },
    ],
  }

  const calculateRewards = () => {
    const periodMultiplier = stakingStats.stakingPeriods.find((p) => p.value === stakingPeriod)?.multiplier || 1
    const dailyRate = stakingStats.estimatedApr / 365 / 100
    return amount * dailyRate * stakingPeriod * periodMultiplier
  }

  const handleStake = () => {
    setIsStaking(true)
    // In a real app, this would call a smart contract
    setTimeout(() => {
      setIsStaking(false)
    }, 2000)
  }

  return (
    <Card className="web3-card w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
          Stake SOL to Earn $FUND
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Stake your SOL tokens to earn $FUND tokens and support public goods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="stake">Stake</TabsTrigger>
            <TabsTrigger value="unstake">Unstake</TabsTrigger>
          </TabsList>
          <TabsContent value="stake" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="amount" className="text-sm font-medium text-foreground/80">
                  Amount to Stake (SOL)
                </label>
                <span className="text-sm text-foreground/60">Balance: 10.5 SOL</span>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
                  min={0.1}
                  step={0.1}
                  className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/20 hover:bg-primary/10"
                  onClick={() => setAmount(10.5)}
                >
                  MAX
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Staking Period</label>
              <div className="grid grid-cols-4 gap-2">
                {stakingStats.stakingPeriods.map((period) => (
                  <Button
                    key={period.value}
                    variant={stakingPeriod === period.value ? "default" : "outline"}
                    className={stakingPeriod === period.value ? "web3-button" : "border-primary/20 hover:bg-primary/10"}
                    onClick={() => setStakingPeriod(period.value)}
                  >
                    {period.label}
                  </Button>
                ))}
              </div>
            </div>

            <Card className="bg-muted/30 border-primary/10">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/80">Estimated APR</span>
                    <span className="text-sm font-medium">{stakingStats.estimatedApr}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/80">Lock Period</span>
                    <span className="text-sm font-medium">{stakingPeriod} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/80">Estimated $FUND Rewards</span>
                    <span className="text-sm font-medium bg-web3-gradient bg-clip-text text-transparent">
                      {calculateRewards().toFixed(2)} $FUND
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full web3-button" disabled={amount <= 0 || isStaking} onClick={handleStake}>
              {isStaking ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Staking...
                </>
              ) : (
                <>
                  Stake SOL
                  <Lock className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </TabsContent>
          <TabsContent value="unstake" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="unstake-amount" className="text-sm font-medium text-foreground/80">
                  Amount to Unstake (SOL)
                </label>
                <span className="text-sm text-foreground/60">Staked: {stakingStats.totalStaked} SOL</span>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="unstake-amount"
                  type="number"
                  defaultValue={1}
                  min={0.1}
                  max={stakingStats.totalStaked}
                  step={0.1}
                  className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
                />
                <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10">
                  MAX
                </Button>
              </div>
            </div>

            <Card className="bg-muted/30 border-primary/10">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/80">Currently Staked</span>
                    <span className="text-sm font-medium">{stakingStats.totalStaked} SOL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/80">$FUND Earned</span>
                    <span className="text-sm font-medium bg-web3-gradient bg-clip-text text-transparent">
                      {stakingStats.fundEarned} $FUND
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/80">Unlock Date</span>
                    <span className="text-sm font-medium">April 15, 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full web3-button">
              Unstake SOL
              <Unlock className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="w-full h-px bg-border/40"></div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <CoinIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Staked</p>
              <p className="text-xs text-foreground/60">Platform-wide</p>
            </div>
          </div>
          <p className="text-lg font-bold">1,245,678 SOL</p>
        </div>
      </CardFooter>
    </Card>
  )
}

