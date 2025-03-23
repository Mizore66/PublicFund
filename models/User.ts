import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  walletAddress: string
  name?: string
  avatar?: string
  fundBalance: number
  solBalance: number
  stakedSol: number
  donations: {
    projectId: mongoose.Types.ObjectId
    amount: number
    date: Date
    txHash: string
  }[]
  achievements: {
    id: string
    title: string
    description: string
    date: Date
    rarity: string
  }[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    walletAddress: { type: String, required: true, unique: true },
    name: { type: String },
    avatar: { type: String },
    fundBalance: { type: Number, default: 0 },
    solBalance: { type: Number, default: 0 },
    stakedSol: { type: Number, default: 0 },
    donations: [
      {
        projectId: { type: Schema.Types.ObjectId, ref: "Project" },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        txHash: { type: String, required: true },
      },
    ],
    achievements: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, default: Date.now },
        rarity: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

