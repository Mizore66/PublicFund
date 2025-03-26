import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Project from "@/models/project"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (id) {
      // Get a single project
      const project = await Project.findById(id)

      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      return NextResponse.json(project)
    } else {
      // Get all projects
      const projects = await Project.find({}).sort({ createdAt: -1 })
      return NextResponse.json(projects)
    }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()

    // Validate required fields
    if (!body.title || !body.description || !body.category || !body.goal || !body.walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const project = await Project.create(body)
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const body = await req.json()

    const project = await Project.findByIdAndUpdate(id, body, { new: true })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

