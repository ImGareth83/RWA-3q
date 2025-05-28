"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Coins,
  Plus,
  Minus,
  ArrowLeftRight,
  TrendingUp,
  Search,
  CalendarIcon,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Copy,
  Download,
} from "lucide-react"
import { format } from "date-fns"

interface Token {
  symbol: string
  name: string
  contractAddress: string
  totalSupply: number
  currentNAV?: number
  navMethod?: string
  assetType: string
  decimals: number
  holders: number
  status: "Active" | "Paused"
  complianceModules: string[]
}

interface ActionLog {
  id: string
  tokenSymbol: string
  contractAddress: string
  actionType: "Mint" | "Burn" | "Transfer" | "NAV Update"
  fromWallet?: string
  toWallet?: string
  amount?: number
  newNAV?: number
  reason?: string
  executedBy: string
  timestamp: string
  status: "Success" | "Failed"
  complianceResult?: {
    allowed: boolean
    checks: { module: string; status: string; reason: string }[]
  }
  txHash?: string
  gasUsed?: number
}

export default function TokenLifecycle() {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [activeTab, setActiveTab] = useState("mint")
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionResult, setActionResult] = useState<any>(null)

  // Form states
  const [mintForm, setMintForm] = useState({
    recipientWallet: "",
    amount: "",
    reason: "",
  })

  const [burnForm, setBurnForm] = useState({
    walletAddress: "",
    amount: "",
    reason: "",
  })

  const [transferForm, setTransferForm] = useState({
    fromWallet: "",
    toWallet: "",
    amount: "",
    reason: "",
  })

  const [navForm, setNavForm] = useState({
    newNAV: "",
    effectiveDate: new Date(),
    comments: "",
  })

  // Filter states
  const [logFilters, setLogFilters] = useState({
    actionType: "all",
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    searchTerm: "",
  })

  // Balance query states
  const [walletBalances, setWalletBalances] = useState<{
    [key: string]: { balance: number; loading: boolean; error?: string }
  }>({})

  // Mock balance query function
  const queryWalletBalance = async (walletAddress: string, tokenSymbol: string) => {
    if (!walletAddress || walletAddress.length < 10) return null

    const balanceKey = `${walletAddress}-${tokenSymbol}`

    // Set loading state
    setWalletBalances((prev) => ({
      ...prev,
      [balanceKey]: { balance: 0, loading: true },
    }))

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock balance data - simulate realistic balances
      const mockBalance = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 100000)

      setWalletBalances((prev) => ({
        ...prev,
        [balanceKey]: { balance: mockBalance, loading: false },
      }))
    } catch (error) {
      setWalletBalances((prev) => ({
        ...prev,
        [balanceKey]: { balance: 0, loading: false, error: "Failed to query balance" },
      }))
    }
  }

  // Helper function to get balance display
  const getBalanceDisplay = (walletAddress: string, tokenSymbol: string) => {
    if (!walletAddress || !tokenSymbol) return null
    const balanceKey = `${walletAddress}-${tokenSymbol}`
    const balanceData = walletBalances[balanceKey]

    if (!balanceData) return null

    if (balanceData.loading) {
      return (
        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Querying balance...
        </div>
      )
    }

    if (balanceData.error) {
      return <div className="text-xs text-red-600 dark:text-red-400">{balanceData.error}</div>
    }

    return (
      <div className="text-xs text-slate-600 dark:text-slate-400">
        Balance: {balanceData.balance.toLocaleString()} {tokenSymbol}
      </div>
    )
  }

  // Mock data
  const [tokens] = useState<Token[]>([
    {
      symbol: "MMFA",
      name: "Money Market Fund Alpha",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      totalSupply: 100000000,
      currentNAV: 1.0023,
      navMethod: "daily",
      assetType: "money-market",
      decimals: 18,
      holders: 856,
      status: "Active",
      complianceModules: ["CountryAllow", "MaxBalance", "TransferRestrict"],
    },
    {
      symbol: "TBF",
      name: "Treasury Bond Fund",
      contractAddress: "0x2345678901bcdef12345678901bcdef123456789",
      totalSupply: 50000000,
      currentNAV: 1.0156,
      navMethod: "weekly",
      assetType: "treasury",
      decimals: 18,
      holders: 234,
      status: "Active",
      complianceModules: ["CountryAllow", "TransferFees"],
    },
    {
      symbol: "CBF",
      name: "Corporate Bond Fund",
      contractAddress: "0x3456789012cdef123456789012cdef1234567890",
      totalSupply: 75000000,
      currentNAV: 0.9987,
      navMethod: "monthly",
      assetType: "corporate-bond",
      decimals: 18,
      holders: 157,
      status: "Paused",
      complianceModules: ["CountryRestrict", "MaxBalance"],
    },
  ])

  const [actionLogs, setActionLogs] = useState<ActionLog[]>([
    {
      id: "ACT-001",
      tokenSymbol: "MMFA",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      actionType: "Mint",
      toWallet: "0x9876543210fedcba9876543210fedcba98765432",
      amount: 1000000,
      reason: "Initial allocation to institutional investor",
      executedBy: "issuer.admin@company.com",
      timestamp: "2024-01-15 14:30:00",
      status: "Success",
      txHash: "0xabcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd123456",
      gasUsed: 85000,
    },
    {
      id: "ACT-002",
      tokenSymbol: "MMFA",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      actionType: "Transfer",
      fromWallet: "0x1111111111111111111111111111111111111111",
      toWallet: "0x2222222222222222222222222222222222222222",
      amount: 500000,
      reason: "Administrative rebalancing",
      executedBy: "issuer.admin@company.com",
      timestamp: "2024-01-15 13:15:00",
      status: "Success",
      complianceResult: {
        allowed: true,
        checks: [
          { module: "CountryAllow", status: "Passed", reason: "Both countries allowed" },
          { module: "MaxBalance", status: "Passed", reason: "Within balance limits" },
          { module: "TransferRestrict", status: "Passed", reason: "Both addresses whitelisted" },
        ],
      },
      txHash: "0xdef0123456789012def0123456789012def0123456789012def0123456789012",
      gasUsed: 92000,
    },
    {
      id: "ACT-003",
      tokenSymbol: "MMFA",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      actionType: "NAV Update",
      newNAV: 1.0023,
      reason: "Daily NAV calculation",
      executedBy: "nav.oracle@company.com",
      timestamp: "2024-01-15 12:00:00",
      status: "Success",
      txHash: "0xf012345678901234f012345678901234f012345678901234f012345678901234",
      gasUsed: 45000,
    },
    {
      id: "ACT-004",
      tokenSymbol: "TBF",
      contractAddress: "0x2345678901bcdef12345678901bcdef123456789",
      actionType: "Burn",
      fromWallet: "0x3333333333333333333333333333333333333333",
      amount: 250000,
      reason: "Redemption request",
      executedBy: "issuer.admin@company.com",
      timestamp: "2024-01-15 11:30:00",
      status: "Success",
      txHash: "0x0123456789012345012345678901234501234567890123450123456789012345",
      gasUsed: 78000,
    },
    {
      id: "ACT-005",
      tokenSymbol: "MMFA",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      actionType: "Transfer",
      fromWallet: "0x4444444444444444444444444444444444444444",
      toWallet: "0x5555555555555555555555555555555555555555",
      amount: 750000,
      reason: "Portfolio reallocation",
      executedBy: "issuer.admin@company.com",
      timestamp: "2024-01-15 10:45:00",
      status: "Failed",
      complianceResult: {
        allowed: false,
        checks: [
          { module: "CountryAllow", status: "Passed", reason: "Both countries allowed" },
          { module: "MaxBalance", status: "Failed", reason: "Would exceed maximum balance limit" },
        ],
      },
    },
  ])

  // Mock compliance validation
  const validateCompliance = async (action: string, params: any) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate compliance checks
    const checks = []
    let allowed = true

    if (selectedToken?.complianceModules.includes("CountryAllow")) {
      checks.push({
        module: "CountryAllow",
        status: "Passed",
        reason: "Addresses in allowed jurisdictions",
      })
    }

    if (selectedToken?.complianceModules.includes("MaxBalance")) {
      const wouldExceed = Math.random() < 0.2 // 20% chance of exceeding
      if (wouldExceed) {
        checks.push({
          module: "MaxBalance",
          status: "Failed",
          reason: "Transfer would exceed maximum balance limit",
        })
        allowed = false
      } else {
        checks.push({
          module: "MaxBalance",
          status: "Passed",
          reason: "Transfer within balance limits",
        })
      }
    }

    if (selectedToken?.complianceModules.includes("TransferRestrict")) {
      checks.push({
        module: "TransferRestrict",
        status: "Passed",
        reason: "Both addresses are whitelisted",
      })
    }

    return { allowed, checks }
  }

  // Action handlers
  const handleMint = async () => {
    if (!selectedToken || !mintForm.recipientWallet || !mintForm.amount) return

    setIsProcessing(true)
    setActionResult(null)

    try {
      // Simulate minting process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newLog: ActionLog = {
        id: `ACT-${Date.now()}`,
        tokenSymbol: selectedToken.symbol,
        contractAddress: selectedToken.contractAddress,
        actionType: "Mint",
        toWallet: mintForm.recipientWallet,
        amount: Number.parseFloat(mintForm.amount),
        reason: mintForm.reason || undefined,
        executedBy: "current.admin@company.com",
        timestamp: new Date().toISOString().replace("T", " ").substr(0, 19),
        status: "Success",
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        gasUsed: Math.floor(Math.random() * 50000) + 70000,
      }

      setActionLogs([newLog, ...actionLogs])
      setActionResult({ success: true, action: "Mint", txHash: newLog.txHash })
      setMintForm({ recipientWallet: "", amount: "", reason: "" })
    } catch (error) {
      setActionResult({ success: false, action: "Mint", error: "Minting failed" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBurn = async () => {
    if (!selectedToken || !burnForm.walletAddress || !burnForm.amount) return

    setIsProcessing(true)
    setActionResult(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newLog: ActionLog = {
        id: `ACT-${Date.now()}`,
        tokenSymbol: selectedToken.symbol,
        contractAddress: selectedToken.contractAddress,
        actionType: "Burn",
        fromWallet: burnForm.walletAddress,
        amount: Number.parseFloat(burnForm.amount),
        reason: burnForm.reason || undefined,
        executedBy: "current.admin@company.com",
        timestamp: new Date().toISOString().replace("T", " ").substr(0, 19),
        status: "Success",
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        gasUsed: Math.floor(Math.random() * 40000) + 60000,
      }

      setActionLogs([newLog, ...actionLogs])
      setActionResult({ success: true, action: "Burn", txHash: newLog.txHash })
      setBurnForm({ walletAddress: "", amount: "", reason: "" })
    } catch (error) {
      setActionResult({ success: false, action: "Burn", error: "Burning failed" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTransfer = async () => {
    if (!selectedToken || !transferForm.fromWallet || !transferForm.toWallet || !transferForm.amount) return

    setIsProcessing(true)
    setActionResult(null)

    try {
      // Validate compliance
      const complianceResult = await validateCompliance("transfer", transferForm)

      if (complianceResult.allowed) {
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const newLog: ActionLog = {
          id: `ACT-${Date.now()}`,
          tokenSymbol: selectedToken.symbol,
          contractAddress: selectedToken.contractAddress,
          actionType: "Transfer",
          fromWallet: transferForm.fromWallet,
          toWallet: transferForm.toWallet,
          amount: Number.parseFloat(transferForm.amount),
          reason: transferForm.reason || undefined,
          executedBy: "current.admin@company.com",
          timestamp: new Date().toISOString().replace("T", " ").substr(0, 19),
          status: "Success",
          complianceResult,
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          gasUsed: Math.floor(Math.random() * 60000) + 80000,
        }

        setActionLogs([newLog, ...actionLogs])
        setActionResult({ success: true, action: "Transfer", txHash: newLog.txHash })
        setTransferForm({ fromWallet: "", toWallet: "", amount: "", reason: "" })
      } else {
        const newLog: ActionLog = {
          id: `ACT-${Date.now()}`,
          tokenSymbol: selectedToken.symbol,
          contractAddress: selectedToken.contractAddress,
          actionType: "Transfer",
          fromWallet: transferForm.fromWallet,
          toWallet: transferForm.toWallet,
          amount: Number.parseFloat(transferForm.amount),
          reason: transferForm.reason || undefined,
          executedBy: "current.admin@company.com",
          timestamp: new Date().toISOString().replace("T", " ").substr(0, 19),
          status: "Failed",
          complianceResult,
        }

        setActionLogs([newLog, ...actionLogs])
        setActionResult({
          success: false,
          action: "Transfer",
          error: "Compliance check failed",
          complianceResult,
        })
      }
    } catch (error) {
      setActionResult({ success: false, action: "Transfer", error: "Transfer failed" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNAVUpdate = async () => {
    if (!selectedToken || !navForm.newNAV) return

    setIsProcessing(true)
    setActionResult(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newLog: ActionLog = {
        id: `ACT-${Date.now()}`,
        tokenSymbol: selectedToken.symbol,
        contractAddress: selectedToken.contractAddress,
        actionType: "NAV Update",
        newNAV: Number.parseFloat(navForm.newNAV),
        reason: navForm.comments || undefined,
        executedBy: "current.admin@company.com",
        timestamp: new Date().toISOString().replace("T", " ").substr(0, 19),
        status: "Success",
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        gasUsed: Math.floor(Math.random() * 30000) + 40000,
      }

      setActionLogs([newLog, ...actionLogs])
      setActionResult({ success: true, action: "NAV Update", txHash: newLog.txHash })
      setNavForm({ newNAV: "", effectiveDate: new Date(), comments: "" })
    } catch (error) {
      setActionResult({ success: false, action: "NAV Update", error: "NAV update failed" })
    } finally {
      setIsProcessing(false)
    }
  }

  // Filter logs
  const filteredLogs = actionLogs.filter((log) => {
    if (!selectedToken) return false

    const matchesToken = log.tokenSymbol === selectedToken.symbol
    const matchesActionType = logFilters.actionType === "all" || log.actionType === logFilters.actionType
    const matchesSearch =
      !logFilters.searchTerm ||
      log.toWallet?.toLowerCase().includes(logFilters.searchTerm.toLowerCase()) ||
      log.fromWallet?.toLowerCase().includes(logFilters.searchTerm.toLowerCase()) ||
      log.reason?.toLowerCase().includes(logFilters.searchTerm.toLowerCase())

    const logDate = new Date(log.timestamp)
    const matchesDateFrom = !logFilters.dateFrom || logDate >= logFilters.dateFrom
    const matchesDateTo = !logFilters.dateTo || logDate <= logFilters.dateTo

    return matchesToken && matchesActionType && matchesSearch && matchesDateFrom && matchesDateTo
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportLogs = () => {
    const csvContent = [
      ["Timestamp", "Action", "From", "To", "Amount", "Status", "Tx Hash"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          log.actionType,
          log.fromWallet || "",
          log.toWallet || "",
          log.amount || log.newNAV || "",
          log.status,
          log.txHash || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedToken?.symbol}-lifecycle-logs-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Token Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Lifecycle Management
          </CardTitle>
          <CardDescription>
            Manage minting, burning, transfers, and NAV updates for your deployed tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Token</Label>
              <Select
                value={selectedToken?.symbol || ""}
                onValueChange={(value) => {
                  const token = tokens.find((t) => t.symbol === value)
                  setSelectedToken(token || null)
                  setActionResult(null)
                  // Clear all balance queries when token changes
                  setWalletBalances({})
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a token to manage" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">- {token.name}</span>
                        <Badge variant={token.status === "Active" ? "default" : "secondary"}>{token.status}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedToken && (
              <Card className="bg-slate-50 dark:bg-slate-800">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{selectedToken.name}</div>
                      <div className="text-slate-600 dark:text-slate-400">Symbol: {selectedToken.symbol}</div>
                      <div className="text-slate-600 dark:text-slate-400">
                        Contract: {selectedToken.contractAddress.substring(0, 10)}...
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Supply: {selectedToken.totalSupply.toLocaleString()}</div>
                      <div className="text-slate-600 dark:text-slate-400">Holders: {selectedToken.holders}</div>
                      <div className="text-slate-600 dark:text-slate-400">Status: {selectedToken.status}</div>
                    </div>
                    <div>
                      {selectedToken.currentNAV && (
                        <>
                          <div className="font-medium">NAV: ${selectedToken.currentNAV.toFixed(4)}</div>
                          <div className="text-slate-600 dark:text-slate-400">Method: {selectedToken.navMethod}</div>
                        </>
                      )}
                      <div className="text-slate-600 dark:text-slate-400">
                        Modules: {selectedToken.complianceModules.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedToken && (
        <>
          {/* Action Result */}
          {actionResult && (
            <Alert
              className={
                actionResult.success
                  ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                  : "border-red-200 bg-red-50 dark:bg-red-900/20"
              }
            >
              {actionResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertDescription>
                {actionResult.success ? (
                  <div>
                    <strong>{actionResult.action} Successful!</strong>
                    <div className="mt-1 text-sm">Transaction Hash: {actionResult.txHash}</div>
                  </div>
                ) : (
                  <div>
                    <strong>{actionResult.action} Failed</strong>
                    <div className="mt-1 text-sm">{actionResult.error}</div>
                    {actionResult.complianceResult && (
                      <div className="mt-2">
                        <div className="text-sm font-medium">Compliance Check Results:</div>
                        {actionResult.complianceResult.checks.map((check: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 mt-1">
                            {check.status === "Passed" ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span className="text-xs">
                              {check.module}: {check.reason}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="mint" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Mint
              </TabsTrigger>
              <TabsTrigger value="burn" className="flex items-center gap-2">
                <Minus className="h-4 w-4" />
                Burn
              </TabsTrigger>
              <TabsTrigger value="transfer-panel" className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Transfer Panel
              </TabsTrigger>
              <TabsTrigger value="nav" className="flex items-center gap-2" disabled={!selectedToken.currentNAV}>
                <TrendingUp className="h-4 w-4" />
                Update NAV
              </TabsTrigger>
            </TabsList>

            {/* Mint Tab */}
            <TabsContent value="mint">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Mint Tokens
                  </CardTitle>
                  <CardDescription>Create new tokens and assign them to a wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mintRecipient">Recipient Wallet Address *</Label>
                      <Input
                        id="mintRecipient"
                        placeholder="0x..."
                        value={mintForm.recipientWallet}
                        onChange={(e) => {
                          const value = e.target.value
                          setMintForm({ ...mintForm, recipientWallet: value })
                          if (value && selectedToken && value.length >= 10) {
                            queryWalletBalance(value, selectedToken.symbol)
                          }
                        }}
                      />
                      {mintForm.recipientWallet &&
                        selectedToken &&
                        getBalanceDisplay(mintForm.recipientWallet, selectedToken.symbol)}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mintAmount">Amount *</Label>
                      <Input
                        id="mintAmount"
                        type="number"
                        placeholder="Enter amount to mint"
                        value={mintForm.amount}
                        onChange={(e) => setMintForm({ ...mintForm, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mintReason">Reason (Optional)</Label>
                    <Textarea
                      id="mintReason"
                      placeholder="Reason for minting (for audit purposes)"
                      value={mintForm.reason}
                      onChange={(e) => setMintForm({ ...mintForm, reason: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <Button
                    onClick={handleMint}
                    disabled={!mintForm.recipientWallet || !mintForm.amount || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Minting Tokens...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Mint Tokens
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Burn Tab */}
            <TabsContent value="burn">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Minus className="h-5 w-5" />
                    Burn Tokens
                  </CardTitle>
                  <CardDescription>Remove tokens from circulation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="burnWallet">Wallet Address *</Label>
                      <Input
                        id="burnWallet"
                        placeholder="0x..."
                        value={burnForm.walletAddress}
                        onChange={(e) => {
                          const value = e.target.value
                          setBurnForm({ ...burnForm, walletAddress: value })
                          if (value && selectedToken && value.length >= 10) {
                            queryWalletBalance(value, selectedToken.symbol)
                          }
                        }}
                      />
                      {burnForm.walletAddress &&
                        selectedToken &&
                        getBalanceDisplay(burnForm.walletAddress, selectedToken.symbol)}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="burnAmount">Amount *</Label>
                      <Input
                        id="burnAmount"
                        type="number"
                        placeholder="Enter amount to burn"
                        value={burnForm.amount}
                        onChange={(e) => setBurnForm({ ...burnForm, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="burnReason">Reason (Optional)</Label>
                    <Textarea
                      id="burnReason"
                      placeholder="Reason for burning (for audit purposes)"
                      value={burnForm.reason}
                      onChange={(e) => setBurnForm({ ...burnForm, reason: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <Button
                    onClick={handleBurn}
                    disabled={!burnForm.walletAddress || !burnForm.amount || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Burning Tokens...
                      </>
                    ) : (
                      <>
                        <Minus className="h-4 w-4 mr-2" />
                        Burn Tokens
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transfer Tab */}
            <TabsContent value="transfer-panel">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowLeftRight className="h-5 w-5" />
                    Admin Transfer
                  </CardTitle>
                  <CardDescription>Execute administrative transfers with compliance validation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="transferFrom">From Wallet *</Label>
                      <Input
                        id="transferFrom"
                        placeholder="0x..."
                        value={transferForm.fromWallet}
                        onChange={(e) => {
                          const value = e.target.value
                          setTransferForm({ ...transferForm, fromWallet: value })
                          if (value && selectedToken && value.length >= 10) {
                            queryWalletBalance(value, selectedToken.symbol)
                          }
                        }}
                      />
                      {transferForm.fromWallet &&
                        selectedToken &&
                        getBalanceDisplay(transferForm.fromWallet, selectedToken.symbol)}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transferTo">To Wallet *</Label>
                      <Input
                        id="transferTo"
                        placeholder="0x..."
                        value={transferForm.toWallet}
                        onChange={(e) => {
                          const value = e.target.value
                          setTransferForm({ ...transferForm, toWallet: value })
                          if (value && selectedToken && value.length >= 10) {
                            queryWalletBalance(value, selectedToken.symbol)
                          }
                        }}
                      />
                      {transferForm.toWallet &&
                        selectedToken &&
                        getBalanceDisplay(transferForm.toWallet, selectedToken.symbol)}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transferAmount">Amount *</Label>
                      <Input
                        id="transferAmount"
                        type="number"
                        placeholder="Enter amount"
                        value={transferForm.amount}
                        onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transferReason">Reason (Optional)</Label>
                    <Textarea
                      id="transferReason"
                      placeholder="Purpose for admin transfer"
                      value={transferForm.reason}
                      onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Admin transfers will be evaluated against all active compliance modules. The transfer will only
                      execute if all compliance checks pass.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleTransfer}
                    disabled={
                      !transferForm.fromWallet || !transferForm.toWallet || !transferForm.amount || isProcessing
                    }
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Validating & Transferring...
                      </>
                    ) : (
                      <>
                        <ArrowLeftRight className="h-4 w-4 mr-2" />
                        Execute Transfer
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NAV Update Tab */}
            <TabsContent value="nav">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Update NAV
                  </CardTitle>
                  <CardDescription>Update the Net Asset Value for NAV-based tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newNAV">New NAV *</Label>
                      <Input
                        id="newNAV"
                        type="number"
                        step="0.0001"
                        placeholder="1.0000"
                        value={navForm.newNAV}
                        onChange={(e) => setNavForm({ ...navForm, newNAV: e.target.value })}
                      />
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Current NAV: ${selectedToken.currentNAV?.toFixed(4)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Effective Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {navForm.effectiveDate ? format(navForm.effectiveDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={navForm.effectiveDate}
                            onSelect={(date) => setNavForm({ ...navForm, effectiveDate: date || new Date() })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="navComments">Comments (Optional)</Label>
                    <Textarea
                      id="navComments"
                      placeholder="Notes for audit (e.g., valuation methodology, market conditions)"
                      value={navForm.comments}
                      onChange={(e) => setNavForm({ ...navForm, comments: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleNAVUpdate} disabled={!navForm.newNAV || isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Updating NAV...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Update NAV
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Action History - {selectedToken.symbol}
                </div>
                <Button variant="outline" onClick={exportLogs}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardTitle>
              <CardDescription>Complete audit trail of all lifecycle actions for this token</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by wallet address or reason..."
                      value={logFilters.searchTerm}
                      onChange={(e) => setLogFilters({ ...logFilters, searchTerm: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select
                  value={logFilters.actionType}
                  onValueChange={(value) => setLogFilters({ ...logFilters, actionType: value })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Action Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="Mint">Mint</SelectItem>
                    <SelectItem value="Burn">Burn</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="NAV Update">NAV Update</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[150px]">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Date Range
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={{ from: logFilters.dateFrom, to: logFilters.dateTo }}
                      onSelect={(range) =>
                        setLogFilters({
                          ...logFilters,
                          dateFrom: range?.from || null,
                          dateTo: range?.to || null,
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Action Logs Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Amount/NAV</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Executed By</TableHead>
                      <TableHead>Tx Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.actionType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {log.fromWallet && (
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">From:</span>{" "}
                                {log.fromWallet.substring(0, 10)}...
                              </div>
                            )}
                            {log.toWallet && (
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">To:</span>{" "}
                                {log.toWallet.substring(0, 10)}...
                              </div>
                            )}
                            {log.reason && <div className="text-slate-600 dark:text-slate-400">{log.reason}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.amount && (
                            <div>
                              {log.amount.toLocaleString()} {selectedToken.symbol}
                            </div>
                          )}
                          {log.newNAV && <div>${log.newNAV.toFixed(4)}</div>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {log.status === "Success" ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Success
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                <XCircle className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{log.executedBy}</TableCell>
                        <TableCell>
                          {log.txHash ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">{log.txHash.substring(0, 10)}...</span>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.txHash!)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredLogs.length === 0 && (
                <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                  No actions found matching the current filters.
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
