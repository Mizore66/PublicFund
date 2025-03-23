import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  title: string
  raised: number
  donors: number
  matchAmount: number
  totalAmount: number
}

interface ProjectTableProps {
  projects: Project[]
}

export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead className="text-right">Raised</TableHead>
          <TableHead className="text-right">Donors</TableHead>
          <TableHead className="text-right">Match Amount</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Progress</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const progress = ((project.raised + project.matchAmount) / project.totalAmount) * 100

          return (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell className="text-right">${project.raised}</TableCell>
              <TableCell className="text-right">{project.donors}</TableCell>
              <TableCell className="text-right">${project.matchAmount}</TableCell>
              <TableCell className="text-right">${project.totalAmount}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

