"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, FileUp, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function SubmitClaimPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [documentUrl, setDocumentUrl] = useState("")
  const [fileSelected, setFileSelected] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileSelected(true)
      // In a real app, we would upload the file to a storage service
      // For this demo, we'll just simulate a file upload
      setTimeout(() => {
        setDocumentUrl("/placeholder.svg?height=300&width=200")
      }, 1000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData(e.target as HTMLFormElement)

      const claimData = {
        patientName: formData.get("name") as string,
        patientEmail: user?.email,
        claimAmount: formData.get("amount") as string,
        description: formData.get("description") as string,
        documentUrl: documentUrl || undefined,
      }

      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimData),
      })

      if (response.ok) {
        toast({
          title: "Claim submitted successfully",
          description: "Your claim has been submitted and is pending review.",
        })
        router.push("/patient/claims")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to submit claim")
      }
    } catch (error) {
      console.error("Error submitting claim:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Submit a New Claim</h2>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
            <CardDescription>Please provide all the necessary information for your claim</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Claim Amount ($)</Label>
              <Input id="amount" name="amount" type="number" min="0.01" step="0.01" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please describe the medical service or product you're claiming for"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Supporting Document</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="grid w-full gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("document")?.click()}
                    className="w-full"
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    {fileSelected ? "Change File" : "Upload Document"}
                  </Button>
                  {fileSelected && (
                    <p className="text-sm text-muted-foreground">
                      {documentUrl ? "Document uploaded successfully" : "Uploading document..."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/patient/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Claim
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

