
import { create } from "zustand";
import type { EncuentrosBase } from "@/generated/api-client/models/EncuentrosBase";
import type { GlobalResponseSchema } from "@/generated/api-client/models/GlobalResponseSchema";
import { EncuentrosService } from "@/generated/api-client/services/EncuentrosService";

type EncuentrosStore = {
  encuentros: EncuentrosBase[];
  lastUpdatedAt: number | null;
  isLoading: boolean;
  error: string | null;
  fetchEncuentros: (force?: boolean) => Promise<EncuentrosBase[]>;
  createEncuentro: (payload: EncuentrosBase) => Promise<GlobalResponseSchema>;
  clearError: () => void;
};

const ENCUENTROS_CACHE_MS = 60_000;

export const useEncuentrosStore = create<EncuentrosStore>((set, get) => ({
  encuentros: [],
  lastUpdatedAt: null,
  isLoading: false,
  error: null,
  async fetchEncuentros(force = false) {
    const { encuentros, lastUpdatedAt } = get();
    const cacheIsFresh =
      !force &&
      lastUpdatedAt !== null &&
      Date.now() - lastUpdatedAt < ENCUENTROS_CACHE_MS;

    if (cacheIsFresh) {
      return encuentros;
    }

    set({ isLoading: true, error: null });
    try {
      const data = await EncuentrosService.obtenerEncuentros();
      set({
        encuentros: data,
        lastUpdatedAt: Date.now(),
        isLoading: false,
        error: null,
      });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createEncuentro(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await EncuentrosService.registrarEncuentro(payload);
      await get().fetchEncuentros(true);
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

