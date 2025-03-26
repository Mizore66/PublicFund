"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, Upload, Shield, ArrowRight, Camera, FileText } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"

export function KycVerification() {
  const { user, completeKycVerification} = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
    idType: "passport",
    idNumber: "",
    idFrontImage: null as File | null,
    idBackImage: null as File | null,
    selfieImage: null as File | null,
  })

  const [previews, setPreviews] = useState({
    idFrontImage: "",
    idBackImage: "",
    selfieImage: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Update form data with the file
      setFormData((prev) => ({ ...prev, [fieldName]: file }))

      // Create and set preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [fieldName]: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      // Check if the file is an image or PDF
      if (file.type.match("image/*") || file.type === "application/pdf") {
        // Update form data with the file
        setFormData((prev) => ({ ...prev, [fieldName]: file }))

        // Create and set preview URL (only for images)
        if (file.type.match("image/*")) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setPreviews((prev) => ({
              ...prev,
              [fieldName]: reader.result as string,
            }))
          }
          reader.readAsDataURL(file)
        } else {
          // For PDFs, just show a placeholder
          setPreviews((prev) => ({
            ...prev,
            [fieldName]: "/placeholder.svg?height=200&width=200&text=PDF",
          }))
        }
      }
    }
  }

  const handleNextStep = () => {
    if (step === 1) {
      // Validate personal info
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.dateOfBirth || !formData.country) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    }

    if (step === 2) {
      // Validate ID info
      if (!formData.idType || !formData.idNumber) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    }

    setStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    // Validate document uploads
    if (!formData.idFrontImage || (formData.idType !== "passport" && !formData.idBackImage) || !formData.selfieImage) {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call to KYC provider
    setTimeout(() => {
      setIsSubmitting(false)
      setIsVerifying(true)

      // Simulate verification process
      setTimeout(() => {
        setIsVerifying(false)
        setIsComplete(true)

        // Update user profile with KYC info
        completeKycVerification({
          displayName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        })

        toast({
          title: "Verification Complete",
          description: "Your identity has been verified successfully.",
          variant: "default",
        })
      }, 3000)
    }, 2000)
  }

  if (isComplete) {
    return (
      <Card className="web3-card w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
            Verification Complete
          </CardTitle>
          <CardDescription className="text-foreground/70">Your identity has been verified successfully</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="rounded-full bg-green-500/20 p-4 mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Verification Successful</h3>
          <p className="text-center text-foreground/70 mb-6">
            Your identity has been verified. You now have full access to all features of the platform.
          </p>
          <Button className="web3-button" onClick={() => (window.location.href = "/dashboard")}>
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isVerifying) {
    return (
      <Card className="web3-card w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
            Verifying Your Identity
          </CardTitle>
          <CardDescription className="text-foreground/70">Please wait while we verify your information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="rounded-full bg-primary/20 p-4 mb-4">
            <svg
              className="animate-spin h-12 w-12 text-primary"
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
          </div>
          <h3 className="text-xl font-medium mb-2">Verification in Progress</h3>
          <p className="text-center text-foreground/70">
            We're verifying your identity. This usually takes less than a minute.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="web3-card w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
          Identity Verification (KYC)
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Complete the verification process to access all features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`}
              >
                <span className="text-sm font-medium text-primary-foreground">1</span>
              </div>
              <span className="ml-2 text-sm font-medium">Personal Information</span>
            </div>
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}
              >
                <span className="text-sm font-medium text-primary-foreground">2</span>
              </div>
              <span className="ml-2 text-sm font-medium">ID Verification</span>
            </div>
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`}
              >
                <span className="text-sm font-medium text-primary-foreground">3</span>
              </div>
              <span className="ml-2 text-sm font-medium">Document Upload</span>
            </div>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="bg-muted/50 border-primary/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="bg-muted/50 border-primary/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="bg-muted/50 border-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="bg-muted/50 border-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country of Residence</Label>
              <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                <SelectTrigger className="bg-muted/50 border-primary/20">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="sg">Singapore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className="bg-muted/50 border-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className="bg-muted/50 border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter your postal code"
                  className="bg-muted/50 border-primary/20"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idType">ID Type</Label>
              <Select value={formData.idType} onValueChange={(value) => handleSelectChange("idType", value)}>
                <SelectTrigger className="bg-muted/50 border-primary/20">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driverLicense">Driver's License</SelectItem>
                  <SelectItem value="nationalId">National ID Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                placeholder="Enter your ID number"
                className="bg-muted/50 border-primary/20"
                required
              />
            </div>

            <div className="rounded-lg bg-muted/30 p-4 border border-primary/10">
              <h3 className="text-sm font-medium flex items-center">
                <Shield className="h-4 w-4 mr-2 text-primary" />
                ID Verification Requirements
              </h3>
              <ul className="mt-2 text-sm text-foreground/70 space-y-1">
                <li>• Document must be valid and not expired</li>
                <li>• All information must be clearly visible</li>
                <li>• No glare or shadows on the document</li>
                <li>• Full document must be visible in the image</li>
              </ul>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="block mb-1">
                Front of ID {formData.idType === "passport" ? "(Passport Photo Page)" : ""}
              </Label>
              <div
                className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "idFrontImage")}
              >
                {formData.idFrontImage ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg border border-primary/20">
                      <img
                        src={previews.idFrontImage || "/placeholder.svg"}
                        alt="ID Front Preview"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium">{formData.idFrontImage.name}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/20 hover:bg-primary/10"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, idFrontImage: null }))
                        setPreviews((prev) => ({ ...prev, idFrontImage: "" }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <FileText className="h-8 w-8 text-foreground/40" />
                    </div>
                    <p className="text-sm text-foreground/70">Click to upload or drag and drop</p>
                    <p className="text-xs text-foreground/50">PNG, JPG or PDF (max 5MB)</p>
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,application/pdf"
                      className="hidden"
                      id="idFrontImage"
                      onChange={(e) => handleFileChange(e, "idFrontImage")}
                    />
                    <Label htmlFor="idFrontImage">
                      <Button variant="outline" className="border-primary/20 hover:bg-primary/10" type="button">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
            </div>

            {formData.idType !== "passport" && (
              <div className="space-y-2">
                <Label className="block mb-1">Back of ID</Label>
                <div
                  className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "idBackImage")}
                >
                  {formData.idBackImage ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg border border-primary/20">
                        <img
                          src={previews.idBackImage || "/placeholder.svg"}
                          alt="ID Back Preview"
                          className="h-auto w-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium">{formData.idBackImage.name}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/20 hover:bg-primary/10"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, idBackImage: null }))
                          setPreviews((prev) => ({ ...prev, idBackImage: "" }))
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        <FileText className="h-8 w-8 text-foreground/40" />
                      </div>
                      <p className="text-sm text-foreground/70">Click to upload or drag and drop</p>
                      <p className="text-xs text-foreground/50">PNG, JPG or PDF (max 5MB)</p>
                      <Input
                        type="file"
                        accept="image/png,image/jpeg,application/pdf"
                        className="hidden"
                        id="idBackImage"
                        onChange={(e) => handleFileChange(e, "idBackImage")}
                      />
                      <Label htmlFor="idBackImage">
                        <Button variant="outline" className="border-primary/20 hover:bg-primary/10" type="button">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload File
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="block mb-1">Selfie with ID</Label>
              <div
                className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "selfieImage")}
              >
                {formData.selfieImage ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg border border-primary/20">
                      <img
                        src={previews.selfieImage || "/placeholder.svg"}
                        alt="Selfie Preview"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium">{formData.selfieImage.name}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/20 hover:bg-primary/10"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, selfieImage: null }))
                        setPreviews((prev) => ({ ...prev, selfieImage: "" }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <Camera className="h-8 w-8 text-foreground/40" />
                    </div>
                    <p className="text-sm text-foreground/70">Take a selfie holding your ID</p>
                    <p className="text-xs text-foreground/50">PNG or JPG (max 5MB)</p>
                    <Input
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      id="selfieImage"
                      onChange={(e) => handleFileChange(e, "selfieImage")}
                    />
                    <Label htmlFor="selfieImage">
                      <Button variant="outline" className="border-primary/20 hover:bg-primary/10" type="button">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Selfie
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-4 border border-primary/10">
              <h3 className="text-sm font-medium flex items-center">
                <Shield className="h-4 w-4 mr-2 text-primary" />
                Selfie Requirements
              </h3>
              <ul className="mt-2 text-sm text-foreground/70 space-y-1">
                <li>• Your face must be clearly visible</li>
                <li>• Hold your ID next to your face</li>
                <li>• Information on the ID must be readable</li>
                <li>• Take the photo in good lighting</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10" onClick={handlePrevStep}>
            Back
          </Button>
        ) : (
          <div></div>
        )}

        {step < 3 ? (
          <Button className="web3-button" onClick={handleNextStep}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button className="web3-button" onClick={handleSubmit} disabled={isSubmitting}>
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
                Submit for Verification
                <Shield className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

