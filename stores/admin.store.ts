import type { City, CityRequest, UserProfile } from "@/api";
import { create } from "zustand";

type AdminStore = {
  usuarios: UserProfile[];
  ciudades: City[];
  isLoading: boolean;
  error: string | null;
  fetchUsuarios: () => Promise<UserProfile[]>;
  createUsuario: (payload: unknown) => Promise<UserProfile>;
  updateUsuario: (id: string, payload: unknown) => Promise<UserProfile>;
  deleteUsuario: (id: string) => Promise<void>;
  fetchCiudades: () => Promise<City[]>;
  createCiudad: (payload: CityRequest) => Promise<City>;
  updateCiudad: (id: string, payload: CityRequest) => Promise<City>;
  deleteCiudad: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  usuarios: [],
  ciudades: [],
  isLoading: false,
  error: null,
  async fetchUsuarios() {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/admin");
      if (!response.ok) {
        throw new Error(`Failed to fetch usuarios: ${response.statusText}`);
      }
      const raw = await response.json();
      const data = Array.isArray(raw) ? (raw as UserProfile[]) : ((raw?.results ?? []) as UserProfile[]);
      set({ usuarios: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createUsuario(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to create usuario: ${response.statusText}`);
      }
      const data = (await response.json()) as UserProfile;
      await get().fetchUsuarios();
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async updateUsuario(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/admin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to update usuario: ${response.statusText}`);
      }
      const data = (await response.json()) as UserProfile;
      await get().fetchUsuarios();
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deleteUsuario(id) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/admin/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete usuario: ${response.statusText}`);
      }
      await get().fetchUsuarios();
      set({ isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async fetchCiudades() {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/ciudades");
      if (!response.ok) {
        throw new Error(`Failed to fetch ciudades: ${response.statusText}`);
      }
      const data = (await response.json()) as City[];
      set({ ciudades: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createCiudad(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/ciudades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to create ciudad: ${response.statusText}`);
      }
      const data = (await response.json()) as City;
      await get().fetchCiudades();
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async updateCiudad(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/ciudades/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to update ciudad: ${response.statusText}`);
      }
      const data = (await response.json()) as City;
      await get().fetchCiudades();
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deleteCiudad(id) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/ciudades/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete ciudad: ${response.statusText}`);
      }
      await get().fetchCiudades();
      set({ isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  clearError() {
    set({ error: null });
  },
}));
