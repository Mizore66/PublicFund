import { ProjectAnalytics } from "@/components/project-analytics"
import { SiteLayout } from "@/components/site-layout"
import Link from "next/link"

export default function ProjectAnalyticsPage() {
  return (
    <SiteLayout>
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <Link href="/projects/1" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
              ← Back to Project
            </Link>
            <h1 className="mt-2 text-3xl font-bold bg-web3-gradient bg-clip-text text-transparent">
              Clean Water Initiative Analytics
            </h1>
          </div>
          <ProjectAnalytics />
        </div>
      </section>
    </SiteLayout>
  )
}

