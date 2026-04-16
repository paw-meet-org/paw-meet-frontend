export const AUTH_STORAGE_KEY = "pawmeet-auth";

export function getTokenFromStorage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as {
      state?: { token?: string | null };
    };

    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
}

