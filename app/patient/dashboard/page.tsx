"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Claim } from "@/lib/types";

export default function PatientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchClaims();
    }
  }, [user]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authorization token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://claims-management-platform.onrender.com/api/claims",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Passing the Bearer token
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setClaims(data);
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || "Failed to fetch claims");
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const pendingClaims = claims.filter((claim) => claim.status === "pending");
  const approvedClaims = claims.filter((claim) => claim.status === "approved");
  const rejectedClaims = claims.filter((claim) => claim.status === "rejected");

  const totalApproved = approvedClaims.reduce(
    (sum, claim) => sum + (claim.approvedAmount || 0),
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">
          Here's an overview of your claims and their status
        </p>
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
            <CardTitle>Recent Claims</CardTitle>
            <CardDescription>
              Your most recently submitted claims
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {claims.length === 0 ? (
              <p className="text-muted-foreground">No claims submitted yet</p>
            ) : (
              claims.slice(0, 3).map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">
                      ${claim.claimAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(claim.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {claim.status === "pending" && (
                      <span className="flex items-center text-amber-500">
                        <Clock className="mr-1 h-4 w-4" /> Pending
                      </span>
                    )}
                    {claim.status === "approved" && (
                      <span className="flex items-center text-green-500">
                        <CheckCircle className="mr-1 h-4 w-4" /> Approved
                      </span>
                    )}
                    {claim.status === "rejected" && (
                      <span className="flex items-center text-red-500">
                        <XCircle className="mr-1 h-4 w-4" /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/patient/claims")}
            >
              View All Claims
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Claims Summary</CardTitle>
            <CardDescription>Overview of your approved claims</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Total Approved Amount
                </span>
                <span className="font-bold">${totalApproved.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Average Approval Rate
                </span>
                <span className="font-bold">
                  {claims.length > 0
                    ? `${Math.round(
                        (approvedClaims.length / claims.length) * 100
                      )}%`
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => router.push("/patient/submit-claim")}
            >
              Submit New Claim
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
