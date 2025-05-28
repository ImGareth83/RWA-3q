"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { FileText, Download, Search, Filter } from "lucide-react"
import { format } from "date-fns"

export default function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: null, to: null })

  const auditEvents = [
    {
      id: "AUD-001",
      timestamp: "2024-01-15 14:30:00",
      eventType: "Token Transfer",
      description: "Transfer of 500,000 MMFA tokens",
      actor: "0x1234...5678",
      actorName: "Institutional Investor A",
      target: "0x9876...5432",
      targetName: "Pension Fund XYZ",
      amount: "500,000 MMFA",
      status: "Completed",
      complianceChecks: ["KYC", "Jurisdiction", "Lock-up", "Volume"],
      txHash: "0xabcd...ef01",
      blockNumber: "18,234,567",
    },
    {
      id: "AUD-002",
      timestamp: "2024-01-15 13:15:00",
      eventType: "Compliance Violation",
      description: "Transfer blocked due to jurisdiction restriction",
      actor: "0x2345...6789",
      actorName: "Hedge Fund Alpha",
      target: "0x8765...4321",
      targetName: "Restricted Entity",
      amount: "250,000 MMFA",
      status: "Blocked",
      complianceChecks: ["KYC", "Jurisdiction"],
      txHash: null,
      blockNumber: null,
    },
    {
      id: "AUD-003",
      timestamp: "2024-01-15 12:00:00",
      eventType: "Token Issuance",
      description: "Minted 1,000,000 new MMFA tokens",
      actor: "0x0000...0001",
      actorName: "Token Issuer Admin",
      target: null,
      targetName: null,
      amount: "1,000,000 MMFA",
      status: "Completed",
      complianceChecks: ["Authorization"],
      txHash: "0xdef0...1234",
      blockNumber: "18,234,500",
    },
    {
      id: "AUD-004",
      timestamp: "2024-01-15 11:30:00",
      eventType: "Identity Verification",
      description: "New investor KYC approved",
      actor: "0x3456...789a",
      actorName: "Family Office Beta",
      target: null,
      targetName: null,
      amount: null,
      status: "Approved",
      complianceChecks: ["KYC", "AML"],
      txHash: null,
      blockNumber: null,
    },
    {
      id: "AUD-005",
      timestamp: "2024-01-15 10:15:00",
      eventType: "Compliance Rule Update",
      description: "Updated jurisdiction restriction module",
      actor: "0x0000...0002",
      actorName: "Compliance Officer",
      target: "jurisdiction-module",
      targetName: "Jurisdiction Restriction Module",
      amount: null,
      status: "Applied",
      complianceChecks: ["Authorization"],
      txHash: "0xef01...2345",
      blockNumber: "18,234,450",
    },
    {
      id: "AUD-006",
      timestamp: "2024-01-15 09:45:00",
      eventType: "Token Recovery",
      description: "Recovered tokens from compromised wallet",
      actor: "0x0000...0001",
      actorName: "Token Issuer Admin",
      target: "0x4567...89ab",
      targetName: "Compromised Wallet",
      amount: "100,000 MMFA",
      status: "Completed",
      complianceChecks: ["Recovery Authorization", "Identity Verification"],
      txHash: "0xf012...3456",
      blockNumber: "18,234,400",
    },
  ]

  const filteredEvents = auditEvents.filter((event) => {
    const matchesSearch =
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = eventTypeFilter === "all" || event.eventType.toLowerCase().replace(" ", "-") === eventTypeFilter
    return matchesSearch && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
      case "Approved":
      case "Applied":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{status}</Badge>
      case "Blocked":
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{status}</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const exportAuditLog = () => {
    const csvContent = [
      ["ID", "Timestamp", "Event Type", "Description", "Actor", "Target", "Amount", "Status", "Tx Hash"].join(","),
      ...filteredEvents.map((event) =>
        [
          event.id,
          event.timestamp,
          event.eventType,
          `"${event.description}"`,
          event.actorName,
          event.targetName || "",
          event.amount || "",
          event.status,
          event.txHash || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-trail-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Audit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Events</p>
                <p className="text-2xl font-bold">2,847</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Today's Events</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Violations</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <Filter className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-600">99.8%</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Trail
          </CardTitle>
          <CardDescription>Complete audit log of all token and compliance events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="token-transfer">Token Transfer</SelectItem>
                <SelectItem value="token-issuance">Token Issuance</SelectItem>
                <SelectItem value="compliance-violation">Compliance Violation</SelectItem>
                <SelectItem value="identity-verification">Identity Verification</SelectItem>
                <SelectItem value="compliance-rule-update">Rule Update</SelectItem>
                <SelectItem value="token-recovery">Token Recovery</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportAuditLog} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Audit Events Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.id}</TableCell>
                    <TableCell>{event.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.eventType}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.actorName}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{event.actor}</div>
                      </div>
                    </TableCell>
                    <TableCell>{event.amount || "-"}</TableCell>
                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
