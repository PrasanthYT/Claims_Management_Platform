"use client"

import { useEffect, useState } from "react"
import { ArrowRight, CheckCircle, Clock, FileText, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Claim } from "@/lib/types"

export default function InsurerDashboard() {
  const router = useRouter()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const response = await fetch("/api/claims")
      if (response.ok) {
        const data = await response.json()
        setClaims(data)
      }
    } catch (error) {
      console.error("Error fetching claims:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  const pendingClaims = claims.filter((claim) => claim.status === "pending")
  const approvedClaims = claims.filter((claim) => claim.status === "approved")
  const rejectedClaims = claims.filter((claim) => claim.status === "rejected")

  const totalClaimAmount = claims.reduce((sum, claim) => sum + claim.claimAmount, 0)
  const totalApprovedAmount = approvedClaims.reduce((sum, claim) => sum + (claim.approvedAmount || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Insurer Dashboard</h2>
        <p className="text-muted-foreground">Overview of all claims in the system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claims.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingClaims.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedClaims.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedClaims.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Claims</CardTitle>
            <CardDescription>Claims awaiting your review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingClaims.length === 0 ? (
              <p className="text-muted-foreground">No pending claims</p>
            ) : (
              pendingClaims.slice(0, 3).map((claim) => (
                <div key={claim.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{claim.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      ${claim.claimAmount.toFixed(2)} - {new Date(claim.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/insurer/claims/${claim.id}`)}>
                    Review
                  </Button>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/insurer/claims?status=pending")}>
              View All Pending Claims
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Claims Summary</CardTitle>
            <CardDescription>Financial overview of claims</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Claimed Amount</span>
                <span className="font-bold">${totalClaimAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Approved Amount</span>
                <span className="font-bold">${totalApprovedAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approval Rate</span>
                <span className="font-bold">
                  {claims.length > 0 ? `${Math.round((approvedClaims.length / claims.length) * 100)}%` : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/insurer/claims")}>
              View All Claims
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

