
import { create } from "zustand";
import type { MeetingDetail, MeetingDetailRequestWritable } from "@/api";

type EncuentrosStore = {
  encuentros: MeetingDetail[];
  lastUpdatedAt: number | null;
  isLoading: boolean;
  error: string | null;
  fetchEncuentros: (force?: boolean) => Promise<MeetingDetail[]>;
  createEncuentro: (payload: MeetingDetailRequestWritable) => Promise<MeetingDetail>;
  updateEncuentro: (id: number, payload: MeetingDetailRequestWritable) => Promise<MeetingDetail>;
  deleteEncuentro: (id: number) => Promise<void>;
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
      const response = await fetch("/api/encuentros");
      if (!response.ok) {
        throw new Error(`Failed to fetch encuentros: ${response.statusText}`);
      }
      const data = (await response.json()) as MeetingDetail[];
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
      const response = await fetch("/api/encuentros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let detail = response.statusText;
        try {
          const body = await response.json() as Record<string, unknown>;
          detail = JSON.stringify(body.details ?? body.message ?? body);
        } catch { /* ignore */ }
        throw new Error(`Error al crear encuentro: ${detail}`);
      }
      const data = (await response.json()) as MeetingDetail;
      await get().fetchEncuentros(true);
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async updateEncuentro(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/encuentros/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to update encuentro: ${response.statusText}`);
      }
      const data = (await response.json()) as MeetingDetail;
      await get().fetchEncuentros(true);
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deleteEncuentro(id) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/encuentros/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete encuentro: ${response.statusText}`);
      }
      await get().fetchEncuentros(true);
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

