import type { GlobalResponseSchema, Mascota, MascotasBase } from "@/generated/api";
import { apiFetch, HttpError } from "@/lib/api/http";
import { create } from "zustand";

type MascotasStore = {
  mascotas: Mascota[];
  isLoading: boolean;
  error: string | null;
  fetchMascotas: () => Promise<Mascota[]>;
  createMascota: (payload: MascotasBase) => Promise<GlobalResponseSchema>;
  clearError: () => void;
};

export const useMascotasStore = create<MascotasStore>((set, get) => ({
  mascotas: [],
  isLoading: false,
  error: null,
  async fetchMascotas() {
    set({ isLoading: true, error: null });

    try {
      const data = await apiFetch<Mascota[]>("/api/user/mascotas");
      set({ mascotas: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al cargar mascotas";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async createMascota(payload) {
    set({ isLoading: true, error: null });

    try {
      const response = await apiFetch<GlobalResponseSchema>("/api/user/mascotas", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await get().fetchMascotas();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al crear mascota";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  clearError() {
    set({ error: null });
  },
}));

