import { OpenAPI, type AuthResponse, type Login } from "@/generated/api";
import { apiFetch, HttpError } from "@/lib/api/http";
import { create } from "zustand";

type AuthStore = {
  auth: AuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: Login) => Promise<AuthResponse>;
  logout: () => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  auth: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  async login(credentials) {
    set({ isLoading: true, error: null });

    try {
      const auth = await apiFetch<AuthResponse>("/api/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      const token = auth.access_token ?? null;

      set({
        auth,
        token,
        isAuthenticated: Boolean(token),
        isLoading: false,
        error: null,
      });

      OpenAPI.TOKEN = token ?? undefined;
      return auth;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al iniciar sesion";

      set({
        isLoading: false,
        isAuthenticated: false,
        error: message,
      });

      throw error;
    }
  },
  logout() {
    OpenAPI.TOKEN = undefined;
    set({
      auth: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },
  clearError() {
    set({ error: null });
  },
}));

