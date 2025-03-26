import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/user"
import { generateNonce } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const walletAddress = req.nextUrl.searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json({ message: "Wallet address is required" }, { status: 400 })
    }

    await dbConnect()

    // Find or create user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() })

    if (!user) {
      // Create new user with this wallet address
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        nonce: generateNonce(),
        fundBalance: 1000, // Give new users some initial funds
        solBalance: 10, // Give new users some initial SOL
      })
      await user.save()
    } else {
      // Update nonce for existing user
      user.nonce = generateNonce()
      await user.save()
    }

    return NextResponse.json({ nonce: user.nonce })
  } catch (error) {
    console.error("Error generating nonce:", error)
    return NextResponse.json({ message: "Failed to generate nonce" }, { status: 500 })
  }
}

