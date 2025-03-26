import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export async function uploadToStorage(file: File, path: string): Promise<string> {
  try {
    const fileBuffer = await file.arrayBuffer()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${path}/${uuidv4()}.${fileExtension}`

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    }

    await s3Client.send(new PutObjectCommand(params))

    // Return the URL to the uploaded file
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

