import mongoose, { Schema, type Document } from "mongoose"

export interface IDonation extends Document {
  project: mongoose.Types.ObjectId
  donor: mongoose.Types.ObjectId
  amount: number
  matchAmount: number
  walletAddress: string
  txHash?: string
  createdAt: Date
}

const DonationSchema: Schema = new Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    matchAmount: { type: Number, default: 0 },
    walletAddress: { type: String, required: true },
    txHash: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Donation || mongoose.model<IDonation>("Donation", DonationSchema)

