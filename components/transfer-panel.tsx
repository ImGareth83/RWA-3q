"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight,
  Send,
  CheckCircle,
  XCircle,
  Search,
  CalendarIcon,
  RefreshCw,
  Eye,
  Download,
  User,
  Shield,
} from "lucide-react"
import { format } from "date-fns"

interface Investor {
  walletAddress: string
  onchainId: string
  name: string
  country: string
  investorType: string
  kycStatus: string
  tokenBalance: number
  lastActivity: string
}

interface TransferLog {
  id: string
  txHash: string
  from: string
  fromName: string
  to: string
  toName: string
  amount: number
  tokenSymbol: string
  status: "Success" | "Failed"
  failureReason?: string
  complianceChecks: {
    module: string
    status: "Passed" | "Failed"
    reason: string
  }[]
  memo?: string
  timestamp: string
  executedBy: string
  gasUsed?: number
  blockNumber?: number
}

interface ComplianceResult {
  allowed: boolean
  results: {
    module: string
    status: "Passed" | "Failed"
    reason: string
  }[]
}

export default function TransferPanel() {
  const [sourceAddress, setSourceAddress] = useState("")
  const [destinationAddress, setDestinationAddress] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [memo, setMemo] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferResult, setTransferResult] = useState<any>(null)

  // Investor data
  const [sourceInvestor, setSourceInvestor] = useState<Investor | null>(null)
  const [destinationInvestor, setDestinationInvestor] = useState<Investor | null>(null)

  // Transaction log filters
  const [logFilters, setLogFilters] = useState({
    walletAddress: "",
    status: "all",
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  })

  // Mock investor database
  const investors: Investor[] = [
    {
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      onchainId: "0xabcdef1234567890abcdef1234567890abcdef12",
      name: "Institutional Investor A",
      country: "US",
      investorType: "Institutional",
      kycStatus: "Verified",
      tokenBalance: 1000000,
      lastActivity: "2024-01-15",
    },
    {
      walletAddress: "0x2345678901bcdef12345678901bcdef123456789",
      onchainId: "0xbcdef12345678901bcdef12345678901bcdef123",
      name: "Pension Fund XYZ",
      country: "CA",
      investorType: "Pension Fund",
      kycStatus: "Verified",
      tokenBalance: 2500000,
      lastActivity: "2024-01-14",
    },
    {
      walletAddress: "0x3456789012cdef123456789012cdef1234567890",
      onchainId: "0xcdef123456789012cdef123456789012cdef1234",
      name: "Hedge Fund Alpha",
      country: "GB",
      investorType: "Hedge Fund",
      kycStatus: "Verified",
      tokenBalance: 750000,
      lastActivity: "2024-01-13",
    },
    {
      walletAddress: "0x456789013def1234567890123def12345678901",
      onchainId: "0xdef1234567890123def1234567890123def12345",
      name: "Family Office Beta",
      country: "SG",
      investorType: "Family Office",
      kycStatus: "Verified",
      tokenBalance: 500000,
      lastActivity: "2024-01-12",
    },
  ]

  // Mock transaction logs
  const [transactionLogs, setTransactionLogs] = useState<TransferLog[]>([
    {
      id: "TXN-001",
      txHash: "0xabcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd123456",
      from: "0x1234567890abcdef1234567890abcdef12345678",
      fromName: "Institutional Investor A",
      to: "0x2345678901bcdef12345678901bcdef123456789",
      toName: "Pension Fund XYZ",
      amount: 500000,
      tokenSymbol: "MMFA",
      status: "Success",
      complianceChecks: [
        { module: "CountryAllowModule", status: "Passed", reason: "Both countries are allowed" },
        { module: "MaxBalanceModule", status: "Passed", reason: "Transfer within balance limits" },
        { module: "TransferRestrictModule", status: "Passed", reason: "Both addresses are whitelisted" },
        { module: "TransferFeesModule", status: "Passed", reason: "Fee of 500 tokens collected" },
      ],
      memo: "Quarterly investment allocation",
      timestamp: "2024-01-15 14:30:00",
      executedBy: "admin@company.com",
      gasUsed: 85000,
      blockNumber: 18234567,
    },
    {
      id: "TXN-002",
      txHash: null,
      from: "0x3456789012cdef123456789012cdef1234567890",
      fromName: "Hedge Fund Alpha",
      to: "0x7890123456789012345678901234567890123456",
      toName: "Unknown Recipient",
      amount: 250000,
      tokenSymbol: "MMFA",
      status: "Failed",
      failureReason: "Recipient not on whitelist",
      complianceChecks: [
        { module: "CountryAllowModule", status: "Passed", reason: "Country is allowed" },
        { module: "MaxBalanceModule", status: "Passed", reason: "Transfer within balance limits" },
        { module: "TransferRestrictModule", status: "Failed", reason: "Recipient address not whitelisted" },
      ],
      memo: "Investment rebalancing",
      timestamp: "2024-01-15 13:15:00",
      executedBy: "admin@company.com",
    },
    {
      id: "TXN-003",
      txHash: "0xef123456789012ef123456789012ef123456789012ef123456789012ef123456",
      from: "0x456789013def1234567890123def12345678901",
      fromName: "Family Office Beta",
      to: "0x1234567890abcdef1234567890abcdef12345678",
      toName: "Institutional Investor A",
      amount: 100000,
      tokenSymbol: "MMFA",
      status: "Success",
      complianceChecks: [
        { module: "CountryAllowModule", status: "Passed", reason: "Both countries are allowed" },
        { module: "MaxBalanceModule", status: "Passed", reason: "Transfer within balance limits" },
        { module: "TransferRestrictModule", status: "Passed", reason: "Both addresses are whitelisted" },
        { module: "TransferFeesModule", status: "Passed", reason: "Fee of 100 tokens collected" },
      ],
      timestamp: "2024-01-15 11:45:00",
      executedBy: "admin@company.com",
      gasUsed: 82000,
      blockNumber: 18234520,
    },
  ])

  // Load investor data when addresses change
  useEffect(() => {
    if (sourceAddress) {
      const investor = investors.find((inv) => inv.walletAddress.toLowerCase() === sourceAddress.toLowerCase())
      setSourceInvestor(investor || null)
    } else {
      setSourceInvestor(null)
    }
  }, [sourceAddress])

  useEffect(() => {
    if (destinationAddress) {
      const investor = investors.find((inv) => inv.walletAddress.toLowerCase() === destinationAddress.toLowerCase())
      setDestinationInvestor(investor || null)
    } else {
      setDestinationInvestor(null)
    }
  }, [destinationAddress])

  // Mock compliance validation
  const validateCompliance = async (from: string, to: string, amount: number): Promise<ComplianceResult> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const results = []
    let allowed = true

    // Country Allow Module
    const fromInvestor = investors.find((inv) => inv.walletAddress.toLowerCase() === from.toLowerCase())
    const toInvestor = investors.find((inv) => inv.walletAddress.toLowerCase() === to.toLowerCase())

    if (fromInvestor && toInvestor) {
      const allowedCountries = ["US", "CA", "GB", "DE", "SG", "AU"]
      if (allowedCountries.includes(fromInvestor.country) && allowedCountries.includes(toInvestor.country)) {
        results.push({
          module: "CountryAllowModule",
          status: "Passed" as const,
          reason: "Both countries are in allowed list",
        })
      } else {
        results.push({
          module: "CountryAllowModule",
          status: "Failed" as const,
          reason: `Country restriction: ${!allowedCountries.includes(fromInvestor.country) ? fromInvestor.country : toInvestor.country} not allowed`,
        })
        allowed = false
      }

      // Max Balance Module
      const maxBalance = 2000000
      if (toInvestor.tokenBalance + amount <= maxBalance) {
        results.push({
          module: "MaxBalanceModule",
          status: "Passed" as const,
          reason: "Transfer within balance limits",
        })
      } else {
        results.push({
          module: "MaxBalanceModule",
          status: "Failed" as const,
          reason: `Transfer would exceed max balance (${maxBalance.toLocaleString()})`,
        })
        allowed = false
      }

      // Transfer Restrict Module (whitelist)
      const whitelistedAddresses = investors.map((inv) => inv.walletAddress.toLowerCase())
      if (whitelistedAddresses.includes(from.toLowerCase()) && whitelistedAddresses.includes(to.toLowerCase())) {
        results.push({
          module: "TransferRestrictModule",
          status: "Passed" as const,
          reason: "Both addresses are whitelisted",
        })
      } else {
        results.push({
          module: "TransferRestrictModule",
          status: "Failed" as const,
          reason: "One or both addresses not on whitelist",
        })
        allowed = false
      }

      // Transfer Fees Module
      const feePercentage = 0.1
      const fee = amount * (feePercentage / 100)
      results.push({
        module: "TransferFeesModule",
        status: "Passed" as const,
        reason: `Fee of ${fee.toLocaleString()} tokens will be collected`,
      })
    } else {
      results.push({
        module: "InvestorValidation",
        status: "Failed" as const,
        reason: "One or both addresses not found in investor registry",
      })
      allowed = false
    }

    return { allowed, results }
  }

  // Execute transfer
  const executeTransfer = async () => {
    if (!sourceInvestor || !destinationInvestor || !transferAmount) return

    setIsTransferring(true)
    setTransferResult(null)

    try {
      // Step 1: Validate compliance
      const complianceResult = await validateCompliance(
        sourceAddress,
        destinationAddress,
        Number.parseFloat(transferAmount),
      )

      if (complianceResult.allowed) {
        // Step 2: Execute transfer (simulate blockchain transaction)
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Step 3: Update balances
        const amount = Number.parseFloat(transferAmount)
        const fee = amount * 0.001 // 0.1% fee
        const netAmount = amount - fee

        // Create successful transaction log
        const newLog: TransferLog = {
          id: `TXN-${Date.now()}`,
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          from: sourceAddress,
          fromName: sourceInvestor.name,
          to: destinationAddress,
          toName: destinationInvestor.name,
          amount: amount,
          tokenSymbol: "MMFA",
          status: "Success",
          complianceChecks: complianceResult.results,
          memo: memo || undefined,
          timestamp: new Date().toISOString().replace("T", " ").substr(0, 19),
          executedBy: "current.admin@company.com",
          gasUsed: Math.floor(Math.random() * 20000) + 70000,
          blockNumber: 18234567 + Math.floor(Math.random() * 100),
        }

        setTransactionLogs([newLog, ...transactionLogs])
        setTransferResult({ success: true, txHash: newLog.txHash, fee })

        // Reset form
        setSourceAddress("")
        setDestinationAddress("")
        setTransferAmount("")
        setMemo("")
      } else {
        // Create failed transaction log
        const failureReason =
          complianceResult.results.find((r) => r.status === "Failed")?.reason || "Compliance check failed"

        const newLog: TransferLog = {
          id: `TXN-${Date.now()}`,
          txHash: null,
          from: sourceAddress,
          fromName: sourceInvestor.name,
          to: destinationAddress,
          toName: destinationInvestor.name,
          amount: Number.parseFloat(transferAmount),
          tokenSymbol: "MMFA",
          status: "Failed",
          failureReason,
          complianceChecks: complianceResult.results,
          memo: memo || undefined,
          timestamp: new Date().toISOString().replace("T", " ").substr(0, 19),
          executedBy: "current.admin@company.com",
        }

        setTransactionLogs([newLog, ...transactionLogs])
        setTransferResult({ success: false, reason: failureReason, checks: complianceResult.results })
      }
    } catch (error) {
      console.error("Transfer error:", error)
      setTransferResult({ success: false, reason: "System error occurred" })
    } finally {
      setIsTransferring(false)
    }
  }

  // Filter transaction logs
  const filteredLogs = transactionLogs.filter((log) => {
    const matchesAddress =
      !logFilters.walletAddress ||
      log.from.toLowerCase().includes(logFilters.walletAddress.toLowerCase()) ||
      log.to.toLowerCase().includes(logFilters.walletAddress.toLowerCase()) ||
      log.fromName.toLowerCase().includes(logFilters.walletAddress.toLowerCase()) ||
      log.toName.toLowerCase().includes(logFilters.walletAddress.toLowerCase())

    const matchesStatus = logFilters.status === "all" || log.status.toLowerCase() === logFilters.status

    const logDate = new Date(log.timestamp)
    const matchesDateFrom = !logFilters.dateFrom || logDate >= logFilters.dateFrom
    const matchesDateTo = !logFilters.dateTo || logDate <= logFilters.dateTo

    return matchesAddress && matchesStatus && matchesDateFrom && matchesDateTo
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        )
      case "Failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ["Timestamp", "From", "To", "Amount", "Status", "Failure Reason", "Tx Hash"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          `"${log.fromName} (${log.from})"`,
          `"${log.toName} (${log.to})"`,
          log.amount,
          log.status,
          log.failureReason || "",
          log.txHash || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transfer-logs-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Transfer Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Execute Token Transfer
          </CardTitle>
          <CardDescription>Transfer tokens between verified investors with compliance validation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Investor Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Investor */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sourceAddress">Source Wallet Address</Label>
                <Input
                  id="sourceAddress"
                  placeholder="0x..."
                  value={sourceAddress}
                  onChange={(e) => setSourceAddress(e.target.value)}
                />
              </div>

              {sourceInvestor && (
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{sourceInvestor.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Source Investor</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Balance:</span>
                        <span className="font-medium">{sourceInvestor.tokenBalance.toLocaleString()} MMFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Country:</span>
                        <span>{sourceInvestor.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span>{sourceInvestor.investorType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>KYC Status:</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {sourceInvestor.kycStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Destination Investor */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destinationAddress">Destination Wallet Address</Label>
                <Input
                  id="destinationAddress"
                  placeholder="0x..."
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                />
              </div>

              {destinationInvestor && (
                <Card className="border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-medium">{destinationInvestor.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Destination Investor</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Balance:</span>
                        <span className="font-medium">{destinationInvestor.tokenBalance.toLocaleString()} MMFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Country:</span>
                        <span>{destinationInvestor.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span>{destinationInvestor.investorType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>KYC Status:</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {destinationInvestor.kycStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Transfer Details */}
          {sourceInvestor && destinationInvestor && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transferAmount">Transfer Amount (MMFA)</Label>
                    <Input
                      id="transferAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      max={sourceInvestor.tokenBalance}
                    />
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Available: {sourceInvestor.tokenBalance.toLocaleString()} MMFA
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memo">Memo (Optional)</Label>
                    <Input
                      id="memo"
                      placeholder="Transfer reference or note"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Transfer Preview */}
                {transferAmount && (
                  <Card className="bg-slate-50 dark:bg-slate-800">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Transfer Preview</h4>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-center">
                          <div className="font-medium">{sourceInvestor.name}</div>
                          <div className="text-slate-600 dark:text-slate-400">
                            {sourceInvestor.tokenBalance.toLocaleString()} MMFA
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          <div className="text-center">
                            <div className="font-medium">{Number.parseFloat(transferAmount).toLocaleString()} MMFA</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">+ 0.1% fee</div>
                          </div>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{destinationInvestor.name}</div>
                          <div className="text-slate-600 dark:text-slate-400">
                            {(
                              destinationInvestor.tokenBalance + Number.parseFloat(transferAmount || "0")
                            ).toLocaleString()}{" "}
                            MMFA
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={executeTransfer}
                  disabled={!transferAmount || isTransferring || Number.parseFloat(transferAmount) <= 0}
                  className="w-full"
                  size="lg"
                >
                  {isTransferring ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Validating & Executing Transfer...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Transfer Tokens
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* Transfer Result */}
          {transferResult && (
            <Alert
              className={
                transferResult.success
                  ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                  : "border-red-200 bg-red-50 dark:bg-red-900/20"
              }
            >
              {transferResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertDescription>
                {transferResult.success ? (
                  <div>
                    <strong>Transfer Successful!</strong>
                    <div className="mt-2 text-sm">
                      <div>Transaction Hash: {transferResult.txHash}</div>
                      <div>Fee Collected: {transferResult.fee?.toLocaleString()} MMFA</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <strong>Transfer Failed</strong>
                    <div className="mt-2 text-sm">
                      <div>Reason: {transferResult.reason}</div>
                      {transferResult.checks && (
                        <div className="mt-2">
                          <strong>Compliance Check Results:</strong>
                          {transferResult.checks.map((check: any, index: number) => (
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
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Transaction Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Transfer Transaction Log
            </div>
            <Button variant="outline" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
          <CardDescription>
            Complete audit trail of all token transfers with compliance validation results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by wallet address or investor name..."
                  value={logFilters.walletAddress}
                  onChange={(e) => setLogFilters({ ...logFilters, walletAddress: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={logFilters.status}
              onValueChange={(value) => setLogFilters({ ...logFilters, status: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
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

          {/* Transaction Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>From → To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Tx Hash</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <div className="font-medium">{log.fromName}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">{log.from}</div>
                        </div>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                        <div className="text-sm">
                          <div className="font-medium">{log.toName}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">{log.to}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.amount.toLocaleString()}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">{log.tokenSymbol}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {log.complianceChecks.map((check, index) => (
                          <div key={index} className="flex items-center gap-1">
                            {check.status === "Passed" ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span className="text-xs">{check.module}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.txHash ? (
                        <div className="text-xs font-mono">{log.txHash.substring(0, 10)}...</div>
                      ) : (
                        <span className="text-xs text-slate-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              No transactions found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
