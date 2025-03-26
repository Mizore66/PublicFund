import mongoose, { Schema, type Document } from "mongoose"

export interface IProject extends Document {
  title: string
  description: string
  longDescription?: string
  category: string
  goal: number
  raised: number
  donors: number
  matchAmount: number
  createdBy: mongoose.Types.ObjectId
  walletAddress: string
  image: string
  updates: {
    title: string
    content: string
    date: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    category: { type: String, required: true },
    goal: { type: Number, required: true },
    raised: { type: Number, default: 0 },
    donors: { type: Number, default: 0 },
    matchAmount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    walletAddress: { type: String, required: true },
    image: { type: String, default: "/placeholder.svg?height=400&width=800" },
    updates: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)

