import type { EncuentrosBase, GlobalResponseSchema } from "@/generated/api";
import { apiFetch, HttpError } from "@/lib/api/http";
import { create } from "zustand";

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
      const data = await apiFetch<EncuentrosBase[]>("/api/encuentros");
      set({
        encuentros: data,
        lastUpdatedAt: Date.now(),
        isLoading: false,
        error: null,
      });
      return data;
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : "Error al cargar encuentros";

      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async createEncuentro(payload) {
    set({ isLoading: true, error: null });

    try {
      const response = await apiFetch<GlobalResponseSchema>("/api/encuentros", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Force refresh after a mutation to keep the local cache in sync.
      await get().fetchEncuentros(true);
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : "Error al crear el encuentro";

      set({ isLoading: false, error: message });
      throw error;
    }
  },
  clearError() {
    set({ error: null });
  },
}));

