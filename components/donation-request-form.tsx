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
import { Upload, X, ArrowRight, CheckCircle2 } from "lucide-react"
import { useWalletAuth } from "@/context/wallet-auth-context"
import { createProject } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export function DonationRequestForm() {
  const { user } = useWalletAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    longDescription: "",
    goal: "",
    walletAddress: user?.walletAddress || "",
    website: "",
    socials: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.category || !formData.description || !formData.goal || !formData.walletAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create project in MongoDB
      const projectData = {
        ...formData,
        goal: Number(formData.goal),
        image: images.length > 0 ? images[0] : "/placeholder.svg?height=400&width=800",
        createdBy: user?._id,
        updates: [
          {
            title: "Project Created",
            content: "This project has been created and is now accepting donations.",
            date: new Date(),
          },
        ],
      }

      const project = await createProject(projectData)

      setIsSubmitting(false)
      setIsSuccess(true)

      // Show success message and redirect
      setTimeout(() => {
        router.push(`/projects/${project._id}`)
      }, 2000)
    } catch (error) {
      console.error("Error creating project:", error)
      setIsSubmitting(false)

      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isSuccess) {
    return (
      <Card className="web3-card w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
            Project Created Successfully
          </CardTitle>
          <CardDescription className="text-foreground/70">
            Your project has been created and is now accepting donations
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="rounded-full bg-green-500/20 p-4 mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Success!</h3>
          <p className="text-center text-foreground/70 mb-6">
            Your project "{formData.title}" has been created successfully. You will be redirected to your project page.
          </p>
        </CardContent>
      </Card>
    )
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
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a clear, descriptive title"
              required
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground/80">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Environment">Environment</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Community">Community</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground/80">
              Short Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="A brief summary of your project (1-2 sentences)"
              rows={2}
              required
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription" className="text-foreground/80">
              Full Description
            </Label>
            <Textarea
              id="longDescription"
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              placeholder="Describe your project in detail, its goals, and how the funds will be used"
              rows={5}
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal" className="text-foreground/80">
              Funding Goal (in $FUND tokens)
            </Label>
            <Input
              id="goal"
              name="goal"
              type="number"
              value={formData.goal}
              onChange={handleInputChange}
              placeholder="Enter amount"
              required
              min={100}
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
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleInputChange}
              placeholder="Enter your Solana wallet address"
              required
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50 font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-foreground/80">
              Project Website (Optional)
            </Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              type="url"
              placeholder="https://"
              className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="socials" className="text-foreground/80">
              Social Media Links (Optional)
            </Label>
            <Input
              id="socials"
              name="socials"
              value={formData.socials}
              onChange={handleInputChange}
              placeholder="Twitter, Discord, etc."
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

