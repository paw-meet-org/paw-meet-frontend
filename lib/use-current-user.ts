"use client";

import { useEffect, useState } from "react";
import type { UserProfile } from "@/api";

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          if (active) setUser(null);
          return;
        }
        const data = (await response.json()) as UserProfile;
        if (active) setUser(data);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, []);

  return {
    user,
    isLoading,
    isAdmin: user?.role === "admin",
  };
}

