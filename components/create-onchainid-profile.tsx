"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { User, Upload, Shield, CheckCircle, AlertTriangle, FileText, Camera, Smartphone, UserPlus } from "lucide-react"

interface FormData {
  // Identity Source
  identitySource: "singpass" | "jumio" | "manual" | ""

  // Personal Information
  fullName: string
  dateOfBirth: string
  gender: string
  nationality: string
  idNumber: string
  idType: string
  phoneNumber: string
  email: string

  // Address Information
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string

  // Investor Information
  investorCategory: string
  organizationType: string
  walletAddress: string

  // Documents
  uploadedDocuments: {
    proofOfId: File | null
    proofOfAddress: File | null
    additionalDocs: File[]
  }

  // Consent
  termsAccepted: boolean
  dataProcessingConsent: boolean
}

interface AMLResult {
  match: "Y" | "N"
  riskScore: number
  matchDetails?: {
    name: string
    reason: string
    confidence: number
  }[]
}

export default function CreateOnchainIdProfile() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [amlResult, setAmlResult] = useState<AMLResult | null>(null)
  const [onchainIdCreated, setOnchainIdCreated] = useState(false)
  const [finalStatus, setFinalStatus] = useState<"approved" | "pending" | null>(null)

  const [formData, setFormData] = useState<FormData>({
    identitySource: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    idNumber: "",
    idType: "",
    phoneNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    investorCategory: "",
    organizationType: "",
    walletAddress: "",
    uploadedDocuments: {
      proofOfId: null,
      proofOfAddress: null,
      additionalDocs: [],
    },
    termsAccepted: false,
    dataProcessingConsent: false,
  })

  const steps = [
    { id: 1, title: "Identity Source", description: "Choose verification method" },
    { id: 2, title: "Personal Info", description: "Enter personal details" },
    { id: 3, title: "Documents", description: "Upload required documents" },
    { id: 4, title: "Review", description: "Review and submit" },
    { id: 5, title: "Processing", description: "AML screening & ONCHAINID creation" },
  ]

  // Mock Singpass integration
  const handleSingpassAuth = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock data from MyInfo
    setFormData((prev) => ({
      ...prev,
      identitySource: "singpass",
      fullName: "John Tan Wei Ming",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      nationality: "Singaporean",
      idNumber: "S8503152A",
      idType: "NRIC",
      phoneNumber: "+65 9123 4567",
      email: "john.tan@email.com",
      addressLine1: "123 Orchard Road",
      addressLine2: "#12-34",
      city: "Singapore",
      state: "Singapore",
      postalCode: "238858",
      country: "Singapore",
    }))
    setIsSubmitting(false)
    setCurrentStep(2)
  }

  // Mock Jumio integration
  const handleJumioAuth = async () => {
    setIsSubmitting(true)
    // Simulate Jumio SDK
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock data from Jumio
    setFormData((prev) => ({
      ...prev,
      identitySource: "jumio",
      fullName: "Sarah Johnson",
      dateOfBirth: "1990-07-22",
      gender: "Female",
      nationality: "American",
      idNumber: "123456789",
      idType: "Passport",
      phoneNumber: "+1 555 123 4567",
      email: "sarah.johnson@email.com",
      addressLine1: "456 Wall Street",
      addressLine2: "Apt 789",
      city: "New York",
      state: "NY",
      postalCode: "10005",
      country: "United States",
    }))
    setIsSubmitting(false)
    setCurrentStep(2)
  }

  // Mock AML Screening
  const performAMLScreening = async (): Promise<AMLResult> => {
    // Simulate AML API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock AML result - randomly determine match
    const hasMatch = Math.random() < 0.2 // 20% chance of AML hit

    if (hasMatch) {
      return {
        match: "Y",
        riskScore: 85,
        matchDetails: [
          {
            name: "Similar name found in sanctions list",
            reason: "OFAC SDN List",
            confidence: 75,
          },
        ],
      }
    } else {
      return {
        match: "N",
        riskScore: 15,
      }
    }
  }

  // Mock ONCHAINID Creation
  const createOnchainId = async () => {
    // Simulate smart contract deployment
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock contract address
    const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`

    return {
      contractAddress,
      claims: [
        { topicCode: 1, name: "KYC Completed", status: "Attached" },
        { topicCode: 2, name: "AML Completed", status: "Attached" },
        { topicCode: 4, name: "Proof of ID", status: "Attached" },
        { topicCode: 5, name: "Proof of Residency", status: "Attached" },
        { topicCode: 9, name: "Country of Residence", status: "Attached" },
        { topicCode: 10, name: "Nationality", status: "Attached" },
        { topicCode: 12, name: "DOB", status: "Attached" },
        { topicCode: 13, name: "Investor Category", status: "Attached" },
      ],
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setCurrentStep(5)

    try {
      // Step A: Validate required fields (already done in UI)

      // Step B: Perform AML Screening
      const amlResult = await performAMLScreening()
      setAmlResult(amlResult)

      // Step C: Check AML result and take action
      if (amlResult.match === "N") {
        // No AML hit - proceed with ONCHAINID creation
        const onchainIdResult = await createOnchainId()
        setOnchainIdCreated(true)
        setFinalStatus("approved")
      } else {
        // AML hit found - defer ONCHAINID creation
        setOnchainIdCreated(false)
        setFinalStatus("pending")
      }
    } catch (error) {
      console.error("Error during submission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (fileType: string, file: File) => {
    setFormData((prev) => ({
      ...prev,
      uploadedDocuments: {
        ...prev.uploadedDocuments,
        [fileType]: file,
      },
    }))
  }

  const isReadOnly = formData.identitySource === "singpass" || formData.identitySource === "jumio"

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step.id ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-medium">{steps[currentStep - 1]?.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{steps[currentStep - 1]?.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Choose Identity Source */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Choose Identity Verification Method
            </CardTitle>
            <CardDescription>Select how you want to verify the investor's identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={formData.identitySource}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, identitySource: value as any }))}
            >
              {/* Singpass Option */}
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <RadioGroupItem value="singpass" id="singpass" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-red-600" />
                    <Label htmlFor="singpass" className="font-medium">
                      Use Singpass
                    </Label>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Singapore</Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Auto-fill personal details from MyInfo. Requires Singpass authentication.
                  </p>
                </div>
              </div>

              {/* Jumio Option */}
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <RadioGroupItem value="jumio" id="jumio" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-blue-600" />
                    <Label htmlFor="jumio" className="font-medium">
                      Use Jumio
                    </Label>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Global</Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Auto-fill personal details using Jumio's ID verification SDK.
                  </p>
                </div>
              </div>

              {/* Manual Option */}
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <RadioGroupItem value="manual" id="manual" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <Label htmlFor="manual" className="font-medium">
                      Manual Form
                    </Label>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Enter data and upload documents manually.
                  </p>
                </div>
              </div>
            </RadioGroup>

            <div className="flex gap-4">
              {formData.identitySource === "singpass" && (
                <Button onClick={handleSingpassAuth} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                  {isSubmitting ? "Authenticating..." : "Authenticate with Singpass"}
                </Button>
              )}
              {formData.identitySource === "jumio" && (
                <Button onClick={handleJumioAuth} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? "Verifying..." : "Start Jumio Verification"}
                </Button>
              )}
              {formData.identitySource === "manual" && (
                <Button onClick={() => setCurrentStep(2)}>Continue with Manual Form</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Personal Information */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              {isReadOnly ? "Information auto-filled from " + formData.identitySource : "Enter personal details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isReadOnly && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Information has been automatically verified and filled from{" "}
                  {formData.identitySource === "singpass" ? "Singpass MyInfo" : "Jumio verification"}. Fields are
                  read-only.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nationality: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idType">ID Type *</Label>
                <Select
                  value={formData.idType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, idType: value }))}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NRIC">NRIC</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="Driver License">Driver License</SelectItem>
                    <SelectItem value="National ID">National ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, idNumber: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>
            </div>

            <Separator />

            <h3 className="font-medium">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData((prev) => ({ ...prev, addressLine2: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
              </div>
            </div>

            <Separator />

            <h3 className="font-medium">Investor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investorCategory">Investor Category *</Label>
                <Select
                  value={formData.investorCategory}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, investorCategory: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Accredited">Accredited Investor</SelectItem>
                    <SelectItem value="Institutional">Institutional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationType">Organization Type</Label>
                <Select
                  value={formData.organizationType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, organizationType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type (if applicable)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Fund">Fund</SelectItem>
                    <SelectItem value="Broker">Broker</SelectItem>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="Pension Fund">Pension Fund</SelectItem>
                    <SelectItem value="Insurance Company">Insurance Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="walletAddress">Wallet Address *</Label>
                <Input
                  id="walletAddress"
                  placeholder="0x..."
                  value={formData.walletAddress}
                  onChange={(e) => setFormData((prev) => ({ ...prev, walletAddress: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Documents */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Supporting Documents
            </CardTitle>
            <CardDescription>
              {formData.identitySource === "manual"
                ? "Upload required documents for verification"
                : "Additional documents may be required for compliance"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.identitySource !== "manual" && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Primary identity verification completed via {formData.identitySource}. Additional documents are
                  optional but may be required for specific compliance rules.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Proof of Identity {formData.identitySource === "manual" && "*"}</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload passport, national ID, or driver's license
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload("proofOfId", e.target.files[0])}
                    className="mt-2"
                  />
                  {formData.uploadedDocuments.proofOfId && (
                    <p className="text-sm text-green-600 mt-2">✓ {formData.uploadedDocuments.proofOfId.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Proof of Address {formData.identitySource === "manual" && "*"}</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload utility bill, bank statement, or lease agreement
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload("proofOfAddress", e.target.files[0])}
                    className="mt-2"
                  />
                  {formData.uploadedDocuments.proofOfAddress && (
                    <p className="text-sm text-green-600 mt-2">✓ {formData.uploadedDocuments.proofOfAddress.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Review & Submit
            </CardTitle>
            <CardDescription>Review all information before creating the ONCHAINID profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Personal Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Name:</strong> {formData.fullName}
                  </div>
                  <div>
                    <strong>Date of Birth:</strong> {formData.dateOfBirth}
                  </div>
                  <div>
                    <strong>Nationality:</strong> {formData.nationality}
                  </div>
                  <div>
                    <strong>ID:</strong> {formData.idType} - {formData.idNumber}
                  </div>
                  <div>
                    <strong>Email:</strong> {formData.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {formData.phoneNumber}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Address & Investor Info</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Address:</strong> {formData.addressLine1}, {formData.city}, {formData.country}
                  </div>
                  <div>
                    <strong>Investor Category:</strong> {formData.investorCategory}
                  </div>
                  <div>
                    <strong>Organization Type:</strong> {formData.organizationType || "Individual"}
                  </div>
                  <div>
                    <strong>Wallet Address:</strong> {formData.walletAddress}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Claims to be Attached</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { code: 1, name: "KYC Completed" },
                  { code: 2, name: "AML Completed" },
                  { code: 4, name: "Proof of ID" },
                  { code: 5, name: "Proof of Residency" },
                  { code: 9, name: "Country of Residence" },
                  { code: 10, name: "Nationality" },
                  { code: 12, name: "DOB" },
                  { code: 13, name: "Investor Category" },
                ].map((claim) => (
                  <Badge key={claim.code} variant="outline" className="text-xs">
                    {claim.code}: {claim.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, termsAccepted: checked as boolean }))}
                />
                <Label htmlFor="terms" className="text-sm">
                  I accept the terms and conditions for ONCHAINID creation
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dataProcessing"
                  checked={formData.dataProcessingConsent}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, dataProcessingConsent: checked as boolean }))
                  }
                />
                <Label htmlFor="dataProcessing" className="text-sm">
                  I consent to data processing for AML screening and compliance verification
                </Label>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Upon submission, the system will perform AML screening. If no matches are found, an ONCHAINID contract
                will be automatically created with the required claims. If AML matches are detected, the profile will be
                flagged for manual review.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.termsAccepted || !formData.dataProcessingConsent}
                className="bg-green-600 hover:bg-green-700"
              >
                Create ONCHAINID Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Processing & Results */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Processing Profile
            </CardTitle>
            <CardDescription>Performing AML screening and ONCHAINID creation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AML Screening Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {amlResult ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                )}
                <span className="font-medium">AML Screening</span>
                {amlResult && (
                  <Badge variant={amlResult.match === "N" ? "default" : "destructive"}>
                    {amlResult.match === "N" ? "No Match" : "Match Found"}
                  </Badge>
                )}
              </div>

              {amlResult && (
                <div className="ml-8 p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Risk Score: {amlResult.riskScore}</span>
                    <Progress value={amlResult.riskScore} className="w-32 h-2" />
                  </div>
                  {amlResult.matchDetails && (
                    <div className="space-y-2">
                      {amlResult.matchDetails.map((detail, index) => (
                        <div key={index} className="text-sm text-red-600">
                          <div className="font-medium">{detail.name}</div>
                          <div>
                            Reason: {detail.reason} (Confidence: {detail.confidence}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ONCHAINID Creation Status */}
            {amlResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {finalStatus === "approved" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : finalStatus === "pending" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  )}
                  <span className="font-medium">ONCHAINID Creation</span>
                  {finalStatus && (
                    <Badge variant={finalStatus === "approved" ? "default" : "secondary"}>
                      {finalStatus === "approved" ? "Created" : "Deferred"}
                    </Badge>
                  )}
                </div>

                {finalStatus === "approved" && onchainIdCreated && (
                  <div className="ml-8 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium">ONCHAINID Contract: </span>
                        <span className="text-sm font-mono">0x{Math.random().toString(16).substr(2, 40)}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Status: </span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Approved
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Claims Attached: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {[1, 2, 4, 5, 9, 10, 12, 13].map((code) => (
                            <Badge key={code} variant="outline" className="text-xs">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {finalStatus === "pending" && (
                  <div className="ml-8 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Status: </span>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Pending Manual Review
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        AML matches detected. ONCHAINID creation has been deferred pending manual compliance review. The
                        compliance team will review this case and make a determination.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {finalStatus && (
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setCurrentStep(1)
                    setFormData({
                      identitySource: "",
                      fullName: "",
                      dateOfBirth: "",
                      gender: "",
                      nationality: "",
                      idNumber: "",
                      idType: "",
                      phoneNumber: "",
                      email: "",
                      addressLine1: "",
                      addressLine2: "",
                      city: "",
                      state: "",
                      postalCode: "",
                      country: "",
                      investorCategory: "",
                      organizationType: "",
                      walletAddress: "",
                      uploadedDocuments: {
                        proofOfId: null,
                        proofOfAddress: null,
                        additionalDocs: [],
                      },
                      termsAccepted: false,
                      dataProcessingConsent: false,
                    })
                    setAmlResult(null)
                    setOnchainIdCreated(false)
                    setFinalStatus(null)
                  }}
                >
                  Create Another Profile
                </Button>
                <Button variant="outline">View Profile Details</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
