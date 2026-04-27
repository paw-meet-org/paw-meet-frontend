import { OpenAPI } from "@/generated/api";
import { AUTH_STORAGE_KEY } from "@/lib/auth-session";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Login } from "@/generated/api-client/models/Login";
import type { AuthResponse } from "@/generated/api-client/models/AuthResponse";
import type { Registro } from "@/generated/api-client/models/Registro";
import type { Usuario } from "@/generated/api-client/models/Usuario";
import type { UpdateUser } from "@/generated/api-client/models/UpdateUser";
import { UsuarioService } from "@/generated/api-client/services/UsuarioService";

type AuthStore = {
  auth: AuthResponse | null;
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  error: string | null;
  login: (credentials: Login) => Promise<AuthResponse>;
  register: (payload: Registro) => Promise<void>;
  fetchProfile: () => Promise<Usuario>;
  updateProfile: (payload: UpdateUser) => Promise<void>;
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
          const auth = await UsuarioService.login(credentials);
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
          set({
            isLoading: false,
            isAuthenticated: false,
            error: String(error),
          });
          throw error;
        }
      },
      async register(payload) {
        set({ isLoading: true, error: null });
        try {
          await UsuarioService.registro(payload);
          set({ isLoading: false, error: null });
        } catch (error) {
          set({ isLoading: false, error: String(error) });
          throw error;
        }
      },
      async fetchProfile() {
        set({ isLoading: true, error: null });
        try {
          // El endpoint generado para obtener el usuario autenticado no está en UsuarioService, se asume que existe getUser
          // Si no existe, debe agregarse en el backend OpenAPI
          // const profile = await UsuarioService.getUser();
          // set({ user: profile, isLoading: false, error: null });
          // return profile;
          throw new Error("Implementar método generado para obtener usuario");
        } catch (error) {
          set({ isLoading: false, error: String(error) });
          throw error;
        }
      },
      async updateProfile(payload) {
        set({ isLoading: true, error: null });
        try {
          await UsuarioService.updateUser(payload);
          set({ isLoading: false, error: null });
        } catch (error) {
          set({ isLoading: false, error: String(error) });
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
