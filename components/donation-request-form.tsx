"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, X, ArrowRight } from "lucide-react"
import { createProject } from "@/actions/project-actions"

export function DonationRequestForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    goal: "",
    walletAddress: "",
    website: "",
    socials: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create project in database
      const project = await createProject({
        title: formData.title,
        description: formData.description,
        longDescription: formData.description,
        goal: Number(formData.goal),
        raised: 0,
        donors: 0,
        image: images.length > 0 ? images[0] : "/placeholder.svg?height=400&width=800",
        category: formData.category,
        createdBy: formData.walletAddress,
        updates: [
          {
            title: "Project Created",
            content: "This project has been created and is now accepting donations.",
            date: new Date(),
          },
        ],
      })

      // Redirect to the new project page
      router.push(`/projects/${project._id}`)
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = () => {
    // Mock image upload
    const mockImage = `/placeholder.svg?height=200&width=400&text=Image${images.length + 1}`
    setImages([...images, mockImage])
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <Card className="web3-card w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
          Create Donation Request
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Share your public good project and receive funding through quadratic funding
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground/80">
              Project Title
            </Label>
            <Input
              id="title"
              placeholder="Enter a clear, descriptive title"
              required
              value={formData.title}
              onChange={handleChange}
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground/80">
              Category
            </Label>
            <Select onValueChange={handleSelectChange} value={formData.category}>
              <SelectTrigger className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground/80">
              Project Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your project, its goals, and how the funds will be used"
              rows={5}
              required
              value={formData.description}
              onChange={handleChange}
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal" className="text-foreground/80">
              Funding Goal (in $FUND tokens)
            </Label>
            <Input
              id="goal"
              type="number"
              placeholder="Enter amount"
              min={100}
              required
              value={formData.goal}
              onChange={handleChange}
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/80">Project Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group aspect-video rounded-md overflow-hidden border border-border/40"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="aspect-video rounded-md border border-dashed border-border/40 flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors"
                >
                  <Upload className="h-6 w-6 text-foreground/60" />
                  <span className="text-xs text-foreground/60">Upload Image</span>
                </button>
              )}
            </div>
            <p className="text-xs text-foreground/60">Upload up to 6 images to showcase your project</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="walletAddress" className="text-foreground/80">
              Recipient Wallet Address
            </Label>
            <Input
              id="walletAddress"
              placeholder="Enter your Solana wallet address"
              value={formData.walletAddress}
              onChange={handleChange}
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50 font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-foreground/80">
              Project Website (Optional)
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://"
              value={formData.website}
              onChange={handleChange}
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="socials" className="text-foreground/80">
              Social Media Links (Optional)
            </Label>
            <Input
              id="socials"
              placeholder="Twitter, Discord, etc."
              value={formData.socials}
              onChange={handleChange}
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full web3-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Donation Request
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

