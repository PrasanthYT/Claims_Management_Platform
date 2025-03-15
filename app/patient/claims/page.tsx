"use client";

import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Claim, ClaimStatus } from "@/lib/types";

export default function PatientClaimsPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "all">("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchClaims();
    }
  }, [user]);

  useEffect(() => {
    filterClaims();
  }, [claims, searchTerm, statusFilter]);

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
        "https://localhost:5000/api/claims/my-claims",
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

  const filterClaims = () => {
    let filtered = [...claims];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((claim) =>
        claim.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((claim) => claim.status === statusFilter);
    }

    setFilteredClaims(filtered);
  };

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
    }
  };

  if (loading) {
    return <div>Loading claims...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Claims</h2>
          <p className="text-muted-foreground">
            View and track all your submitted claims
          </p>
        </div>
        <Link href="/patient/submit-claim">
          <Button>Submit New Claim</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claims</CardTitle>
          <CardDescription>
            You have submitted {claims.length} claims in total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search claims..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as ClaimStatus | "all")
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Claims</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Claims</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {renderClaimsList(filteredClaims)}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {renderClaimsList(
                filteredClaims.filter((claim) => claim.status === "pending")
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {renderClaimsList(
                filteredClaims.filter((claim) => claim.status === "approved")
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {renderClaimsList(
                filteredClaims.filter((claim) => claim.status === "rejected")
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function renderClaimsList(claims: Claim[]) {
    if (claims.length === 0) {
      return <p className="text-muted-foreground">No claims found</p>;
    }

    return claims.map((claim) => (
      <Card key={claim.id} className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Claim #{claim.id.slice(-4)}</h3>
              </div>
              {getStatusBadge(claim.status)}
            </div>

            <div className="grid gap-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-medium">
                  ${claim.claimAmount.toFixed(2)}
                </span>
              </div>

              {claim.approvedAmount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Approved:
                  </span>
                  <span className="font-medium">
                    ${claim.approvedAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span>
                  {new Date(claim.submissionDate).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-2">
                <span className="text-sm text-muted-foreground">
                  Description:
                </span>
                <p className="mt-1">{claim.description}</p>
              </div>

              {claim.insurerComments && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">
                    Insurer Comments:
                  </span>
                  <p className="mt-1 italic">{claim.insurerComments}</p>
                </div>
              )}
            </div>
          </div>

          {claim.documentUrl && (
            <div className="w-full md:w-1/3 bg-muted p-4 flex items-center justify-center">
              <img
                src={claim.documentUrl || "/placeholder.svg"}
                alt="Supporting document"
                className="max-h-40 object-contain"
              />
            </div>
          )}
        </div>
      </Card>
    ));
  }
}
