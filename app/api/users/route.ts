import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/user"
import Donation from "@/models/donation"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Find user by wallet address
    const user = await User.findOne({ walletAddress })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's donations
    const donations = await Donation.find({ donor: user._id }).populate("project", "title").sort({ createdAt: -1 })

    return NextResponse.json({
      user,
      donations,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()

    // Validate required fields
    if (!body.walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Check if user already exists
    let user = await User.findOne({ walletAddress: body.walletAddress })

    if (user) {
      // Update existing user
      user = await User.findOneAndUpdate({ walletAddress: body.walletAddress }, body, { new: true })
    } else {
      // Create new user
      user = await User.create(body)
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error creating/updating user:", error)
    return NextResponse.json({ error: "Failed to create/update user" }, { status: 500 })
  }
}

