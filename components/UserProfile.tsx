"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  id: string;
  name: string | null;
  email: string;
}

export default function UserProfile() {
  const { isSignedIn } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    if (isSignedIn) {
      fetchUserData();
    }
  }, [isSignedIn]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (response.ok) {
        setUserData(data.user);
      } else {
        throw new Error(data.error || "Failed to fetch user data");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !userData) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setUserData(data.user);
        toast({
          title: "Success",
          description: "User profile updated successfully",
        });
      } else {
        throw new Error(data.error || "Failed to update user profile");
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
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Please sign in to view and edit your profile.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>
          View and edit your profile information.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={userData?.name || ""}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev!, name: e.target.value }))
              }
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userData?.email || ""}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev!, email: e.target.value }))
              }
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
