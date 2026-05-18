
import { create } from "zustand";
import type { Pet, PetRequest } from "@/api";

type MascotasStore = {
  mascotas: Pet[];
  isLoading: boolean;
  error: string | null;
  fetchMascotas: () => Promise<Pet[]>;
  createMascota: (payload: PetRequest) => Promise<Pet>;
  updateMascota: (id: string, payload: PetRequest) => Promise<Pet>;
  deleteMascota: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useMascotasStore = create<MascotasStore>((set, get) => ({
  mascotas: [],
  isLoading: false,
  error: null,
  async fetchMascotas() {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/mascotas");
      if (!response.ok) {
        throw new Error(`Failed to fetch mascotas: ${response.statusText}`);
      }
      const data = (await response.json()) as Pet[];
      set({ mascotas: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
   async createMascota(payload) {
     set({ isLoading: true, error: null });
     try {
       const response = await fetch("/api/mascotas", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       });
       if (!response.ok) {
         let detail = response.statusText;
         try {
           const body = (await response.json()) as Record<string, unknown>;
           detail = JSON.stringify(body.details ?? body.message ?? body);
         } catch {
           // ignore parse errors and keep status text
         }
         throw new Error(`Failed to create mascota: ${detail}`);
       }
       const data = (await response.json()) as Pet;
       await get().fetchMascotas();
       set({ isLoading: false, error: null });
       return data;
     } catch (error) {
       set({ isLoading: false, error: String(error) });
       throw error;
     }
   },
  async updateMascota(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/mascotas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let detail = response.statusText;
        try {
          const body = (await response.json()) as Record<string, unknown>;
          detail = JSON.stringify(body.details ?? body.message ?? body);
        } catch {
          // ignore parse errors and keep status text
        }
        throw new Error(`Failed to update mascota: ${detail}`);
      }
      const data = (await response.json()) as Pet;
      await get().fetchMascotas();
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deleteMascota(id) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/mascotas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete mascota: ${response.statusText}`);
      }
      await get().fetchMascotas();
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

