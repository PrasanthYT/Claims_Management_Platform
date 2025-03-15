import type { Claim } from "@/lib/types"

// Mock data for claims
export const mockClaims: Claim[] = [
  {
    id: "claim-001",
    patientName: "John Doe",
    patientEmail: "patient@example.com",
    claimAmount: 1200,
    description: "Hospital visit for routine checkup and blood tests",
    status: "approved",
    submissionDate: "2025-02-15T10:30:00Z",
    approvedAmount: 1000,
    insurerComments: "Approved with standard deduction",
    documentUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "claim-002",
    patientName: "John Doe",
    patientEmail: "patient@example.com",
    claimAmount: 500,
    description: "Prescription medication for chronic condition",
    status: "pending",
    submissionDate: "2025-03-01T14:45:00Z",
    documentUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "claim-003",
    patientName: "John Doe",
    patientEmail: "patient@example.com",
    claimAmount: 3000,
    description: "Emergency room visit due to accident",
    status: "rejected",
    submissionDate: "2025-02-20T09:15:00Z",
    insurerComments: "Insufficient documentation provided",
    documentUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "claim-004",
    patientName: "Jane Smith",
    patientEmail: "jane@example.com",
    claimAmount: 800,
    description: "Dental procedure - root canal",
    status: "approved",
    submissionDate: "2025-02-10T11:20:00Z",
    approvedAmount: 750,
    documentUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "claim-005",
    patientName: "Robert Johnson",
    patientEmail: "robert@example.com",
    claimAmount: 1500,
    description: "Physical therapy sessions",
    status: "pending",
    submissionDate: "2025-03-05T16:30:00Z",
    documentUrl: "/placeholder.svg?height=300&width=200",
  },
]

// Function to get claims for a specific patient
export function getPatientClaims(email: string): Claim[] {
  return mockClaims.filter((claim) => claim.patientEmail === email)
}

// Function to get all claims (for insurers)
export function getAllClaims(): Claim[] {
  return mockClaims
}

// Function to get a specific claim by ID
export function getClaimById(id: string): Claim | undefined {
  return mockClaims.find((claim) => claim.id === id)
}

