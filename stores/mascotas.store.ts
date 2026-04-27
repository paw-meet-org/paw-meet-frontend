
import { create } from "zustand";
import type { Mascota } from "@/generated/api-client/models/Mascota";
import type { MascotasBase } from "@/generated/api-client/models/MascotasBase";
import type { GlobalResponseSchema } from "@/generated/api-client/models/GlobalResponseSchema";
import { UsuarioService } from "@/generated/api-client/services/UsuarioService";

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
      const data = await UsuarioService.getMascotas();
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
      const response = await UsuarioService.registrarMascotas(payload);
      await get().fetchMascotas();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  clearError() {
    set({ error: null });
  },
}));

