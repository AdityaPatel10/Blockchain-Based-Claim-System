"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function CreateUserWrapper({ children }: { children: React.ReactNode }) {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/auth/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      }).catch((error) => console.error("Error creating user:", error));
    }
  }, [isSignedIn, user]);

  return <>{children}</>;
}
