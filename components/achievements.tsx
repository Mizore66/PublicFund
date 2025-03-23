"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Award, Gift, Star, Trophy, TrendingUp, Users } from "lucide-react"

export function Achievements() {
  // Mock data for achievements
  const achievements = {
    earned: [
      {
        id: "1",
        title: "Early Supporter",
        description: "One of the first 100 users to join the platform",
        icon: Star,
        date: "2025-02-15",
        rarity: "Rare",
        color: "bg-blue-500/20",
        textColor: "text-blue-500",
      },
      {
        id: "2",
        title: "First Donation",
        description: "Made your first donation to a project",
        icon: Gift,
        date: "2025-02-20",
        rarity: "Common",
        color: "bg-green-500/20",
        textColor: "text-green-500",
      },
      {
        id: "3",
        title: "Staking Starter",
        description: "Staked SOL for the first time",
        icon: TrendingUp,
        date: "2025-02-25",
        rarity: "Common",
        color: "bg-purple-500/20",
        textColor: "text-purple-500",
      },
    ],
    inProgress: [
      {
        id: "4",
        title: "Generous Donor",
        description: "Donate to 10 different projects",
        icon: Trophy,
        progress: 30,
        current: 3,
        target: 10,
        rarity: "Epic",
        color: "bg-yellow-500/20",
        textColor: "text-yellow-500",
      },
      {
        id: "5",
        title: "Community Pillar",
        description: "Stake at least 100 SOL for 90 days or more",
        icon: Users,
        progress: 8,
        current: 8.25,
        target: 100,
        rarity: "Legendary",
        color: "bg-orange-500/20",
        textColor: "text-orange-500",
      },
      {
        id: "6",
        title: "Impact Maker",
        description: "Have your donations matched for at least 1000 $FUND",
        icon: Award,
        progress: 45,
        current: 450,
        target: 1000,
        rarity: "Rare",
        color: "bg-pink-500/20",
        textColor: "text-pink-500",
      },
    ],
  }

  return (
    <Card className="web3-card w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">Your Achievements</CardTitle>
        <CardDescription className="text-foreground/70">
          Track your progress and earn badges for supporting public goods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="earned" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="earned">Earned Badges</TabsTrigger>
            <TabsTrigger value="progress">In Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="earned" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.earned.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <Card key={achievement.id} className="overflow-hidden border-primary/10">
                    <div className="flex items-start p-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${achievement.color}`}
                      >
                        <Icon className={`h-6 w-6 ${achievement.textColor}`} />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-foreground/70">{achievement.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${achievement.color} ${achievement.textColor}`}
                          >
                            {achievement.rarity}
                          </span>
                          <span className="text-xs text-foreground/60">
                            Earned on {new Date(achievement.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
          <TabsContent value="progress" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              {achievements.inProgress.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <Card key={achievement.id} className="overflow-hidden border-primary/10">
                    <div className="flex items-start p-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${achievement.color}`}
                      >
                        <Icon className={`h-6 w-6 ${achievement.textColor}`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-foreground/70">{achievement.description}</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground/80">
                              {achievement.current} / {achievement.target}
                            </span>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${achievement.color} ${achievement.textColor}`}
                            >
                              {achievement.rarity}
                            </span>
                          </div>
                          <Progress value={achievement.progress} className="h-2">
                            <div className={`h-full w-full ${achievement.color.replace("/20", "/60")}`}></div>
                          </Progress>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
          View All Achievements
        </Button>
      </CardFooter>
    </Card>
  )
}

