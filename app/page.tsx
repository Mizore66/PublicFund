import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectCard } from "@/components/project-card"
import { SiteLayout } from "@/components/site-layout"
import { ChevronRight, Code, Coins, Vote, PlusCircle, Wallet } from "lucide-react"

export default function Home() {
  return (
    <SiteLayout>
      <section className="py-12 md:py-24 lg:py-32 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-web3-gradient bg-clip-text text-transparent animate-glow">
                Fund Public Goods with Quadratic Funding
              </h1>
              <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                Stake SOL, earn $FUND, and support projects that matter. Your contribution is amplified when more people
                donate.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/stake">
                <Button size="lg" className="web3-button">
                  Start Staking
                  <Wallet className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10 transition-colors">
                  Explore Projects
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-web3-gradient bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="mx-auto max-w-[700px] text-foreground/80">
                Quadratic Funding amplifies the impact of small donations when many people contribute.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
              <Card className="web3-card web3-glow">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Coins className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>1. Stake SOL</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">
                    Stake your SOL tokens to earn $FUND tokens over time. The staked SOL generates yield through Solana
                    DeFi protocols.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/stake" className="text-sm text-primary hover:underline">
                    Start Staking →
                  </Link>
                </CardFooter>
              </Card>
              <Card className="web3-card web3-glow">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Vote className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>2. Vote with $FUND</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">
                    Use your $FUND tokens to vote for projects you believe in. Each donation counts as a vote in the
                    quadratic funding formula.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/vote" className="text-sm text-primary hover:underline">
                    Vote Now →
                  </Link>
                </CardFooter>
              </Card>
              <Card className="web3-card web3-glow">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>3. Quadratic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">
                    Projects with more individual donors receive a larger share of the matching pool, ensuring broad
                    community support is rewarded.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/about" className="text-sm text-primary hover:underline">
                    Learn More →
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-web3-gradient bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="mx-auto max-w-[700px] text-foreground/80">
                Discover and support public good projects making a difference.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ProjectCard
                title="Clean Water Initiative"
                description="Providing clean water solutions to underserved communities."
                raised={1250}
                donors={42}
                image="/placeholder.svg?height=200&width=400"
                id="1" category={""} goal={0}              />
              <ProjectCard
                title="Education for All"
                description="Building schools and providing educational resources in rural areas."
                raised={3400}
                donors={78}
                image="/placeholder.svg?height=200&width=400"
                id="2" category={""} goal={0}              />
              <ProjectCard
                title="Renewable Energy Project"
                description="Developing sustainable energy solutions for communities in need."
                raised={2100}
                donors={35}
                image="/placeholder.svg?height=200&width=400"
                id="3" category={""} goal={0}              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/projects">
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10 transition-colors">
                  View All Projects
                </Button>
              </Link>
              <Link href="/create">
                <Button className="web3-button">
                  Create Project
                  <PlusCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

