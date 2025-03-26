import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/user"
import { createToken } from "@/lib/auth"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { name, email, password, walletAddress } = await req.json()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { walletAddress: walletAddress || "" }],
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: "Email already in use" }, { status: 400 })
      }
      if (walletAddress && existingUser.walletAddress === walletAddress) {
        return NextResponse.json({ message: "Wallet address already registered" }, { status: 400 })
      }
    }

    // Create verification token
    const verificationToken = await createToken({
      email,
      type: "email-verification",
    })

    // Create new user
    const user = new User({
      name,
      email,
      password,
      walletAddress: walletAddress || "",
      fundBalance: 1000, // Give new users some initial funds
      solBalance: 10, // Give new users some initial SOL
    })

    await user.save()

    // Send verification email
    await sendVerificationEmail(email, name, verificationToken)

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ message: "Failed to register user" }, { status: 500 })
  }
}

