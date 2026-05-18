"use client";

import { useCurrentUser } from "@/lib/use-current-user";

export function useUserRole() {
  const { user, isLoading } = useCurrentUser();

  return {
    role: user?.role ?? null,
    isAdmin: user?.role === "admin",
    isLoading,
  };
}

