"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ConnectWallet } from "@/components/connect-wallet"
import { DonateModal } from "@/components/donate-modal"

export default function ProjectPage() {
  const { id } = useParams()
  const [showDonateModal, setShowDonateModal] = useState(false)

  // Mock data for the project
  // In a real app, you would fetch this data based on the ID
  const project = {
    id: id as string,
    title: "Clean Water Initiative",
    description:
      "Providing clean water solutions to underserved communities around the world. This project focuses on building wells, water purification systems, and educating communities about water conservation and hygiene practices.",
    longDescription:
      "Access to clean water is a fundamental human right, yet millions of people around the world lack this basic necessity. The Clean Water Initiative works to address this critical issue by implementing sustainable water solutions in communities facing water scarcity and contamination.\n\nOur approach is comprehensive, focusing not only on infrastructure but also on education and community empowerment. We believe that lasting change comes from within communities, so we work closely with local leaders and residents to ensure that our solutions are appropriate, sustainable, and maintained over time.",
    raised: 1250,
    goal: 5000,
    donors: 42,
    image: "/placeholder.svg?height=400&width=800",
    updates: [
      {
        id: "1",
        date: "March 15, 2025",
        title: "Project Launch",
        content:
          "We're excited to announce the launch of our Clean Water Initiative campaign. Thanks to everyone who has supported us so far!",
      },
      {
        id: "2",
        date: "March 20, 2025",
        title: "First Milestone Reached",
        content:
          "We've reached our first funding milestone! This will allow us to begin preliminary work in our target communities.",
      },
    ],
  }

  const progress = (project.raised / project.goal) * 100

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
            <ConnectWallet />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{project.title}</h1>
                  <p className="mt-2 text-muted-foreground">{project.description}</p>
                </div>
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            ${project.raised} raised of ${project.goal} goal
                          </span>
                          <span className="text-sm font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="mt-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{project.donors} donors</span>
                      </div>
                      <Button className="w-full" size="lg" onClick={() => setShowDonateModal(true)}>
                        Donate Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-bold">About This Project</h2>
              <div className="mt-4 space-y-4">
                <p className="text-muted-foreground">{project.longDescription}</p>
              </div>
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-bold">Project Updates</h2>
              <div className="mt-4 space-y-4">
                {project.updates.map((update) => (
                  <Card key={update.id}>
                    <CardHeader>
                      <CardTitle>{update.title}</CardTitle>
                      <CardDescription>{update.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{update.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
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
      <DonateModal
        open={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        projectId={project.id}
        projectTitle={project.title}
      />
    </div>
  )
}

