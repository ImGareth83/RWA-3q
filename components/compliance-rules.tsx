"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  Globe,
  Ban,
  Wallet,
  Coins,
  Building,
  Clock,
  DollarSign,
  Users,
  Plus,
  Trash2,
  Save,
  TestTube,
} from "lucide-react"

interface ComplianceModule {
  id: string
  name: string
  description: string
  icon: any
  enabled: boolean
  category: "Geographic" | "Financial" | "Temporal" | "Access"
  config: any
  lastUpdated: string
  updatedBy: string
}

interface ModuleLog {
  id: string
  moduleId: string
  moduleName: string
  action: string
  parameters: any
  updatedBy: string
  timestamp: string
  reason?: string
}

export default function ComplianceRules() {
  const [modules, setModules] = useState<ComplianceModule[]>([
    {
      id: "country-allow",
      name: "Country Allow Module",
      description: "Allows transfers only to participants from an allowed list of country codes",
      icon: Globe,
      enabled: true,
      category: "Geographic",
      config: {
        allowedCountries: ["US", "CA", "GB", "DE", "SG", "AU"],
        strictMode: true,
      },
      lastUpdated: "2024-01-15 14:30:00",
      updatedBy: "compliance.officer@company.com",
    },
    {
      id: "country-restrict",
      name: "Country Restrict Module",
      description: "Blocks transfers to participants from blacklisted jurisdictions",
      icon: Ban,
      enabled: true,
      category: "Geographic",
      config: {
        restrictedCountries: ["CN", "RU", "IR", "KP"],
        sanctionsList: "OFAC",
        autoUpdate: true,
      },
      lastUpdated: "2024-01-15 12:00:00",
      updatedBy: "compliance.officer@company.com",
    },
    {
      id: "max-balance",
      name: "Max Balance Module",
      description: "Caps the number of tokens a single wallet can hold",
      icon: Wallet,
      enabled: true,
      category: "Financial",
      config: {
        maxBalance: 1000000,
        exemptAddresses: ["0x1234...5678", "0x9876...5432"],
        enforceForAll: true,
      },
      lastUpdated: "2024-01-15 10:15:00",
      updatedBy: "risk.manager@company.com",
    },
    {
      id: "supply-limit",
      name: "Supply Limit Module",
      description: "Sets a hard limit on the total number of minted tokens",
      icon: Coins,
      enabled: true,
      category: "Financial",
      config: {
        maxSupply: 100000000,
        currentSupply: 75000000,
        mintingPaused: false,
      },
      lastUpdated: "2024-01-15 09:00:00",
      updatedBy: "token.admin@company.com",
    },
    {
      id: "exchange-monthly-limits",
      name: "Exchange Monthly Limits Module",
      description: "Limits monthly token volume through specific exchanges",
      icon: Building,
      enabled: false,
      category: "Financial",
      config: {
        exchanges: [
          { address: "0xExchange1", name: "DEX Alpha", monthlyLimit: 5000000, currentVolume: 2300000 },
          { address: "0xExchange2", name: "CEX Beta", monthlyLimit: 10000000, currentVolume: 7800000 },
        ],
        resetDay: 1,
      },
      lastUpdated: "2024-01-14 16:45:00",
      updatedBy: "operations.manager@company.com",
    },
    {
      id: "time-exchange-limits",
      name: "Time Exchange Limits Module",
      description: "Enables exchange-specific trading during designated timeframes",
      icon: Clock,
      enabled: false,
      category: "Temporal",
      config: {
        tradingHours: {
          start: "09:00",
          end: "17:00",
          timezone: "UTC",
          weekendsAllowed: false,
        },
        exchanges: ["0xExchange1", "0xExchange2"],
      },
      lastUpdated: "2024-01-14 14:20:00",
      updatedBy: "compliance.officer@company.com",
    },
    {
      id: "time-transfers-limits",
      name: "Time Transfers Limits Module",
      description: "Restricts how many tokens a participant can transfer over a time period",
      icon: Clock,
      enabled: true,
      category: "Temporal",
      config: {
        timeWindow: 24, // hours
        maxTransfers: 5,
        maxAmount: 100000,
        cooldownPeriod: 1, // hours
      },
      lastUpdated: "2024-01-15 11:30:00",
      updatedBy: "risk.manager@company.com",
    },
    {
      id: "transfer-fees",
      name: "Transfer Fees Module",
      description: "Automatically deducts a transfer fee and routes it to a collector address",
      icon: DollarSign,
      enabled: true,
      category: "Financial",
      config: {
        feePercentage: 0.1, // 0.1%
        flatFee: 0, // Additional flat fee
        collectorAddress: "0xFeeCollector",
        exemptAddresses: ["0x1234...5678"],
        minimumTransfer: 1000,
      },
      lastUpdated: "2024-01-15 08:45:00",
      updatedBy: "finance.manager@company.com",
    },
    {
      id: "transfer-restrict",
      name: "Transfer Restrict Module",
      description: "Whitelist-based access control for sending/receiving tokens",
      icon: Users,
      enabled: true,
      category: "Access",
      config: {
        whitelistMode: true,
        whitelistedAddresses: ["0x1234...5678", "0x2345...6789", "0x3456...789a", "0x4567...89ab"],
        allowSelfTransfer: true,
        batchUpdateEnabled: true,
      },
      lastUpdated: "2024-01-15 13:15:00",
      updatedBy: "compliance.officer@company.com",
    },
  ])

  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [testTransfer, setTestTransfer] = useState({
    from: "",
    to: "",
    amount: "",
    fromCountry: "",
    toCountry: "",
  })
  const [testResult, setTestResult] = useState<any>(null)

  const [moduleLogs] = useState<ModuleLog[]>([
    {
      id: "log-001",
      moduleId: "country-restrict",
      moduleName: "Country Restrict Module",
      action: "Transfer Blocked",
      parameters: { from: "0x1234...5678", to: "0x9876...5432", reason: "Recipient in restricted jurisdiction (CN)" },
      updatedBy: "system",
      timestamp: "2024-01-15 14:30:00",
      reason: "Jurisdiction restriction",
    },
    {
      id: "log-002",
      moduleId: "max-balance",
      moduleName: "Max Balance Module",
      action: "Transfer Blocked",
      parameters: { to: "0x2345...6789", amount: "500000", currentBalance: "750000", maxBalance: "1000000" },
      updatedBy: "system",
      timestamp: "2024-01-15 13:45:00",
      reason: "Would exceed maximum balance",
    },
    {
      id: "log-003",
      moduleId: "transfer-fees",
      moduleName: "Transfer Fees Module",
      action: "Fee Collected",
      parameters: { amount: "100000", fee: "100", collectorAddress: "0xFeeCollector" },
      updatedBy: "system",
      timestamp: "2024-01-15 12:20:00",
    },
    {
      id: "log-004",
      moduleId: "country-allow",
      moduleName: "Country Allow Module",
      action: "Configuration Updated",
      parameters: { addedCountries: ["FR", "IT"], removedCountries: ["BR"] },
      updatedBy: "compliance.officer@company.com",
      timestamp: "2024-01-15 11:00:00",
    },
  ])

  const toggleModule = (moduleId: string) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, enabled: !module.enabled, lastUpdated: new Date().toISOString() }
          : module,
      ),
    )
  }

  const updateModuleConfig = (moduleId: string, newConfig: any) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              config: { ...module.config, ...newConfig },
              lastUpdated: new Date().toISOString(),
              updatedBy: "current.user@company.com",
            }
          : module,
      ),
    )
  }

  const simulateTransfer = () => {
    const results = []
    let transferAllowed = true

    // Check each enabled module
    modules
      .filter((m) => m.enabled)
      .forEach((module) => {
        switch (module.id) {
          case "country-allow":
            if (!module.config.allowedCountries.includes(testTransfer.toCountry)) {
              results.push({
                module: module.name,
                status: "BLOCKED",
                reason: `Recipient country (${testTransfer.toCountry}) not in allowed list`,
              })
              transferAllowed = false
            } else {
              results.push({
                module: module.name,
                status: "PASSED",
                reason: "Recipient country is allowed",
              })
            }
            break

          case "country-restrict":
            if (module.config.restrictedCountries.includes(testTransfer.toCountry)) {
              results.push({
                module: module.name,
                status: "BLOCKED",
                reason: `Recipient country (${testTransfer.toCountry}) is restricted`,
              })
              transferAllowed = false
            } else {
              results.push({
                module: module.name,
                status: "PASSED",
                reason: "Recipient country is not restricted",
              })
            }
            break

          case "max-balance":
            const amount = Number.parseInt(testTransfer.amount) || 0
            const currentBalance = 500000 // Mock current balance
            if (currentBalance + amount > module.config.maxBalance) {
              results.push({
                module: module.name,
                status: "BLOCKED",
                reason: `Transfer would exceed max balance (${module.config.maxBalance})`,
              })
              transferAllowed = false
            } else {
              results.push({
                module: module.name,
                status: "PASSED",
                reason: "Transfer within balance limits",
              })
            }
            break

          case "transfer-fees":
            const fee = (Number.parseInt(testTransfer.amount) || 0) * (module.config.feePercentage / 100)
            results.push({
              module: module.name,
              status: "PASSED",
              reason: `Fee of ${fee.toFixed(2)} tokens will be collected`,
            })
            break

          default:
            results.push({
              module: module.name,
              status: "PASSED",
              reason: "Module check passed",
            })
        }
      })

    setTestResult({
      allowed: transferAllowed,
      results: results,
    })
  }

  const getModuleIcon = (module: ComplianceModule) => {
    const IconComponent = module.icon
    return <IconComponent className="h-5 w-5" />
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Geographic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Financial":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Temporal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
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
          <div className="space-y-4">
            <div>
              <Label>Allowed Countries</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {module.config.allowedCountries.map((country: string) => (
                  <Badge key={country} variant="outline" className="flex items-center gap-1">
                    {country}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => {
                        const newCountries = module.config.allowedCountries.filter((c: string) => c !== country)
                        updateModuleConfig(module.id, { allowedCountries: newCountries })
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input placeholder="Add country code (e.g., FR)" id="new-country" />
                <Button
                  onClick={() => {
                    const input = document.getElementById("new-country") as HTMLInputElement
                    if (input.value && !module.config.allowedCountries.includes(input.value.toUpperCase())) {
                      updateModuleConfig(module.id, {
                        allowedCountries: [...module.config.allowedCountries, input.value.toUpperCase()],
                      })
                      input.value = ""
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={module.config.strictMode}
                onCheckedChange={(checked) => updateModuleConfig(module.id, { strictMode: checked })}
              />
              <Label>Strict Mode (block if country unknown)</Label>
            </div>
          </div>
        )

      case "country-restrict":
        return (
          <div className="space-y-4">
            <div>
              <Label>Restricted Countries</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {module.config.restrictedCountries.map((country: string) => (
                  <Badge key={country} variant="destructive" className="flex items-center gap-1">
                    {country}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 text-white hover:text-red-200"
                      onClick={() => {
                        const newCountries = module.config.restrictedCountries.filter((c: string) => c !== country)
                        updateModuleConfig(module.id, { restrictedCountries: newCountries })
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Sanctions List Source</Label>
              <Select
                value={module.config.sanctionsList}
                onValueChange={(value) => updateModuleConfig(module.id, { sanctionsList: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OFAC">OFAC (US Treasury)</SelectItem>
                  <SelectItem value="EU">EU Sanctions List</SelectItem>
                  <SelectItem value="UN">UN Security Council</SelectItem>
                  <SelectItem value="CUSTOM">Custom List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={module.config.autoUpdate}
                onCheckedChange={(checked) => updateModuleConfig(module.id, { autoUpdate: checked })}
              />
              <Label>Auto-update from sanctions list</Label>
            </div>
          </div>
        )

      case "max-balance":
        return (
          <div className="space-y-4">
            <div>
              <Label>Maximum Balance per Wallet</Label>
              <Input
                type="number"
                value={module.config.maxBalance}
                onChange={(e) => updateModuleConfig(module.id, { maxBalance: Number.parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Exempt Addresses</Label>
              <Textarea
                value={module.config.exemptAddresses.join("\n")}
                onChange={(e) =>
                  updateModuleConfig(module.id, {
                    exemptAddresses: e.target.value.split("\n").filter((addr) => addr.trim()),
                  })
                }
                placeholder="Enter wallet addresses (one per line)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={module.config.enforceForAll}
                onCheckedChange={(checked) => updateModuleConfig(module.id, { enforceForAll: checked })}
              />
              <Label>Enforce for all addresses (including exempt list)</Label>
            </div>
          </div>
        )

      case "supply-limit":
        return (
          <div className="space-y-4">
            <div>
              <Label>Maximum Total Supply</Label>
              <Input
                type="number"
                value={module.config.maxSupply}
                onChange={(e) => updateModuleConfig(module.id, { maxSupply: Number.parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Current Supply (Read-only)</Label>
              <Input value={module.config.currentSupply.toLocaleString()} readOnly />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={module.config.mintingPaused}
                onCheckedChange={(checked) => updateModuleConfig(module.id, { mintingPaused: checked })}
              />
              <Label>Pause all minting operations</Label>
            </div>
          </div>
        )

      case "time-transfers-limits":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Time Window (hours)</Label>
                <Input
                  type="number"
                  value={module.config.timeWindow}
                  onChange={(e) => updateModuleConfig(module.id, { timeWindow: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Max Transfers per Window</Label>
                <Input
                  type="number"
                  value={module.config.maxTransfers}
                  onChange={(e) => updateModuleConfig(module.id, { maxTransfers: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Max Amount per Window</Label>
                <Input
                  type="number"
                  value={module.config.maxAmount}
                  onChange={(e) => updateModuleConfig(module.id, { maxAmount: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Cooldown Period (hours)</Label>
                <Input
                  type="number"
                  value={module.config.cooldownPeriod}
                  onChange={(e) => updateModuleConfig(module.id, { cooldownPeriod: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )

      case "transfer-fees":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fee Percentage (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={module.config.feePercentage}
                  onChange={(e) => updateModuleConfig(module.id, { feePercentage: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Flat Fee (tokens)</Label>
                <Input
                  type="number"
                  value={module.config.flatFee}
                  onChange={(e) => updateModuleConfig(module.id, { flatFee: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Fee Collector Address</Label>
              <Input
                value={module.config.collectorAddress}
                onChange={(e) => updateModuleConfig(module.id, { collectorAddress: e.target.value })}
              />
            </div>
            <div>
              <Label>Minimum Transfer Amount</Label>
              <Input
                type="number"
                value={module.config.minimumTransfer}
                onChange={(e) => updateModuleConfig(module.id, { minimumTransfer: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Configuration panel for {module.name} is not yet implemented.
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Modules</p>
                <p className="text-2xl font-bold">{modules.filter((m) => m.enabled).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Blocked Transfers (24h)</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Compliance Score</p>
                <p className="text-2xl font-bold text-green-600">99.8%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Fees Collected</p>
                <p className="text-2xl font-bold text-blue-600">$12.4K</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">Compliance Modules</TabsTrigger>
          <TabsTrigger value="testing">Transfer Testing</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          {/* Module Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Card
                key={module.id}
                className={`${module.enabled ? "border-green-200 dark:border-green-800" : "border-gray-200 dark:border-gray-700"}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getModuleIcon(module)}
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(module.category)}>{module.category}</Badge>
                          <Badge variant={module.enabled ? "default" : "secondary"}>
                            {module.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Switch checked={module.enabled} onCheckedChange={() => toggleModule(module.id)} />
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-xs text-slate-500">
                      Last updated: {module.lastUpdated} by {module.updatedBy}
                    </div>

                    {module.enabled && (
                      <div className="space-y-3">
                        <Separator />
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Configuration</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              {selectedModule === module.id ? "Hide" : "Configure"}
                            </Button>
                          </div>

                          {selectedModule === module.id && (
                            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
                              {renderModuleConfig(module)}
                              <div className="flex gap-2 mt-4">
                                <Button size="sm">
                                  <Save className="h-4 w-4 mr-1" />
                                  Save Changes
                                </Button>
                                <Button variant="outline" size="sm">
                                  Reset to Default
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Transfer Compliance Testing
              </CardTitle>
              <CardDescription>Test how compliance modules would affect a specific transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Address</Label>
                  <Input
                    placeholder="0x..."
                    value={testTransfer.from}
                    onChange={(e) => setTestTransfer({ ...testTransfer, from: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>From Country</Label>
                  <Input
                    placeholder="US"
                    value={testTransfer.fromCountry}
                    onChange={(e) => setTestTransfer({ ...testTransfer, fromCountry: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To Address</Label>
                  <Input
                    placeholder="0x..."
                    value={testTransfer.to}
                    onChange={(e) => setTestTransfer({ ...testTransfer, to: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To Country</Label>
                  <Input
                    placeholder="CA"
                    value={testTransfer.toCountry}
                    onChange={(e) => setTestTransfer({ ...testTransfer, toCountry: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Transfer Amount</Label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={testTransfer.amount}
                    onChange={(e) => setTestTransfer({ ...testTransfer, amount: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={simulateTransfer} className="w-full">
                <TestTube className="h-4 w-4 mr-2" />
                Test Transfer
              </Button>

              {testResult && (
                <div className="space-y-4">
                  <Alert
                    className={
                      testResult.allowed
                        ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                        : "border-red-200 bg-red-50 dark:bg-red-900/20"
                    }
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Transfer {testResult.allowed ? "ALLOWED" : "BLOCKED"}</strong>
                      {!testResult.allowed && " - One or more compliance modules blocked this transfer"}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <h4 className="font-medium">Module Results:</h4>
                    {testResult.results.map((result: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{result.module}</span>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{result.reason}</p>
                        </div>
                        <Badge variant={result.status === "PASSED" ? "default" : "destructive"}>{result.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Activity Logs</CardTitle>
              <CardDescription>Complete audit trail of module changes and enforcement actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Updated By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moduleLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.moduleName}</TableCell>
                      <TableCell>
                        <Badge variant={log.action.includes("Blocked") ? "destructive" : "default"}>{log.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {log.reason && <div className="font-medium">{log.reason}</div>}
                          <pre className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {JSON.stringify(log.parameters, null, 2)}
                          </pre>
                        </div>
                      </TableCell>
                      <TableCell>{log.updatedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
