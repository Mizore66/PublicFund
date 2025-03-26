"use server"

import dbConnect from "@/lib/mongodb"
import Project from "@/models/project"
import User from "@/models/user"
import Donation from "@/models/donation"
import { calculateQuadraticMatch } from "@/lib/quadratic-funding"
import { revalidatePath } from "next/cache"

export async function getProjects() {
  await dbConnect()
  const projects = await Project.find({}).sort({ createdAt: -1 })
  return JSON.parse(JSON.stringify(projects))
}

export async function getProject(id: string) {
  await dbConnect()
  const project = await Project.findById(id)

  if (!project) {
    throw new Error("Project not found")
  }

  return JSON.parse(JSON.stringify(project))
}

export async function createProject(projectData: any) {
  await dbConnect()

  // Validate required fields
  if (
    !projectData.title ||
    !projectData.description ||
    !projectData.category ||
    !projectData.goal ||
    !projectData.walletAddress
  ) {
    throw new Error("Missing required fields")
  }

  const project = await Project.create(projectData)
  revalidatePath("/projects")
  return JSON.parse(JSON.stringify(project))
}

export async function makeDonation(donationData: {
  projectId: string
  amount: number
  walletAddress: string
  txHash?: string
}) {
  await dbConnect()

  // Validate required fields
  if (!donationData.projectId || !donationData.amount || !donationData.walletAddress) {
    throw new Error("Missing required fields")
  }

  // Find or create user
  let user = await User.findOne({ walletAddress: donationData.walletAddress })

  if (!user) {
    user = await User.create({
      walletAddress: donationData.walletAddress,
      kycStatus: "wallet-connected",
    })
  }

  // Find project
  const project = await Project.findById(donationData.projectId)

  if (!project) {
    throw new Error("Project not found")
  }

  // Calculate match amount using quadratic funding formula
  const allProjectDonations = await Donation.find({ project: donationData.projectId })
  const donationAmounts = [...allProjectDonations.map((d) => d.amount), donationData.amount]
  const matchAmount =
    calculateQuadraticMatch(donationAmounts) - calculateQuadraticMatch(allProjectDonations.map((d) => d.amount))

  // Create donation
  const donation = await Donation.create({
    project: donationData.projectId,
    donor: user._id,
    amount: donationData.amount,
    matchAmount,
    walletAddress: donationData.walletAddress,
    txHash: donationData.txHash || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
  })

  // Update project
  await Project.findByIdAndUpdate(donationData.projectId, {
    $inc: {
      raised: donationData.amount,
      matchAmount,
      donors: 1,
    },
  })

  // Update user
  await User.findByIdAndUpdate(user._id, {
    $addToSet: { donatedProjects: donationData.projectId },
    $inc: { totalDonated: donationData.amount },
  })

  revalidatePath(`/projects/${donationData.projectId}`)
  revalidatePath("/projects")

  return JSON.parse(JSON.stringify(donation))
}

export async function getUserDonations(walletAddress: string) {
  await dbConnect()

  // Find user by wallet address
  const user = await User.findOne({ walletAddress })

  if (!user) {
    return []
  }

  // Get user's donations
  const donations = await Donation.find({ donor: user._id }).populate("project", "title").sort({ createdAt: -1 })

  return JSON.parse(JSON.stringify(donations))
}

