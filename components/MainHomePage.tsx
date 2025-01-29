"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClaimSubmissionForm from "@/components/ClaimSubmissionForm";
import ClaimStatus from "@/components/ClaimStatus";
import UserClaims from "@/components/UserClaims";
import UserProfile from "@/components/UserProfile";
import { useUser } from "@clerk/nextjs";

export default function MainHomePage() {
  const { user } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <h1 className="text-4xl font-bold mb-8">Blockchain-Based Claim System</h1>

      {user ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          <div className="space-y-8">
            <ClaimSubmissionForm />
            <ClaimStatus />
          </div>
          <div className="space-y-8">
            <UserProfile />
            <UserClaims />
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            Please sign in to submit and manage insurance claims
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
