import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SiteLayout } from "@/components/site-layout"
import { getProject } from "@/lib/actions"
import { DonateButton } from "@/components/donate-button"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Fetch project from MongoDB
  const project = await getProject(id)

  const progress = (project.raised / project.goal) * 100

  return (
    <SiteLayout>
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
                    <DonateButton projectId={id} projectTitle={project.title} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold">About This Project</h2>
            <div className="mt-4 space-y-4">
              <p className="text-muted-foreground">{project.longDescription || project.description}</p>
            </div>
          </div>
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Project Updates</h2>
              <div className="flex gap-2">
                <Link href={`/projects/${id}/community`}>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                    View Community
                  </Button>
                </Link>
                <Link href={`/projects/${id}/analytics`}>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {project.updates && project.updates.length > 0 ? (
                project.updates.map((update, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{update.title}</CardTitle>
                      <CardDescription>{new Date(update.date).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{update.content}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-6">
                    <p className="text-center text-muted-foreground">No updates yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}


