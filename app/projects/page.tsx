import { Input } from "@/components/ui/input"
import { ProjectCard } from "@/components/project-card"
import { SiteLayout } from "@/components/site-layout"
import { Search } from "lucide-react"

export default function ProjectsPage() {
  // Mock data for projects
  const projects = [
    {
      id: "1",
      title: "Clean Water Initiative",
      description: "Providing clean water solutions to underserved communities.",
      raised: 1250,
      donors: 42,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      title: "Education for All",
      description: "Building schools and providing educational resources in rural areas.",
      raised: 3400,
      donors: 78,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "3",
      title: "Renewable Energy Project",
      description: "Developing sustainable energy solutions for communities in need.",
      raised: 2100,
      donors: 35,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "4",
      title: "Healthcare Access",
      description: "Improving healthcare access in remote and underserved regions.",
      raised: 1800,
      donors: 29,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "5",
      title: "Food Security Program",
      description: "Addressing hunger and food insecurity in vulnerable communities.",
      raised: 950,
      donors: 18,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "6",
      title: "Digital Literacy",
      description: "Teaching digital skills to bridge the technology gap.",
      raised: 1500,
      donors: 25,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <SiteLayout>
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-web3-gradient bg-clip-text text-transparent">
                All Projects
              </h1>
              <p className="mx-auto max-w-[700px] text-foreground/80">
                Browse and support public good projects that are making a difference.
              </p>
            </div>
            <div className="w-full max-w-sm relative">
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-full pl-10 bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                raised={project.raised}
                donors={project.donors}
                image={project.image}
              />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

