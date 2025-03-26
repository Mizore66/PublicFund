import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  walletAddress: string
  displayName?: string
  email?: string
  kycStatus: string
  kycCompletedAt?: Date
  kycId?: string
  donatedProjects: mongoose.Types.ObjectId[]
  totalDonated: number
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    walletAddress: { type: String, required: true, unique: true },
    displayName: { type: String },
    email: { type: String },
    kycStatus: {
      type: String,
      enum: ["unauthenticated", "wallet-connected", "kyc-pending", "kyc-verified"],
      default: "wallet-connected",
    },
    kycCompletedAt: { type: Date },
    kycId: { type: String },
    donatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    totalDonated: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

