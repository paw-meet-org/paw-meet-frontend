import type { ForoBase } from "@/generated/api-client/models/ForoBase";
import type { TemasBase } from "@/generated/api-client/models/TemasBase";
import type { PublicacionesBase } from "@/generated/api-client/models/PublicacionesBase";
import type { GlobalResponseSchema } from "@/generated/api-client/models/GlobalResponseSchema";
import { SocialService } from "@/generated/api-client/services/SocialService";
import { create } from "zustand";

type SocialStore = {
  foros: ForoBase | null;
  temasByForo: Record<string, TemasBase>;
  publicacionesByForo: Record<string, PublicacionesBase[]>;
  isLoading: boolean;
  error: string | null;
  fetchForos: () => Promise<ForoBase>;
  fetchTemas: (foroId: string) => Promise<TemasBase>;
  createTema: (foroId: string, payload: TemasBase) => Promise<GlobalResponseSchema>;
  fetchPublicaciones: (foroId: string) => Promise<PublicacionesBase[]>;
  createPublicacion: (foroId: string, payload: PublicacionesBase) => Promise<GlobalResponseSchema>;
  deletePublicacionesDeForo: (foroId: string) => Promise<void>;
  clearError: () => void;
};

export const useSocialStore = create<SocialStore>((set, get) => ({
  foros: null,
  temasByForo: {},
  publicacionesByForo: {},
  isLoading: false,
  error: null,
  async fetchForos() {
    set({ isLoading: true, error: null });
    try {
      const data = await SocialService.obtenerForos();
      set({ foros: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async fetchTemas(foroId) {
    set({ isLoading: true, error: null });
    try {
      const data = await SocialService.obtenerTemasForo(foroId);
      set((state) => ({
        temasByForo: { ...state.temasByForo, [foroId]: data },
        isLoading: false,
        error: null,
      }));
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createTema(foroId, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await SocialService.registrarTemaForo(foroId, payload);
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async fetchPublicaciones(foroId) {
    set({ isLoading: true, error: null });
    try {
      const data = await SocialService.obtenerPublicacion(foroId);
      set((state) => ({
        publicacionesByForo: { ...state.publicacionesByForo, [foroId]: data },
        isLoading: false,
        error: null,
      }));
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createPublicacion(foroId, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await SocialService.registrarPublicacion(foroId, payload);
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deletePublicacionesDeForo(foroId) {
    set({ isLoading: true, error: null });
    try {
      await SocialService.eliminarPublicacion(foroId);
      set((state) => ({
        publicacionesByForo: { ...state.publicacionesByForo, [foroId]: [] },
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  clearError() {
    set({ error: null });
  },
}));
