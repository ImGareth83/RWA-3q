"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, UserCheck, Shield, Search, Plus, AlertTriangle, Clock, FileText } from "lucide-react"

// ONCHAINID Claim Topics Constants
const CLAIM_TOPICS = {
  CLAIM_TOPIC_KYC: {
    code: 1,
    name: "KYC Verification",
    description: "Confirms that KYC has been completed",
    required: true,
  },
  CLAIM_TOPIC_AML: {
    code: 2,
    name: "AML Check",
    description: "Confirms that AML checks have been done",
    required: true,
  },
  CLAIM_TOPIC_ACCREDITATION: {
    code: 3,
    name: "Accredited Investor",
    description: "Investor is an accredited investor",
    required: false,
  },
  CLAIM_TOPIC_PROOF_OF_ID: {
    code: 4,
    name: "Proof of Identity",
    description: "Valid national ID, passport, or driver's license verified",
    required: true,
  },
  CLAIM_TOPIC_PROOF_OF_RESIDENCY: {
    code: 5,
    name: "Proof of Residency",
    description: "Utility bill, lease, or government document confirming residency",
    required: true,
  },
  CLAIM_TOPIC_US_TAX_ID: {
    code: 6,
    name: "US Tax ID",
    description: "U.S. Tax Identification Number (if applicable)",
    required: false,
  },
  CLAIM_TOPIC_CORPORATE_STATUS: {
    code: 7,
    name: "Corporate Status",
    description: "Validates incorporation of an entity",
    required: false,
  },
  CLAIM_TOPIC_LEGAL_REPRESENTATIVE: {
    code: 8,
    name: "Legal Representative",
    description: "Designates a wallet/controller as legal representative for an entity",
    required: false,
  },
  CLAIM_TOPIC_COUNTRY_OF_RESIDENCE: {
    code: 9,
    name: "Country of Residence",
    description: "Captures the country of residence",
    required: true,
  },
  CLAIM_TOPIC_NATIONALITY: {
    code: 10,
    name: "Nationality",
    description: "Confirms nationality for jurisdictional eligibility",
    required: true,
  },
  CLAIM_TOPIC_POLITICALLY_EXPOSED_PERSON: {
    code: 11,
    name: "PEP Status",
    description: "Flags PEP status",
    required: true,
  },
  CLAIM_TOPIC_DOB: { code: 12, name: "Date of Birth", description: "Date of birth", required: true },
  CLAIM_TOPIC_INVESTOR_CATEGORY: {
    code: 13,
    name: "Investor Category",
    description: "Categorizes investor type: Retail, AI, Institutional",
    required: true,
  },
  CLAIM_TOPIC_ORGANIZATION_TYPE: {
    code: 14,
    name: "Organization Type",
    description: "Indicates if entity is fund, broker, bank, etc.",
    required: false,
  },
}

export default function IdentityManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInvestor, setSelectedInvestor] = useState(null)

  const trustedIssuers = [
    {
      id: "0xTrusted1",
      name: "Jumio KYC Provider",
      jurisdiction: "Global",
      claimTypes: [1, 2, 4, 5, 9, 10, 12],
      status: "Active",
      validUntil: "2025-12-31",
    },
    {
      id: "0xTrusted2",
      name: "Compliance Officer Alpha",
      jurisdiction: "United States",
      claimTypes: [3, 6, 7, 8, 13, 14],
      status: "Active",
      validUntil: "2025-06-30",
    },
    {
      id: "0xTrusted3",
      name: "EU Regulatory Authority",
      jurisdiction: "European Union",
      claimTypes: [1, 2, 9, 10, 11],
      status: "Active",
      validUntil: "2025-12-31",
    },
  ]

  const investors = [
    {
      id: "0x1234...5678",
      name: "Institutional Investor A",
      type: "Institution",
      onchainId: "0xabcd...ef01",
      tokenBalance: "1,000,000",
      lastActivity: "2024-01-15",
      overallStatus: "Verified",
      eligibilityScore: 100,
      claims: [
        {
          topicCode: 1,
          topicName: "KYC Verification",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2024-07-01",
          data: "KYC_PASSED",
        },
        {
          topicCode: 2,
          topicName: "AML Check",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2024-07-01",
          data: "AML_CLEARED",
        },
        {
          topicCode: 3,
          topicName: "Accredited Investor",
          status: "Valid",
          issuer: "Compliance Officer Alpha",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "ACCREDITED",
        },
        {
          topicCode: 4,
          topicName: "Proof of Identity",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "PASSPORT_VERIFIED",
        },
        {
          topicCode: 5,
          topicName: "Proof of Residency",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2024-07-01",
          data: "UTILITY_BILL_VERIFIED",
        },
        {
          topicCode: 9,
          topicName: "Country of Residence",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "US",
        },
        {
          topicCode: 10,
          topicName: "Nationality",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "US",
        },
        {
          topicCode: 11,
          topicName: "PEP Status",
          status: "Valid",
          issuer: "EU Regulatory Authority",
          issuedDate: "2024-01-01",
          expiryDate: "2024-07-01",
          data: "NOT_PEP",
        },
        {
          topicCode: 12,
          topicName: "Date of Birth",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "1985-03-15",
        },
        {
          topicCode: 13,
          topicName: "Investor Category",
          status: "Valid",
          issuer: "Compliance Officer Alpha",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "INSTITUTIONAL",
        },
      ],
    },
    {
      id: "0x2345...6789",
      name: "Pension Fund XYZ",
      type: "Pension Fund",
      onchainId: "0xbcde...f012",
      tokenBalance: "2,500,000",
      lastActivity: "2024-01-14",
      overallStatus: "Verified",
      eligibilityScore: 95,
      claims: [
        {
          topicCode: 1,
          topicName: "KYC Verification",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2024-07-01",
          data: "KYC_PASSED",
        },
        {
          topicCode: 2,
          topicName: "AML Check",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2024-07-01",
          data: "AML_CLEARED",
        },
        {
          topicCode: 4,
          topicName: "Proof of Identity",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "CORPORATE_ID_VERIFIED",
        },
        {
          topicCode: 5,
          topicName: "Proof of Residency",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2024-07-01",
          data: "CORPORATE_ADDRESS_VERIFIED",
        },
        {
          topicCode: 7,
          topicName: "Corporate Status",
          status: "Valid",
          issuer: "Compliance Officer Alpha",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "INCORPORATED_CANADA",
        },
        {
          topicCode: 9,
          topicName: "Country of Residence",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "CA",
        },
        {
          topicCode: 11,
          topicName: "PEP Status",
          status: "Valid",
          issuer: "EU Regulatory Authority",
          issuedDate: "2024-01-01",
          expiryDate: "2024-07-01",
          data: "NOT_PEP",
        },
        {
          topicCode: 13,
          topicName: "Investor Category",
          status: "Valid",
          issuer: "Compliance Officer Alpha",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "INSTITUTIONAL",
        },
        {
          topicCode: 14,
          topicName: "Organization Type",
          status: "Valid",
          issuer: "Compliance Officer Alpha",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "PENSION_FUND",
        },
      ],
    },
    {
      id: "0x3456...789a",
      name: "Hedge Fund Alpha",
      type: "Hedge Fund",
      onchainId: "0xcdef...0123",
      tokenBalance: "0",
      lastActivity: "2024-01-13",
      overallStatus: "Incomplete",
      eligibilityScore: 60,
      claims: [
        {
          topicCode: 1,
          topicName: "KYC Verification",
          status: "Expired",
          issuer: "Jumio KYC Provider",
          issuedDate: "2023-06-01",
          expiryDate: "2023-12-01",
          data: "KYC_PASSED",
        },
        {
          topicCode: 2,
          topicName: "AML Check",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2024-07-01",
          data: "AML_CLEARED",
        },
        {
          topicCode: 4,
          topicName: "Proof of Identity",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "CORPORATE_ID_VERIFIED",
        },
        {
          topicCode: 9,
          topicName: "Country of Residence",
          status: "Valid",
          issuer: "Jumio KYC Provider",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "GB",
        },
        {
          topicCode: 13,
          topicName: "Investor Category",
          status: "Valid",
          issuer: "Compliance Officer Alpha",
          issuedDate: "2024-01-01",
          expiryDate: "2025-01-01",
          data: "INSTITUTIONAL",
        },
        // Missing required claims: 5, 10, 11, 12
      ],
    },
  ]

  const filteredInvestors = investors.filter((investor) => {
    const matchesSearch =
      investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || investor.overallStatus.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Verified</Badge>
      case "Incomplete":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Incomplete</Badge>
        )
      case "Expired":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Expired</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getClaimStatusBadge = (status: string) => {
    switch (status) {
      case "Valid":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Valid</Badge>
      case "Expired":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Expired</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>
      case "Missing":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Missing</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getEligibilityColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const calculateMissingClaims = (investor) => {
    const requiredClaims = Object.values(CLAIM_TOPICS).filter((topic) => topic.required)
    const investorClaimCodes = investor.claims.map((claim) => claim.topicCode)
    return requiredClaims.filter((topic) => !investorClaimCodes.includes(topic.code))
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Investors</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Fully Verified</p>
                <p className="text-2xl font-bold text-green-600">1,156</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Incomplete Claims</p>
                <p className="text-2xl font-bold text-yellow-600">67</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Expired Claims</p>
                <p className="text-2xl font-bold text-red-600">24</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="investors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="investors">Investor Registry</TabsTrigger>
          <TabsTrigger value="claims">Claim Topics</TabsTrigger>
          <TabsTrigger value="issuers">Trusted Issuers</TabsTrigger>
        </TabsList>

        <TabsContent value="investors" className="space-y-6">
          {/* Add New Investor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Investor
              </CardTitle>
              <CardDescription>Onboard a new investor with ONCHAINID verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investorName">Investor Name</Label>
                  <Input id="investorName" placeholder="Enter investor name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input id="walletAddress" placeholder="0x..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onchainId">ONCHAINID Contract</Label>
                  <Input id="onchainId" placeholder="0x..." />
                </div>
              </div>
              <div className="mt-4">
                <Button>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Initiate Claims Verification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Investor Management */}
          <Card>
            <CardHeader>
              <CardTitle>Investor Registry</CardTitle>
              <CardDescription>Manage verified investors and their ONCHAINID claims status</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search investors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="incomplete">Incomplete</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Investor Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investor</TableHead>
                      <TableHead>ONCHAINID</TableHead>
                      <TableHead>Eligibility Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Claims Status</TableHead>
                      <TableHead>Token Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvestors.map((investor) => (
                      <TableRow key={investor.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{investor.name}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{investor.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-mono">{investor.onchainId}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={investor.eligibilityScore} className="w-16 h-2" />
                            <span className={`text-sm font-medium ${getEligibilityColor(investor.eligibilityScore)}`}>
                              {investor.eligibilityScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(investor.overallStatus)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {investor.claims.filter((c) => c.status === "Valid").length} Valid
                            </Badge>
                            {investor.claims.filter((c) => c.status === "Expired").length > 0 && (
                              <Badge variant="outline" className="text-xs text-red-600">
                                {investor.claims.filter((c) => c.status === "Expired").length} Expired
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{Number.parseInt(investor.tokenBalance).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedInvestor(investor)}>
                              View Claims
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Investor Claims Detail Modal */}
          {selectedInvestor && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Claims Details: {selectedInvestor.name}</span>
                  <Button variant="outline" size="sm" onClick={() => setSelectedInvestor(null)}>
                    Close
                  </Button>
                </CardTitle>
                <CardDescription>
                  ONCHAINID: {selectedInvestor.onchainId} • Eligibility Score: {selectedInvestor.eligibilityScore}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Valid Claims */}
                    <div>
                      <h4 className="font-medium mb-3 text-green-600">Valid Claims</h4>
                      <div className="space-y-2">
                        {selectedInvestor.claims
                          .filter((claim) => claim.status === "Valid")
                          .map((claim, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/20">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{claim.topicName}</span>
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Topic {claim.topicCode}
                                </Badge>
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">Issuer: {claim.issuer}</div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">
                                Expires: {claim.expiryDate}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Issues */}
                    <div>
                      <h4 className="font-medium mb-3 text-red-600">Issues & Missing Claims</h4>
                      <div className="space-y-2">
                        {/* Expired Claims */}
                        {selectedInvestor.claims
                          .filter((claim) => claim.status === "Expired")
                          .map((claim, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-red-50 dark:bg-red-900/20">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{claim.topicName}</span>
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                  Expired
                                </Badge>
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">
                                Expired: {claim.expiryDate}
                              </div>
                            </div>
                          ))}

                        {/* Missing Required Claims */}
                        {calculateMissingClaims(selectedInvestor).map((missingClaim, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/20">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{missingClaim.name}</span>
                              <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                                Missing
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">{missingClaim.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button>Request Missing Claims</Button>
                    <Button variant="outline">Refresh Expired Claims</Button>
                    <Button variant="outline">Export Claims Report</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="claims" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                ONCHAINID Claim Topics
              </CardTitle>
              <CardDescription>Standardized claim topics for ERC-3643 compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(CLAIM_TOPICS).map(([key, topic]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Topic {topic.code}</Badge>
                        <span className="font-medium">{topic.name}</span>
                      </div>
                      {topic.required && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Required</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{topic.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issuers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Trusted Claim Issuers
              </CardTitle>
              <CardDescription>Manage approved claim issuers for different jurisdictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trustedIssuers.map((issuer, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{issuer.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{issuer.jurisdiction}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={issuer.status === "Active" ? "default" : "secondary"}>{issuer.status}</Badge>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Valid until {issuer.validUntil}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Authorized Claim Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {issuer.claimTypes.map((topicCode) => {
                          const topic = Object.values(CLAIM_TOPICS).find((t) => t.code === topicCode)
                          return (
                            <Badge key={topicCode} variant="outline" className="text-xs">
                              {topicCode}: {topic?.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
