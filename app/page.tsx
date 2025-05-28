"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Users, FileText, Settings, TrendingUp, UserPlus, Cog } from "lucide-react"
import TokenIssuance from "@/components/token-issuance"
import IdentityManagement from "@/components/identity-management"
import ComplianceRules from "@/components/compliance-rules"
import AuditTrail from "@/components/audit-trail"
import Dashboard from "@/components/dashboard"
import CreateOnchainIdProfile from "@/components/create-onchainid-profile"
import TokenLifecycle from "@/components/token-lifecycle"

export default function TokenizationEngine() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">ERC-3643 Tokenization Engine</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Real-World Asset Tokenization with Built-in Compliance
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Shield className="h-3 w-3 mr-1" />
              ERC-3643 Compliant
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Users className="h-3 w-3 mr-1" />
              ONCHAINID Verified
            </Badge>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            >
              <FileText className="h-3 w-3 mr-1" />
              Regulatory Compliant
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-fit">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="issuance" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Issuance
            </TabsTrigger>
            <TabsTrigger value="lifecycle" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              Lifecycle
            </TabsTrigger>
            <TabsTrigger value="identity" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Identity
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Audit
            </TabsTrigger>
            <TabsTrigger value="create-profile" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="issuance">
            <TokenIssuance />
          </TabsContent>

          <TabsContent value="lifecycle">
            <TokenLifecycle />
          </TabsContent>

          <TabsContent value="identity">
            <IdentityManagement />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceRules />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTrail />
          </TabsContent>

          <TabsContent value="create-profile">
            <CreateOnchainIdProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
