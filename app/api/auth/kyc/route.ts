import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Parse form data
    const formData = await req.formData()

    // Extract KYC data
    const kycData = {
      fullName: formData.get("fullName") as string,
      dateOfBirth: new Date(formData.get("dateOfBirth") as string),
      address: formData.get("address") as string,
      country: formData.get("country") as string,
      idType: formData.get("idType") as string,
      idNumber: formData.get("idNumber") as string,
      submittedAt: new Date(),
    }

    // Handle file uploads
    const idFrontImage = formData.get("idFrontImage") as File
    const idBackImage = formData.get("idBackImage") as File
    const selfieImage = formData.get("selfieImage") as File


    // Update user with KYC data
    user.kycStatus = "pending"
    user.kycData = {
      ...kycData,
    }

    await user.save()

    return NextResponse.json({ message: "KYC information submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error submitting KYC:", error)
    return NextResponse.json({ message: "Failed to submit KYC information" }, { status: 500 })
  }
}

