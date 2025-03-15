export type ClaimStatus = "pending" | "approved" | "rejected"

export interface Claim {
  id: string
  patientName: string
  patientEmail: string
  claimAmount: number
  description: string
  status: ClaimStatus
  submissionDate: string
  approvedAmount?: number
  insurerComments?: string
  documentUrl?: string
}

