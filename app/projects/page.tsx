import { Input } from "@/components/ui/input"
import { ProjectCard } from "@/components/project-card"
import { SiteLayout } from "@/components/site-layout"
import { Search } from "lucide-react"
import { getProjects } from "@/actions/project-actions"

export default async function ProjectsPage() {
  const projects = await getProjects()

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
                key={project._id}
                id={project._id}
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

