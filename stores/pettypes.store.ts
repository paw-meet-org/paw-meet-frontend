import { create } from "zustand";
import type { PetType, PetTypeRequest } from "@/api";

type PetTypesStore = {
  tipos: PetType[];
  isLoading: boolean;
  error: string | null;
  fetchTipos: () => Promise<PetType[]>;
  createTipo: (payload: PetTypeRequest) => Promise<PetType>;
  updateTipo: (id: string, payload: PetTypeRequest) => Promise<PetType>;
  deleteTipo: (id: string) => Promise<void>;
  clearError: () => void;
};

export const usePetTypesStore = create<PetTypesStore>((set, get) => ({
  tipos: [],
  isLoading: false,
  error: null,
  async fetchTipos() {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/tipos-mascotas");
      if (!response.ok) {
        let detail = response.statusText;
        try {
          const body = (await response.json()) as Record<string, unknown>;
          detail = JSON.stringify(body.details ?? body.message ?? body);
        } catch {
          // ignore parse errors and keep statusText
        }
        throw new Error(`Failed to fetch pet types: ${detail}`);
      }
      const raw = (await response.json()) as PetType[] | { results?: PetType[] };
      const data = Array.isArray(raw) ? raw : (raw.results ?? []);
      set({ tipos: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error), tipos: [] });
      return [];
    }
  },
  async createTipo(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/tipos-mascotas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to create pet type: ${response.statusText}`);
      }
      const data = (await response.json()) as PetType;
      await get().fetchTipos();
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async updateTipo(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tipos-mascotas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to update pet type: ${response.statusText}`);
      }
      const data = (await response.json()) as PetType;
      await get().fetchTipos();
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deleteTipo(id) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tipos-mascotas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete pet type: ${response.statusText}`);
      }
      await get().fetchTipos();
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

