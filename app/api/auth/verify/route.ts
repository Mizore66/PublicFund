import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { createToken, setAuthCookie, verifySignature } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, signature } = await req.json()

    if (!walletAddress || !signature) {
      return NextResponse.json({ message: "Wallet address and signature are required" }, { status: 400 })
    }

    await dbConnect()

    // Find user by wallet address
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Create message that was signed
    const message = `Sign this message to authenticate with PublicFund: ${user.nonce}`

    // Generate a new nonce for next login
    user.nonce = Math.floor(Math.random() * 1000000).toString()
    await user.save()

    // Create JWT token
    const token = await createToken({
      id: user._id.toString(),
      walletAddress: user.walletAddress,
      role: user.role,
      kycStatus: user.kycStatus,
    })

    console.log("Token:", token)
    // Set auth cookie
    await setAuthCookie(token)

    return NextResponse.json({
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        name: user.name,
        role: user.role,
        kycStatus: user.kycStatus,
      },
      token,
    })
  } catch (error) {
    console.error("Error verifying signature:", error)
    return NextResponse.json({ message: "Authentication failed" }, { status: 500 })
  }
}

