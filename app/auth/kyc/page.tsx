"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Upload, X, CheckCircle, User, Calendar, MapPin, Globe, CreditCard } from "lucide-react"
import { SiteLayout } from "@/components/site-layout"
import { useWalletAuth } from "@/components/wallet-auth-provider"
import { useAuth } from "@/context/auth-context"

export default function KYCPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  alert(user)
  const [activeTab, setActiveTab] = useState("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    country: "",
  })

  const [idInfo, setIdInfo] = useState({
    idType: "",
    idNumber: "",
  })

  const [documents, setDocuments] = useState({
    idFrontImage: null as File | null,
    idBackImage: null as File | null,
    selfieImage: null as File | null,
  })

  const [previewUrls, setPreviewUrls] = useState({
    idFrontImage: "",
    idBackImage: "",
    selfieImage: "",
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }

    // Redirect if KYC is already approved
    if (user?.kycStatus) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </SiteLayout>
    )
  }

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleIdInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setIdInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleCountryChange = (value: string) => {
    setPersonalInfo((prev) => ({ ...prev, country: value }))
  }

  const handleIdTypeChange = (value: string) => {
    setIdInfo((prev) => ({ ...prev, idType: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof documents) => {
    const file = e.target.files?.[0] || null

    if (file) {
      setDocuments((prev) => ({ ...prev, [field]: file }))

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrls((prev) => ({ ...prev, [field]: url }))
    }
  }

  const removeFile = (field: keyof typeof documents) => {
    setDocuments((prev) => ({ ...prev, [field]: null }))

    // Revoke preview URL to avoid memory leaks
    if (previewUrls[field]) {
      URL.revokeObjectURL(previewUrls[field])
      setPreviewUrls((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validatePersonalInfo = () => {
    if (!personalInfo.fullName || !personalInfo.dateOfBirth || !personalInfo.address || !personalInfo.country) {
      setError("Please fill in all personal information fields")
      return false
    }
    return true
  }

  const validateIdInfo = () => {
    if (!idInfo.idType || !idInfo.idNumber) {
      setError("Please fill in all ID information fields")
      return false
    }
    return true
  }

  const validateDocuments = () => {
    if (!documents.idFrontImage || !documents.idBackImage || !documents.selfieImage) {
      setError("Please upload all required documents")
      return false
    }
    return true
  }

  const handleNext = () => {
    setError("")

    if (activeTab === "personal") {
      if (validatePersonalInfo()) {
        setActiveTab("identity")
      }
    } else if (activeTab === "identity") {
      if (validateIdInfo()) {
        setActiveTab("documents")
      }
    }
  }

  const handleBack = () => {
    setError("")

    if (activeTab === "identity") {
      setActiveTab("personal")
    } else if (activeTab === "documents") {
      setActiveTab("identity")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    // Validate all sections
    if (!validatePersonalInfo() || !validateIdInfo() || !validateDocuments()) {
      setIsSubmitting(false)
      return
    }

    try {
      // Create FormData to handle file uploads
      const formData = new FormData()

      // Add personal info
      Object.entries(personalInfo).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // Add ID info
      Object.entries(idInfo).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // Add documents
      if (documents.idFrontImage) formData.append("idFrontImage", documents.idFrontImage)
      if (documents.idBackImage) formData.append("idBackImage", documents.idBackImage)
      if (documents.selfieImage) formData.append("selfieImage", documents.selfieImage)

      // Submit KYC data
      const response = await fetch("/api/auth/kyc", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit KYC information")
      }

      setSuccess("KYC information submitted successfully. We'll review your information and notify you once verified.")

      // Redirect to pending page after a delay
      setTimeout(() => {
        router.push("/auth/kyc/pending")
      }, 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit KYC information")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SiteLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold bg-web3-gradient bg-clip-text text-transparent">KYC Verification</h1>
            <p className="mt-2 text-muted-foreground">
              Complete your identity verification to access all platform features
            </p>
          </div>

          <Card className="web3-card">
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>
                We need to verify your identity to comply with regulations. Your information is secure and encrypted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="identity">Identity</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Full Legal Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full legal name"
                      value={personalInfo.fullName}
                      onChange={handlePersonalInfoChange}
                      className="bg-muted/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={handlePersonalInfoChange}
                      className="bg-muted/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Residential Address
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your full residential address"
                      value={personalInfo.address}
                      onChange={handlePersonalInfoChange}
                      className="bg-muted/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      Country of Residence
                    </Label>
                    <Select value={personalInfo.country} onValueChange={handleCountryChange}>
                      <SelectTrigger className="bg-muted/50 border-primary/20 focus:border-primary/50">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="sg">Singapore</SelectItem>
                        {/* Add more countries as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="identity" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="idType" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      ID Type
                    </Label>
                    <Select value={idInfo.idType} onValueChange={handleIdTypeChange}>
                      <SelectTrigger className="bg-muted/50 border-primary/20 focus:border-primary/50">
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
                    <Label htmlFor="idNumber" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      ID Number
                    </Label>
                    <Input
                      id="idNumber"
                      name="idNumber"
                      placeholder="Enter your ID number"
                      value={idInfo.idNumber}
                      onChange={handleIdInfoChange}
                      className="bg-muted/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label className="block mb-2">ID Front Side</Label>
                    {!previewUrls.idFrontImage ? (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload a clear photo of the front of your ID
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "idFrontImage")}
                          className="hidden"
                          id="idFrontImage"
                        />
                        <label htmlFor="idFrontImage">
                          <Button type="button" variant="outline" className="border-primary/20 hover:bg-primary/10">
                            Select File
                          </Button>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={previewUrls.idFrontImage || "/placeholder.svg"}
                          alt="ID Front"
                          className="w-full h-auto rounded-lg border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeFile("idFrontImage")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="block mb-2">ID Back Side</Label>
                    {!previewUrls.idBackImage ? (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload a clear photo of the back of your ID
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "idBackImage")}
                          className="hidden"
                          id="idBackImage"
                        />
                        <label htmlFor="idBackImage">
                          <Button type="button" variant="outline" className="border-primary/20 hover:bg-primary/10">
                            Select File
                          </Button>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={previewUrls.idBackImage || "/placeholder.svg"}
                          alt="ID Back"
                          className="w-full h-auto rounded-lg border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeFile("idBackImage")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="block mb-2">Selfie with ID</Label>
                    {!previewUrls.selfieImage ? (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload a selfie of yourself holding your ID
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "selfieImage")}
                          className="hidden"
                          id="selfieImage"
                        />
                        <label htmlFor="selfieImage">
                          <Button type="button" variant="outline" className="border-primary/20 hover:bg-primary/10">
                            Select File
                          </Button>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={previewUrls.selfieImage || "/placeholder.svg"}
                          alt="Selfie with ID"
                          className="w-full h-auto rounded-lg border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeFile("selfieImage")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              {activeTab !== "personal" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="border-primary/20 hover:bg-primary/10"
                >
                  Back
                </Button>
              )}

              {activeTab !== "documents" ? (
                <Button type="button" className="web3-button ml-auto" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" className="web3-button ml-auto" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </SiteLayout>
  )
}

