import mongoose, { Schema, type Document } from "mongoose"

export interface IProject extends Document {
  title: string
  description: string
  longDescription?: string
  raised: number
  goal: number
  donors: number
  image: string
  category: string
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
  updates: {
    title: string
    content: string
    date: Date
  }[]
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    raised: { type: Number, default: 0 },
    goal: { type: Number, required: true },
    donors: { type: Number, default: 0 },
    image: { type: String, default: "/placeholder.svg?height=400&width=800" },
    category: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
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

