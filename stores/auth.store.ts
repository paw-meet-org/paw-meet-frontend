import { OpenAPI } from "@/generated/api";
import { AUTH_STORAGE_KEY } from "@/lib/auth-session";
import { apiFetch, HttpError } from "@/lib/api/http";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
};

type AuthTokens = {
  access?: string;
  refresh?: string;
};

type UserProfile = {
  id?: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  ciudad?: string;
  phone?: string;
};

type AuthStore = {
  auth: AuthTokens | null;
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthTokens>;
  register: (payload: RegisterPayload) => Promise<void>;
  fetchProfile: () => Promise<UserProfile>;
  updateProfile: (payload: Partial<UserProfile>) => Promise<UserProfile>;
  logout: () => void;
  clearError: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      auth: null,
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,
      error: null,
      async login(credentials) {
        set({ isLoading: true, error: null });

        try {
          const auth = await apiFetch<AuthTokens>("/api/login", {
            method: "POST",
            body: JSON.stringify(credentials),
          });

          const token = auth.access ?? null;

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
            error instanceof HttpError
              ? error.message
              : "Error al iniciar sesion";

          set({
            isLoading: false,
            isAuthenticated: false,
            error: message,
          });

          throw error;
        }
      },
      async register(payload) {
        set({ isLoading: true, error: null });

        try {
          await apiFetch<unknown>("/api/registro", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          set({ isLoading: false, error: null });
        } catch (error) {
          const message =
            error instanceof HttpError ? error.message : "Error al registrarse";
          set({ isLoading: false, error: message });
          throw error;
        }
      },
      async fetchProfile() {
        set({ isLoading: true, error: null });

        try {
          const profile = await apiFetch<UserProfile>("/api/user");
          set({ user: profile, isLoading: false, error: null });
          return profile;
        } catch (error) {
          const message =
            error instanceof HttpError
              ? error.message
              : "Error al cargar perfil";
          set({ isLoading: false, error: message });
          throw error;
        }
      },
      async updateProfile(payload) {
        set({ isLoading: true, error: null });

        try {
          const profile = await apiFetch<UserProfile>("/api/user", {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
          set({ user: profile, isLoading: false, error: null });
          return profile;
        } catch (error) {
          const message =
            error instanceof HttpError
              ? error.message
              : "Error al actualizar perfil";
          set({ isLoading: false, error: message });
          throw error;
        }
      },
      logout() {
        OpenAPI.TOKEN = undefined;
        set({
          auth: null,
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
      clearError() {
        set({ error: null });
      },
      setHasHydrated(value) {
        set({ hasHydrated: value });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        auth: state.auth,
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        const token = state?.token ?? null;
        OpenAPI.TOKEN = token ?? undefined;
        state?.setHasHydrated(true);
      },
    }
  )
);

