import { type NextRequest, NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await clearAuthCookie()

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ message: "Failed to log out" }, { status: 500 })
  }
}

