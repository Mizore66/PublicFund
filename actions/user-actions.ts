"use server"

import dbConnect from "@/lib/mongodb"
import User from "@/models/user"
import { revalidatePath } from "next/cache"

export async function getUserByWalletAddress(walletAddress: string) {
  await dbConnect()

  const user = await User.findOne({ walletAddress })

  if (!user) {
    return null
  }

  return JSON.parse(JSON.stringify(user))
}

export async function createOrUpdateUser(userData: any) {
  await dbConnect()

  // Check if user already exists
  let user = await User.findOne({ walletAddress: userData.walletAddress })

  if (user) {
    // Update existing user
    Object.assign(user, userData)
    await user.save()
  } else {
    // Create new user
    user = new User(userData)
    await user.save()
  }

  revalidatePath("/dashboard")

  return JSON.parse(JSON.stringify(user))
}

export async function addDonation(walletAddress: string, projectId: string, amount: number, txHash: string) {
  await dbConnect()

  const user = await User.findOne({ walletAddress })

  if (!user) {
    throw new Error("User not found")
  }

  user.donations.push({
    projectId,
    amount,
    date: new Date(),
    txHash,
  })

  user.fundBalance -= amount

  await user.save()

  revalidatePath("/dashboard")

  return JSON.parse(JSON.stringify(user))
}

export async function stakeSOL(walletAddress: string, amount: number, period: number) {
  await dbConnect()

  const user = await User.findOne({ walletAddress })

  if (!user) {
    throw new Error("User not found")
  }

  if (user.solBalance < amount) {
    throw new Error("Insufficient SOL balance")
  }

  user.solBalance -= amount
  user.stakedSol += amount

  // Add some FUND tokens as reward (simplified)
  const fundReward = amount * 0.1 * (period / 30) // 10% per month
  user.fundBalance += fundReward

  await user.save()

  revalidatePath("/stake")
  revalidatePath("/dashboard")

  return {
    success: true,
    user: JSON.parse(JSON.stringify(user)),
    fundReward,
  }
}

