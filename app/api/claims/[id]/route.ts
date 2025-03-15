import { type NextRequest, NextResponse } from "next/server"

import { mockClaims } from "@/lib/data"

// GET a specific claim by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const claim = mockClaims.find((c) => c.id === params.id)

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 })
  }

  return NextResponse.json(claim)
}

// PATCH to update a claim (for insurer to approve/reject)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const claimIndex = mockClaims.findIndex((c) => c.id === params.id)

    if (claimIndex === -1) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 })
    }

    // Update the claim with the provided data
    const updatedClaim = {
      ...mockClaims[claimIndex],
      ...data,
    }

    // In a real app, we would update the database
    // For this demo, we'll just update our mock data
    mockClaims[claimIndex] = updatedClaim

    return NextResponse.json(updatedClaim)
  } catch (error) {
    console.error("Error updating claim:", error)
    return NextResponse.json({ error: "Failed to update claim" }, { status: 500 })
  }
}

