/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Claim {
  id: string;
  claimType: string;
  amount: number;
  status: string;
  createdAt: string;
  // transactionHash: string;
}

export default function UserClaims() {
  const { isSignedIn } = useUser();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isSignedIn) {
      fetchUserClaims();
    }
  }, [isSignedIn]);

  const fetchUserClaims = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/claims/user");
      const data = await response.json();
      if (response.ok) {
        setClaims(data.claims);
      } else {
        throw new Error(data.error || "Failed to fetch user claims");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Claims</CardTitle>
          <CardDescription>Please sign in to view your claims.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Claims</CardTitle>
        <CardDescription>
          View all your submitted claims and their statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading claims...</p>
        ) : claims.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Claim Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted On</TableHead>
                {/* <TableHead>Transaction Hash</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>{claim.id}</TableCell>
                  <TableCell>{claim.claimType}</TableCell>
                  <TableCell>${claim.amount.toFixed(2)}</TableCell>
                  <TableCell>{claim.status}</TableCell>
                  <TableCell>
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </TableCell>
                  {/* <TableCell>{claim.transactionHash}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No claims found.</p>
        )}
      </CardContent>
    </Card>
  );
}
