import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { uploadToStorage } from "@/lib/storage"

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

    // Upload files to storage and get URLs
    const idFrontImageUrl = idFrontImage ? await uploadToStorage(idFrontImage, `kyc/${user._id}/id-front`) : undefined
    const idBackImageUrl = idBackImage ? await uploadToStorage(idBackImage, `kyc/${user._id}/id-back`) : undefined
    const selfieImageUrl = selfieImage ? await uploadToStorage(selfieImage, `kyc/${user._id}/selfie`) : undefined

    // Update user with KYC data
    user.kycStatus = "pending"
    user.kycData = {
      ...kycData,
      idFrontImage: idFrontImageUrl,
      idBackImage: idBackImageUrl,
      selfieImage: selfieImageUrl,
    }

    await user.save()

    return NextResponse.json({ message: "KYC information submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error submitting KYC:", error)
    return NextResponse.json({ message: "Failed to submit KYC information" }, { status: 500 })
  }
}

