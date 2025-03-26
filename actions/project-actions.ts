"use server"

import dbConnect from "@/lib/mongodb"
import Project from "@/models/project"
import { revalidatePath } from "next/cache"

export async function getProjects(category?: string, limit = 10) {
  await dbConnect()

  let query = {}
  if (category) {
    query = { category }
  }

  const projects = await Project.find(query).limit(limit).sort({ createdAt: -1 })
  return JSON.parse(JSON.stringify(projects))
}

export async function getProjectById(id: string) {
  await dbConnect()

  const project = await Project.findById(id)

  if (!project) {
    throw new Error("Project not found")
  }

  return JSON.parse(JSON.stringify(project))
}

export async function createProject(projectData: any) {
  await dbConnect()

  const project = new Project(projectData)
  await project.save()

  revalidatePath("/projects")

  return JSON.parse(JSON.stringify(project))
}

export async function updateProject(id: string, projectData: any) {
  await dbConnect()

  const project = await Project.findByIdAndUpdate(id, projectData, { new: true })

  if (!project) {
    throw new Error("Project not found")
  }

  revalidatePath(`/projects/${id}`)
  revalidatePath("/projects")

  return JSON.parse(JSON.stringify(project))
}

export async function donateToProject(id: string, amount: number, walletAddress: string) {
  await dbConnect()

  // Generate a mock transaction hash
  const txHash = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`

  // Update project
  const project = await Project.findById(id)

  if (!project) {
    throw new Error("Project not found")
  }

  project.raised += amount
  project.donors += 1
  await project.save()

  revalidatePath(`/projects/${id}`)
  revalidatePath("/projects")

  return {
    success: true,
    project: JSON.parse(JSON.stringify(project)),
    txHash,
  }
}

