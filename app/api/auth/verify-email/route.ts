import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/user"
import { verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ message: "No verification token provided" }, { status: 400 })
    }

    const payload = await verifyToken(token)

    if (!payload || payload.type !== "email-verification") {
      return NextResponse.json({ message: "Invalid or expired verification token" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({ email: payload.email })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: "Email already verified" }, { status: 200 })
    }

    user.isEmailVerified = true
    await user.save()

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ message: "Failed to verify email" }, { status: 500 })
  }
}

