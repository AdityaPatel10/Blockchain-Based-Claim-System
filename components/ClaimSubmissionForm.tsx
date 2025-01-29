"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ClaimSubmissionForm() {
  const { isSignedIn } = useUser();
  const [claimData, setClaimData] = useState({
    policyNumber: "",
    claimType: "",
    description: "",
    amount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClaimData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast({
        title: "Error",
        description: "You must be signed in to submit a claim",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/claims/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimData),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Claim submitted successfully!",
          description: `Claim ID: ${data.claimId}, Transaction hash: ${data.transactionHash}`,
        });
        setClaimData({
          policyNumber: "",
          claimType: "",
          description: "",
          amount: "",
        });
      } else {
        throw new Error(data.error || "Failed to submit claim");
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
      console.error("Claim submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Submit Insurance Claim</CardTitle>
          <CardDescription>Please sign in to submit a claim.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Submit Insurance Claim</CardTitle>
        <CardDescription>
          Please fill out the form below to submit your claim.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="policyNumber">Policy Number</Label>
            <Input
              id="policyNumber"
              name="policyNumber"
              value={claimData.policyNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="claimType">Claim Type</Label>
            <Input
              id="claimType"
              name="claimType"
              value={claimData.claimType}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={claimData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Claim Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={claimData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Claim"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
