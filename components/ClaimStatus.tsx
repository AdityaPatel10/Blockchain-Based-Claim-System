"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ClaimStatus() {
  const { isSignedIn } = useUser();
  const [claimId, setClaimId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast({
        title: "Error",
        description: "You must be signed in to check claim status",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/claims/status?id=${claimId}`);
      const data = await response.json();
      if (response.ok) {
        setStatus(data.status);
      } else {
        throw new Error(data.error || "Failed to fetch claim status");
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Claim Status</CardTitle>
          <CardDescription>
            Please sign in to check claim status.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Check Claim Status</CardTitle>
        <CardDescription>
          Enter your claim ID to check its current status.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              id="claimId"
              value={claimId}
              onChange={(e) => setClaimId(e.target.value)}
              placeholder="Enter Claim ID"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Checking..." : "Check Status"}
          </Button>
          {status && (
            <div className="text-center p-4 bg-secondary rounded-md">
              <strong>Claim Status:</strong> {status}
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
