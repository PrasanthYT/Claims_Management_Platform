"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Download, Loader2, XCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Claim } from "@/lib/types"

export default function ClaimDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [decision, setDecision] = useState<"approved" | "rejected" | "">("")
  const [approvedAmount, setApprovedAmount] = useState<string>("")
  const [comments, setComments] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchClaim()
  }, [params.id])

  const fetchClaim = async () => {
    try {
      const response = await fetch(`/api/claims/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setClaim(data)

        // Pre-fill form if claim is already processed
        if (data.status !== "pending") {
          setDecision(data.status)
          setApprovedAmount(data.approvedAmount?.toString() || "")
          setComments(data.insurerComments || "")
        }
      } else {
        setError("Claim not found")
      }
    } catch (error) {
      console.error("Error fetching claim:", error)
      setError("Failed to load claim details")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setError("")

    if (!decision) {
      setError("Please select a decision")
      setUpdating(false)
      return
    }

    if (decision === "approved" && (!approvedAmount || Number.parseFloat(approvedAmount) <= 0)) {
      setError("Please enter a valid approved amount")
      setUpdating(false)
      return
    }

    try {
      const updateData: any = {
        status: decision,
        insurerComments: comments,
      }

      if (decision === "approved") {
        updateData.approvedAmount = Number.parseFloat(approvedAmount)
      }

      const response = await fetch(`/api/claims/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast({
          title: "Claim updated successfully",
          description: `The claim has been ${decision}.`,
        })
        router.push("/insurer/claims")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update claim")
      }
    } catch (error) {
      console.error("Error updating claim:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return <div>Loading claim details...</div>
  }

  if (error && !claim) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!claim) {
    return <div>Claim not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Claim Details</h2>
          <p className="text-muted-foreground">Review and process claim #{claim.id.slice(-4)}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/insurer/claims")}>
          Back to Claims
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Claim Information</CardTitle>
              {getStatusBadge(claim.status)}
            </div>
            <CardDescription>Submitted on {new Date(claim.submissionDate).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Patient Name:</span>
                <span>{claim.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span>{claim.patientEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Claim Amount:</span>
                <span className="font-semibold">${claim.claimAmount.toFixed(2)}</span>
              </div>
              {claim.approvedAmount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Approved Amount:</span>
                  <span className="font-semibold">${claim.approvedAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Description:</h4>
              <p className="text-sm">{claim.description}</p>
            </div>

            {claim.insurerComments && (
              <div>
                <h4 className="text-sm font-medium mb-1">Insurer Comments:</h4>
                <p className="text-sm italic">{claim.insurerComments}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {claim.documentUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Supporting Document</CardTitle>
              <CardDescription>Document provided by the patient</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="bg-muted p-4 rounded-md w-full flex items-center justify-center">
                <img
                  src={claim.documentUrl || "/placeholder.svg"}
                  alt="Supporting document"
                  className="max-h-60 object-contain"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.open(claim.documentUrl, "_blank")}>
                <Download className="mr-2 h-4 w-4" />
                View Full Document
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {claim.status === "pending" && (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Process Claim</CardTitle>
              <CardDescription>Review the claim and make a decision</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>Decision</Label>
                <RadioGroup value={decision} onValueChange={(value) => setDecision(value as "approved" | "rejected")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approved" id="approved" />
                    <Label htmlFor="approved" className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Approve Claim
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rejected" id="rejected" />
                    <Label htmlFor="rejected" className="flex items-center">
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Reject Claim
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {decision === "approved" && (
                <div className="space-y-2">
                  <Label htmlFor="approved-amount">Approved Amount ($)</Label>
                  <Input
                    id="approved-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    placeholder={claim.claimAmount.toString()}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide any additional comments or reasons for your decision"
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/insurer/claims")}>
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Decision
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}

