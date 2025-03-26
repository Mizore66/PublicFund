import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Donation from "@/models/donation"
import Project from "@/models/project"
import User from "@/models/user"
import { calculateQuadraticMatch } from "@/lib/quadratic-funding"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    const userId = searchParams.get("userId")

    let query = {}

    if (projectId) {
      query = { ...query, project: projectId }
    }

    if (userId) {
      query = { ...query, donor: userId }
    }

    const donations = await Donation.find(query).populate("project", "title").sort({ createdAt: -1 })

    return NextResponse.json(donations)
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()

    // Validate required fields
    if (!body.projectId || !body.amount || !body.walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Start a session for transaction
    const session = await (await dbConnect()).startSession()
    session.startTransaction()

    try {
      // Find or create user
      let user = await User.findOne({ walletAddress: body.walletAddress })

      if (!user) {
        user = await User.create(
          [
            {
              walletAddress: body.walletAddress,
              kycStatus: "wallet-connected",
            },
          ],
          { session },
        )
        user = user[0]
      }

      // Find project
      const project = await Project.findById(body.projectId)

      if (!project) {
        await session.abortTransaction()
        session.endSession()
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      // Calculate match amount using quadratic funding formula
      // For simplicity, we'll use a basic implementation
      const allProjectDonations = await Donation.find({ project: body.projectId })
      const donationAmounts = [...allProjectDonations.map((d) => d.amount), body.amount]
      const matchAmount =
        calculateQuadraticMatch(donationAmounts) - calculateQuadraticMatch(allProjectDonations.map((d) => d.amount))

      // Create donation
      const donation = await Donation.create(
        [
          {
            project: body.projectId,
            donor: user._id,
            amount: body.amount,
            matchAmount,
            walletAddress: body.walletAddress,
            txHash: body.txHash || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          },
        ],
        { session },
      )

      // Update project
      await Project.findByIdAndUpdate(
        body.projectId,
        {
          $inc: {
            raised: body.amount,
            matchAmount,
            donors: 1,
          },
        },
        { session },
      )

      // Update user
      await User.findByIdAndUpdate(
        user._id,
        {
          $addToSet: { donatedProjects: body.projectId },
          $inc: { totalDonated: body.amount },
        },
        { session },
      )

      await session.commitTransaction()
      session.endSession()

      return NextResponse.json(donation[0], { status: 201 })
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  } catch (error) {
    console.error("Error creating donation:", error)
    return NextResponse.json({ error: "Failed to create donation" }, { status: 500 })
  }
}

