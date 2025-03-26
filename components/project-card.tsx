import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Users, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  raised: number
  donors: number
  image: string
  category: string
  goal: number
}

export function ProjectCard({ id, title, description, raised, donors, image, category, goal }: ProjectCardProps) {
  const progress = (raised / goal) * 100

  return (
    <Card className="web3-card web3-glow overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
      <div className="relative aspect-video">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <Badge className="absolute top-2 right-2 bg-primary/80 hover:bg-primary">{category}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1 bg-web3-gradient bg-clip-text text-transparent">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-foreground/70">{description}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">${raised} raised</span>
            <span className="text-web3-highlight">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-muted overflow-hidden">
            <div className="h-full w-full bg-web3-gradient web3-shimmer"></div>
          </Progress>
          <div className="flex items-center justify-between text-xs text-foreground/60">
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              {donors} donors
            </div>
            <div className="flex items-center">
              <Tag className="mr-1 h-3 w-3" />
              Goal: ${goal}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/projects/${id}`} className="w-full">
          <Button className="w-full web3-button">View Project</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

