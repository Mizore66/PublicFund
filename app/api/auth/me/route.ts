import { type NextRequest, NextResponse } from "next/server"
import React from "react"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { getAuthToken, verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = await getAuthToken(req)

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const payload = await verifyToken(token)

    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findById(payload.id)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        name: user.name,
        role: user.role,
        kycStatus: user.kycStatus,
      },
    })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json({ message: "Failed to get current user" }, { status: 500 })
  }
}

