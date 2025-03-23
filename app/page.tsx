import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectCard } from "@/components/project-card"
import ConnectWallet from "@/components/connect-wallet"
import { ChevronRight, Code, Coins, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-web3-gradient bg-clip-text text-transparent">PublicFund</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/projects"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </Link>
            <ConnectWallet />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-web3-gradient bg-clip-text text-transparent animate-glow">
                  Fund Public Goods with Quadratic Funding
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                  Support projects that matter. Your contribution is amplified when more people donate.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/projects">
                  <Button size="lg" className="web3-button">
                    Explore Projects
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/10 transition-colors"
                  >
                    Learn More
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
                    <CardTitle>1. Matching Pool</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">
                      A pool of funds is set aside to match donations from the community.
                    </p>
                  </CardContent>
                </Card>
                <Card className="web3-card web3-glow">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>2. Community Donations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">
                      People donate to projects they believe in. Each donation counts as a vote.
                    </p>
                  </CardContent>
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
                      Projects with more individual donors receive a larger share of the matching pool.
                    </p>
                  </CardContent>
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
                  id="1"
                />
                <ProjectCard
                  title="Education for All"
                  description="Building schools and providing educational resources in rural areas."
                  raised={3400}
                  donors={78}
                  image="/placeholder.svg?height=200&width=400"
                  id="2"
                />
                <ProjectCard
                  title="Renewable Energy Project"
                  description="Developing sustainable energy solutions for communities in need."
                  raised={2100}
                  donors={35}
                  image="/placeholder.svg?height=200&width=400"
                  id="3"
                />
              </div>
              <Link href="/projects">
                <Button variant="outline" className="mt-4 border-primary/20 hover:bg-primary/10 transition-colors">
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/40 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-foreground/60 md:text-left">
            © 2025 <span className="bg-web3-gradient bg-clip-text text-transparent font-medium">PublicFund</span>. All
            rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

