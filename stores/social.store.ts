import type { ForoDetail, PublicacionDetail, CategoriaPublicacion } from "@/api";
import { create } from "zustand";

type PublicacionPayload = {
  titulo: string;
  texto: string;
  foro_id: number;
  categoria_id: number;
};

type SocialStore = {
  foros: ForoDetail[];
  categorias: CategoriaPublicacion[];
  publicacionesByForo: Record<string, PublicacionDetail[]>;
  isLoading: boolean;
  error: string | null;
  fetchForos: () => Promise<ForoDetail[]>;
  createForo: (payload: unknown) => Promise<ForoDetail>;
  updateForo: (id: string, payload: unknown) => Promise<ForoDetail>;
  deleteForo: (id: string) => Promise<void>;
  fetchCategorias: () => Promise<CategoriaPublicacion[]>;
  createCategoria: (payload: unknown) => Promise<CategoriaPublicacion>;
  updateCategoria: (id: string, payload: unknown) => Promise<CategoriaPublicacion>;
  deleteCategoria: (id: string) => Promise<void>;
  fetchPublicaciones: (foroId: string) => Promise<PublicacionDetail[]>;
  createPublicacion: (payload: unknown) => Promise<PublicacionDetail>;
  updatePublicacion: (id: string, payload: unknown) => Promise<PublicacionDetail>;
  deletePublicacion: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useSocialStore = create<SocialStore>((set) => ({
  foros: [],
  categorias: [],
  publicacionesByForo: {},
  isLoading: false,
  error: null,
  async fetchForos() {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/foros");
      if (!response.ok) {
        throw new Error(`Failed to fetch foros: ${response.statusText}`);
      }
      const data = (await response.json()) as ForoDetail[];
      set({ foros: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createForo(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/foros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to create foro: ${response.statusText}`);
      }
      const data = (await response.json()) as ForoDetail;
      set((state) => ({ foros: [...state.foros, data], isLoading: false, error: null }));
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async updateForo(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/foros/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to update foro: ${response.statusText}`);
      }
      const data = (await response.json()) as ForoDetail;
      set((state) => ({
        foros: state.foros.map((f) => (String(f.id) === id ? data : f)),
        isLoading: false,
        error: null,
      }));
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deleteForo(id) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/foros/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete foro: ${response.statusText}`);
      }
      set((state) => ({
        foros: state.foros.filter((f) => String(f.id) !== id),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async fetchCategorias() {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/categorias");
      if (!response.ok) {
        throw new Error(`Failed to fetch categorias: ${response.statusText}`);
      }
      const data = (await response.json()) as CategoriaPublicacion[];
      set({ categorias: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createCategoria(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to create categoria: ${response.statusText}`);
      }
      const data = (await response.json()) as CategoriaPublicacion;
      set((state) => ({ categorias: [...state.categorias, data], isLoading: false, error: null }));
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async updateCategoria(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to update categoria: ${response.statusText}`);
      }
      const data = (await response.json()) as CategoriaPublicacion;
      set((state) => ({
        categorias: state.categorias.map((c) => (String(c.id) === id ? data : c)),
        isLoading: false,
        error: null,
      }));
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deleteCategoria(id) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete categoria: ${response.statusText}`);
      }
      set((state) => ({
        categorias: state.categorias.filter((c) => String(c.id) !== id),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async fetchPublicaciones(foroId) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/publicaciones");
      if (!response.ok) {
        throw new Error(`Failed to fetch publicaciones: ${response.statusText}`);
      }
      const data = (await response.json()) as PublicacionDetail[];
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
  async createPublicacion(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/publicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to create publicacion: ${response.statusText}`);
      }
      const data = (await response.json()) as PublicacionDetail;
      
      // Actualizar el foro local con la nueva publicación
      const foroId = (payload as unknown as PublicacionPayload).foro_id;
      set((state) => ({
        foros: state.foros.map((f) =>
          String(f.id) === String(foroId)
            ? { ...f, publicaciones: [...(f.publicaciones ?? []), data as never] }
            : f
        ),
        isLoading: false,
        error: null,
      }));
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async updatePublicacion(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/publicaciones/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to update publicacion: ${response.statusText}`);
      }
      const data = (await response.json()) as PublicacionDetail;
      
      // Actualizar la publicación en el foro local
      const foroId = (payload as unknown as PublicacionPayload).foro_id;
      set((state) => ({
        foros: state.foros.map((f) =>
          String(f.id) === String(foroId)
            ? {
                ...f,
                publicaciones: (f.publicaciones ?? []).map((p) =>
                  String(p.id) === id ? (data as never) : p
                ),
              }
            : f
        ),
        isLoading: false,
        error: null,
      }));
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deletePublicacion(id) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/publicaciones/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete publicacion: ${response.statusText}`);
      }
      
      // Eliminar la publicación de todos los foros
      set((state) => ({
        foros: state.foros.map((f) => ({
          ...f,
          publicaciones: (f.publicaciones ?? []).filter((p) => String(p.id) !== id),
        })),
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
