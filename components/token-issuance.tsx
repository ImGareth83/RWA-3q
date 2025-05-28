"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Coins,
  Settings,
  FileText,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Shield,
  Globe,
  Wallet,
  Building,
  DollarSign,
  Users,
  Eye,
  Copy,
} from "lucide-react"

interface TokenMetadata {
  name: string
  symbol: string
  assetType: string
  decimals: number
  totalSupplyCap: string
  navMethod: string
  description: string
}

interface ComplianceModule {
  id: string
  name: string
  description: string
  icon: any
  category: string
  selected: boolean
  config: any
}

interface DeployedToken {
  contractAddress: string
  tokenMetadata: TokenMetadata
  selectedModules: ComplianceModule[]
  deploymentTimestamp: string
  txHash: string
  blockNumber: number
  deployedBy: string
  gasUsed: number
}

export default function TokenIssuance() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<DeployedToken | null>(null)

  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>({
    name: "",
    symbol: "",
    assetType: "",
    decimals: 18,
    totalSupplyCap: "",
    navMethod: "",
    description: "",
  })

  const [complianceModules, setComplianceModules] = useState<ComplianceModule[]>([
    {
      id: "country-allow",
      name: "Country Allow Module",
      description: "Allow transfers only to participants from allowed countries",
      icon: Globe,
      category: "Geographic",
      selected: false,
      config: {
        allowedCountries: ["US", "CA", "GB", "DE", "SG"],
        strictMode: true,
      },
    },
    {
      id: "country-restrict",
      name: "Country Restrict Module",
      description: "Block transfers to participants from blacklisted jurisdictions",
      icon: Globe,
      category: "Geographic",
      selected: false,
      config: {
        restrictedCountries: ["CN", "RU", "IR", "KP"],
        sanctionsList: "OFAC",
      },
    },
    {
      id: "max-balance",
      name: "Max Balance Module",
      description: "Limit the number of tokens a single wallet can hold",
      icon: Wallet,
      category: "Financial",
      selected: false,
      config: {
        maxBalance: 1000000,
        exemptAddresses: [],
      },
    },
    {
      id: "transfer-restrict",
      name: "Transfer Restrict Module",
      description: "Whitelist-based access control for sending/receiving tokens",
      icon: Users,
      category: "Access",
      selected: false,
      config: {
        whitelistMode: true,
        initialWhitelist: [],
      },
    },
    {
      id: "exchange-monthly-limits",
      name: "Exchange Monthly Limits Module",
      description: "Limit monthly token volume through specific exchanges",
      icon: Building,
      category: "Financial",
      selected: false,
      config: {
        exchanges: [{ address: "", name: "", monthlyLimit: 5000000 }],
      },
    },
    {
      id: "transfer-fees",
      name: "Transfer Fees Module",
      description: "Apply transaction fees to token transfers",
      icon: DollarSign,
      category: "Financial",
      selected: false,
      config: {
        feePercentage: 0.1,
        feeRecipient: "",
        minimumTransfer: 1000,
      },
    },
  ])

  const toggleModule = (moduleId: string) => {
    setComplianceModules(
      complianceModules.map((module) => (module.id === moduleId ? { ...module, selected: !module.selected } : module)),
    )
  }

  const updateModuleConfig = (moduleId: string, newConfig: any) => {
    setComplianceModules(
      complianceModules.map((module) =>
        module.id === moduleId ? { ...module, config: { ...module.config, ...newConfig } } : module,
      ),
    )
  }

  const deployToken = async () => {
    setIsDeploying(true)

    try {
      // Simulate deployment process
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // Mock deployment result
      const mockDeployment: DeployedToken = {
        contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        tokenMetadata,
        selectedModules: complianceModules.filter((m) => m.selected),
        deploymentTimestamp: new Date().toISOString().replace("T", " ").substr(0, 19),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: 18234567 + Math.floor(Math.random() * 1000),
        deployedBy: "issuer.admin@company.com",
        gasUsed: Math.floor(Math.random() * 500000) + 2000000,
      }

      setDeploymentResult(mockDeployment)
      setCurrentStep(4)
    } catch (error) {
      console.error("Deployment error:", error)
    } finally {
      setIsDeploying(false)
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setDeploymentResult(null)
    setTokenMetadata({
      name: "",
      symbol: "",
      assetType: "",
      decimals: 18,
      totalSupplyCap: "",
      navMethod: "",
      description: "",
    })
    setComplianceModules(complianceModules.map((module) => ({ ...module, selected: false })))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Geographic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Financial":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Access":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const renderModuleConfig = (module: ComplianceModule) => {
    switch (module.id) {
      case "country-allow":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Allowed Countries (comma-separated)</Label>
              <Input
                value={module.config.allowedCountries.join(", ")}
                onChange={(e) =>
                  updateModuleConfig(module.id, {
                    allowedCountries: e.target.value.split(",").map((c) => c.trim().toUpperCase()),
                  })
                }
                placeholder="US, CA, GB, DE, SG"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={module.config.strictMode}
                onCheckedChange={(checked) => updateModuleConfig(module.id, { strictMode: checked })}
              />
              <Label className="text-sm">Strict mode (block unknown countries)</Label>
            </div>
          </div>
        )

      case "max-balance":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Maximum Balance per Wallet</Label>
              <Input
                type="number"
                value={module.config.maxBalance}
                onChange={(e) => updateModuleConfig(module.id, { maxBalance: Number.parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label className="text-sm">Exempt Addresses (one per line)</Label>
              <Textarea
                value={module.config.exemptAddresses.join("\n")}
                onChange={(e) =>
                  updateModuleConfig(module.id, {
                    exemptAddresses: e.target.value.split("\n").filter((addr) => addr.trim()),
                  })
                }
                placeholder="0x..."
                rows={3}
              />
            </div>
          </div>
        )

      case "transfer-fees":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Fee Percentage (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={module.config.feePercentage}
                  onChange={(e) => updateModuleConfig(module.id, { feePercentage: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label className="text-sm">Minimum Transfer</Label>
                <Input
                  type="number"
                  value={module.config.minimumTransfer}
                  onChange={(e) => updateModuleConfig(module.id, { minimumTransfer: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm">Fee Recipient Address</Label>
              <Input
                value={module.config.feeRecipient}
                onChange={(e) => updateModuleConfig(module.id, { feeRecipient: e.target.value })}
                placeholder="0x..."
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Configuration options for {module.name} will be available here.
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {[
              { id: 1, title: "Token Metadata" },
              { id: 2, title: "Compliance Modules" },
              { id: 3, title: "Review & Deploy" },
              { id: 4, title: "Deployment Result" },
            ].map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step.id ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-medium">
              {currentStep === 1 && "Token Metadata"}
              {currentStep === 2 && "Compliance Modules"}
              {currentStep === 3 && "Review & Deploy"}
              {currentStep === 4 && "Deployment Result"}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Token Metadata */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Token Metadata
            </CardTitle>
            <CardDescription>Define the basic properties of your ERC-3643 security token</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tokenName">Token Name *</Label>
                <Input
                  id="tokenName"
                  placeholder="Symphony MMF Token A"
                  value={tokenMetadata.name}
                  onChange={(e) => setTokenMetadata({ ...tokenMetadata, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenSymbol">Token Symbol *</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="sMMFA"
                  value={tokenMetadata.symbol}
                  onChange={(e) => setTokenMetadata({ ...tokenMetadata, symbol: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type *</Label>
                <Select
                  value={tokenMetadata.assetType}
                  onValueChange={(value) => setTokenMetadata({ ...tokenMetadata, assetType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="money-market">Money Market Fund</SelectItem>
                    <SelectItem value="treasury">Treasury Fund</SelectItem>
                    <SelectItem value="corporate-bond">Corporate Bond Fund</SelectItem>
                    <SelectItem value="equity">Equity Fund</SelectItem>
                    <SelectItem value="real-estate">Real Estate Fund</SelectItem>
                    <SelectItem value="commodity">Commodity Fund</SelectItem>
                    <SelectItem value="private-equity">Private Equity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="decimals">Decimal Precision</Label>
                <Select
                  value={tokenMetadata.decimals.toString()}
                  onValueChange={(value) => setTokenMetadata({ ...tokenMetadata, decimals: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 decimals</SelectItem>
                    <SelectItem value="8">8 decimals</SelectItem>
                    <SelectItem value="18">18 decimals (standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSupplyCap">Total Supply Cap *</Label>
                <Input
                  id="totalSupplyCap"
                  type="number"
                  placeholder="1000000"
                  value={tokenMetadata.totalSupplyCap}
                  onChange={(e) => setTokenMetadata({ ...tokenMetadata, totalSupplyCap: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="navMethod">NAV Method</Label>
                <Select
                  value={tokenMetadata.navMethod}
                  onValueChange={(value) => setTokenMetadata({ ...tokenMetadata, navMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select NAV calculation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily NAV Update</SelectItem>
                    <SelectItem value="weekly">Weekly NAV Update</SelectItem>
                    <SelectItem value="monthly">Monthly NAV Update</SelectItem>
                    <SelectItem value="real-time">Real-time Pricing</SelectItem>
                    <SelectItem value="fixed">Fixed Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the fund's investment strategy and objectives..."
                value={tokenMetadata.description}
                onChange={(e) => setTokenMetadata({ ...tokenMetadata, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={
                  !tokenMetadata.name ||
                  !tokenMetadata.symbol ||
                  !tokenMetadata.assetType ||
                  !tokenMetadata.totalSupplyCap
                }
              >
                Continue to Compliance Modules
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Compliance Modules */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Select Compliance Modules
            </CardTitle>
            <CardDescription>Choose which compliance modules will govern your token's behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {complianceModules.map((module) => (
                <Card
                  key={module.id}
                  className={`cursor-pointer transition-colors ${
                    module.selected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => toggleModule(module.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={module.selected} onChange={() => {}} />
                        <module.icon className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{module.name}</h3>
                          <Badge className={getCategoryColor(module.category)} variant="outline">
                            {module.category}
                          </Badge>
                        </div>
                      </div>
                      {module.selected && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-3">
                              <h4 className="font-medium">Configure {module.name}</h4>
                              {renderModuleConfig(module)}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{module.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)}>Continue to Review</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Deploy */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Review & Deploy
            </CardTitle>
            <CardDescription>Review your token configuration before deployment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Token Metadata Summary */}
            <div>
              <h3 className="font-medium mb-3">Token Metadata</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {tokenMetadata.name}
                </div>
                <div>
                  <strong>Symbol:</strong> {tokenMetadata.symbol}
                </div>
                <div>
                  <strong>Asset Type:</strong> {tokenMetadata.assetType}
                </div>
                <div>
                  <strong>Decimals:</strong> {tokenMetadata.decimals}
                </div>
                <div>
                  <strong>Total Supply Cap:</strong> {Number.parseInt(tokenMetadata.totalSupplyCap).toLocaleString()}
                </div>
                <div>
                  <strong>NAV Method:</strong> {tokenMetadata.navMethod || "Not specified"}
                </div>
              </div>
              {tokenMetadata.description && (
                <div className="mt-3">
                  <strong>Description:</strong>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tokenMetadata.description}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Selected Modules Summary */}
            <div>
              <h3 className="font-medium mb-3">Selected Compliance Modules</h3>
              {complianceModules.filter((m) => m.selected).length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">No compliance modules selected</p>
              ) : (
                <div className="space-y-3">
                  {complianceModules
                    .filter((m) => m.selected)
                    .map((module) => (
                      <div key={module.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <module.icon className="h-4 w-4" />
                          <span className="font-medium">{module.name}</span>
                          <Badge className={getCategoryColor(module.category)} variant="outline">
                            {module.category}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(module.config, null, 2)}</pre>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Deploying this token will create an ERC-3643 compliant smart contract on the blockchain. This action
                cannot be undone. Please review all settings carefully.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={deployToken} disabled={isDeploying} className="bg-green-600 hover:bg-green-700">
                {isDeploying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Deploying Token Contract...
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4 mr-2" />
                    Deploy Token Contract
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Deployment Result */}
      {currentStep === 4 && deploymentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Token Deployed Successfully
            </CardTitle>
            <CardDescription>Your ERC-3643 token has been deployed to the blockchain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Deployment Successful!</strong> Your token contract is now live on the blockchain.
              </AlertDescription>
            </Alert>

            {/* Deployment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Token Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Token Name:</span>
                    <span className="font-medium">{deploymentResult.tokenMetadata.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Symbol:</span>
                    <span className="font-medium">{deploymentResult.tokenMetadata.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Supply Cap:</span>
                    <span className="font-medium">
                      {Number.parseInt(deploymentResult.tokenMetadata.totalSupplyCap).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance Modules:</span>
                    <span className="font-medium">{deploymentResult.selectedModules.length}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Blockchain Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Contract Address:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{deploymentResult.contractAddress.substring(0, 10)}...</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(deploymentResult.contractAddress)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Transaction Hash:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{deploymentResult.txHash.substring(0, 10)}...</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(deploymentResult.txHash)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Block Number:</span>
                    <span className="font-medium">{deploymentResult.blockNumber.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas Used:</span>
                    <span className="font-medium">{deploymentResult.gasUsed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deployed:</span>
                    <span className="font-medium">{deploymentResult.deploymentTimestamp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Modules */}
            <div>
              <h3 className="font-medium mb-3">Deployed Compliance Modules</h3>
              <div className="flex flex-wrap gap-2">
                {deploymentResult.selectedModules.map((module) => (
                  <Badge key={module.id} className={getCategoryColor(module.category)}>
                    {module.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`https://etherscan.io/address/${deploymentResult.contractAddress}`, "_blank")
                }
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Block Explorer
              </Button>
              <Button onClick={resetForm}>Deploy Another Token</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
