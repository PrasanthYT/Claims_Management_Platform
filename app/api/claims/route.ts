import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

import { mockClaims } from "@/lib/data"
import type { Claim } from "@/lib/types"

// GET all claims or filtered by email
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get("email")
  const status = searchParams.get("status")

  let filteredClaims = [...mockClaims]

  if (email) {
    filteredClaims = filteredClaims.filter((claim) => claim.patientEmail === email)
  }

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    filteredClaims = filteredClaims.filter((claim) => claim.status === status)
  }

  return NextResponse.json(filteredClaims)
}

// POST a new claim
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.patientName || !data.patientEmail || !data.claimAmount || !data.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newClaim: Claim = {
      id: uuidv4(),
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      claimAmount: Number.parseFloat(data.claimAmount),
      description: data.description,
      status: "pending",
      submissionDate: new Date().toISOString(),
      documentUrl: data.documentUrl || undefined,
    }

    // In a real app, we would save to database
    // For this demo, we'll just add to our mock data
    mockClaims.push(newClaim)

    return NextResponse.json(newClaim, { status: 201 })
  } catch (error) {
    console.error("Error creating claim:", error)
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 })
  }
}

