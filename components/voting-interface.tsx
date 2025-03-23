"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Info, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VotingProjectProps {
  project: {
    id: string
    title: string
    description: string
    raised: number
    donors: number
    matchAmount: number
    totalAmount: number
    category: string
    image: string
  }
}

function VotingProject({ project }: VotingProjectProps) {
  const [donationAmount, setDonationAmount] = useState<number>(10)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = () => {
    setIsVoting(true)
    // In a real app, this would call a smart contract
    setTimeout(() => {
      setIsVoting(false)
    }, 1500)
  }

  const progress = (project.raised / project.totalAmount) * 100

  // Calculate the quadratic impact
  const calculateQuadraticImpact = (amount: number) => {
    // Simple quadratic formula for demonstration
    return Math.sqrt(amount) * 10
  }

  const impact = calculateQuadraticImpact(donationAmount)

  return (
    <Card className="web3-card web3-glow overflow-hidden">
      <div className="relative aspect-video">
        <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <Badge className="absolute top-2 right-2 bg-primary/80 hover:bg-primary">{project.category}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1 bg-web3-gradient bg-clip-text text-transparent">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">${project.raised} raised</span>
            <span className="text-web3-highlight">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-muted overflow-hidden">
            <div className="h-full w-full bg-web3-gradient web3-shimmer"></div>
          </Progress>
          <div className="flex items-center justify-between text-xs text-foreground/60">
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              {project.donors} donors
            </div>
            <div>Match: ${project.matchAmount}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={`amount-${project.id}`} className="text-sm font-medium">
              Your Donation ($FUND)
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    With quadratic funding, many small donations have a bigger impact than a few large ones. Your
                    donation is matched based on the square root formula.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Slider
              id={`slider-${project.id}`}
              min={1}
              max={100}
              step={1}
              value={[donationAmount]}
              onValueChange={(value) => setDonationAmount(value[0])}
              className="flex-1"
            />
            <Input
              id={`amount-${project.id}`}
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(Number(e.target.value))}
              min={1}
              max={100}
              className="w-20 bg-muted/50 border-primary/20"
            />
          </div>
        </div>

        <Card className="bg-muted/30 border-primary/10">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/80">Your Donation</span>
              <span className="text-sm font-medium">{donationAmount} $FUND</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/80">Quadratic Impact</span>
              <span className="text-sm font-medium bg-web3-gradient bg-clip-text text-transparent">
                ~{impact.toFixed(2)} $FUND
              </span>
            </div>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter>
        <Button className="w-full web3-button" disabled={donationAmount <= 0 || isVoting} onClick={handleVote}>
          {isVoting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Vote & Donate
              <Heart className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function VotingInterface() {
  // Mock data for projects
  const projects = [
    {
      id: "1",
      title: "Clean Water Initiative",
      description: "Providing clean water solutions to underserved communities around the world.",
      raised: 1250,
      donors: 42,
      matchAmount: 3750,
      totalAmount: 5000,
      category: "Environment",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      title: "Education for All",
      description: "Building schools and providing educational resources in rural areas.",
      raised: 3400,
      donors: 78,
      matchAmount: 6600,
      totalAmount: 10000,
      category: "Education",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "3",
      title: "Renewable Energy Project",
      description: "Developing sustainable energy solutions for communities in need.",
      raised: 2100,
      donors: 35,
      matchAmount: 4900,
      totalAmount: 7000,
      category: "Technology",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-web3-gradient bg-clip-text text-transparent">Quadratic Funding Round</h2>
        <p className="text-foreground/70">Vote for projects with your $FUND tokens and amplify your impact</p>

        <div className="flex items-center justify-center gap-4 mt-4">
          <Card className="bg-muted/30 border-primary/10 px-4 py-2">
            <div className="text-sm text-foreground/80">Matching Pool</div>
            <div className="text-xl font-bold">$50,000</div>
          </Card>
          <Card className="bg-muted/30 border-primary/10 px-4 py-2">
            <div className="text-sm text-foreground/80">Time Remaining</div>
            <div className="text-xl font-bold">5 days</div>
          </Card>
          <Card className="bg-muted/30 border-primary/10 px-4 py-2">
            <div className="text-sm text-foreground/80">Your $FUND Balance</div>
            <div className="text-xl font-bold">1,250.75</div>
          </Card>
        </div>

        <div className="flex items-center justify-center mt-2">
          <Info className="h-4 w-4 text-foreground/60 mr-2" />
          <p className="text-sm text-foreground/60">
            With quadratic funding, many small donations have a bigger impact than a few large ones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <VotingProject key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

