"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, Users, Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Assets Under Management",
      value: "$125.4M",
      change: "+12.5%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Active Token Holders",
      value: "1,247",
      change: "+8.2%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Tokens Issued",
      value: "125,400,000",
      change: "+15.3%",
      icon: Coins,
      color: "text-purple-600",
    },
    {
      title: "Compliance Score",
      value: "99.8%",
      change: "+0.1%",
      icon: Shield,
      color: "text-green-600",
    },
  ]

  const recentActivity = [
    {
      type: "Token Issuance",
      description: "Issued 1,000,000 MMF tokens to Institutional Investor A",
      timestamp: "2 hours ago",
      status: "completed",
      amount: "$1,000,000",
    },
    {
      type: "Identity Verification",
      description: "New investor KYC approved - Pension Fund XYZ",
      timestamp: "4 hours ago",
      status: "completed",
      amount: null,
    },
    {
      type: "Compliance Check",
      description: "Transfer blocked - Jurisdiction restriction",
      timestamp: "6 hours ago",
      status: "blocked",
      amount: "$50,000",
    },
    {
      type: "Token Transfer",
      description: "Transfer from Investor A to Investor B",
      timestamp: "8 hours ago",
      status: "completed",
      amount: "$250,000",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
              <p className={`text-xs ${stat.color}`}>{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Money Market Fund Overview</CardTitle>
            <CardDescription>Current fund performance and allocation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Net Asset Value (NAV)</span>
                <span className="font-medium">$1.0023</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>7-Day Yield</span>
                <span className="font-medium text-green-600">4.85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Fund Size</span>
                <span className="font-medium">$125.4M</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Asset Allocation</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Treasury Bills</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span>Commercial Paper</span>
                  <span>30%</span>
                </div>
                <Progress value={30} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span>Bank Deposits</span>
                  <span>25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and compliance events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex-shrink-0">
                    {activity.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{activity.type}</p>
                      <Badge variant={activity.status === "completed" ? "default" : "destructive"} className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{activity.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500">{activity.timestamp}</span>
                      {activity.amount && (
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {activity.amount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
