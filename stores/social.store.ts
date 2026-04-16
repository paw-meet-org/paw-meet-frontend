import type {
  ForoBase,
  GlobalResponseSchema,
  PublicacionesBase,
  TemasBase,
} from "@/generated/api";
import { apiFetch, HttpError } from "@/lib/api/http";
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
  createPublicacion: (
    foroId: string,
    payload: PublicacionesBase
  ) => Promise<GlobalResponseSchema>;
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
      const data = await apiFetch<ForoBase>("/api/social/foros");
      set({ foros: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al cargar foros";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async fetchTemas(foroId) {
    set({ isLoading: true, error: null });

    try {
      const data = await apiFetch<TemasBase>(`/api/social/foros/${foroId}/temas`);
      set((state) => ({
        temasByForo: { ...state.temasByForo, [foroId]: data },
        isLoading: false,
        error: null,
      }));
      return data;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al cargar temas";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async createTema(foroId, payload) {
    set({ isLoading: true, error: null });

    try {
      const response = await apiFetch<GlobalResponseSchema>(
        `/api/social/foros/${foroId}/temas`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      await get().fetchTemas(foroId);
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al crear tema";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async fetchPublicaciones(foroId) {
    set({ isLoading: true, error: null });

    try {
      const data = await apiFetch<PublicacionesBase[]>(
        `/api/social/foros/${foroId}/publicaciones`
      );
      set((state) => ({
        publicacionesByForo: {
          ...state.publicacionesByForo,
          [foroId]: data,
        },
        isLoading: false,
        error: null,
      }));
      return data;
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : "Error al cargar publicaciones";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async createPublicacion(foroId, payload) {
    set({ isLoading: true, error: null });

    try {
      const response = await apiFetch<GlobalResponseSchema>(
        `/api/social/foros/${foroId}/publicaciones`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      await get().fetchPublicaciones(foroId);
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : "Error al crear publicacion";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async deletePublicacionesDeForo(foroId) {
    set({ isLoading: true, error: null });

    try {
      await apiFetch<null>(`/api/social/foros/${foroId}/publicaciones`, {
        method: "DELETE",
      });
      set((state) => ({
        publicacionesByForo: {
          ...state.publicacionesByForo,
          [foroId]: [],
        },
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : "Error al eliminar publicaciones";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  clearError() {
    set({ error: null });
  },
}));

