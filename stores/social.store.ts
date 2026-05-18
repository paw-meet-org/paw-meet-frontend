import type { PublicacionDetail, CategoriaPublicacion } from "@/api";
import type { ForoDetail } from "@/lib/types/social";
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
  isLoading: boolean;
  error: string | null;
  fetchForos: () => Promise<ForoDetail[]>;
  fetchForo: (id: string) => Promise<ForoDetail>;
  createForo: (payload: unknown) => Promise<ForoDetail>;
  updateForo: (id: string, payload: unknown) => Promise<ForoDetail>;
  deleteForo: (id: string) => Promise<void>;
  fetchCategorias: () => Promise<CategoriaPublicacion[]>;
  createCategoria: (payload: unknown) => Promise<CategoriaPublicacion>;
  updateCategoria: (id: string, payload: unknown) => Promise<CategoriaPublicacion>;
  deleteCategoria: (id: string) => Promise<void>;
  createPublicacion: (payload: unknown) => Promise<PublicacionDetail>;
  updatePublicacion: (id: string, payload: unknown) => Promise<PublicacionDetail>;
  deletePublicacion: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useSocialStore = create<SocialStore>((set, get) => ({
  foros: [],
  categorias: [],
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
  async fetchForo(id) {
    try {
      const response = await fetch(`/api/foros/${id}`);
      if (!response.ok) {
        let detail = `status ${response.status}`;
        try {
          const body = await response.json() as Record<string, unknown>;
          const backendStatus = body.backendStatus ?? response.status;
          detail = `backend status ${String(backendStatus)}: ${JSON.stringify(body.details ?? body.message ?? "")}`;
        } catch { /* ignore */ }
        throw new Error(`fetchForo(${id}) failed - ${detail}`);
      }
      const data = (await response.json()) as ForoDetail;
      set((state) => ({
        foros: state.foros.some((f) => String(f.id) === id)
          ? state.foros.map((f) => (String(f.id) === id ? data : f))
          : [...state.foros, data],
      }));
      return data;
    } catch (error) {
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

  async createPublicacion(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/publicaciones", {
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
        throw new Error(`Failed to create publicacion: ${detail}`);
      }
      const data = (await response.json()) as PublicacionDetail;
      // Intentar refrescar el foro para sincronizar publicaciones desde el backend.
      // Si falla, añadir la publicación optimistamente al foro en memoria.
      const foroId = String((payload as PublicacionPayload).foro_id);
      try {
        await get().fetchForo(foroId);
      } catch {
        // Fallback optimista: añadir la nueva pub al foro en memoria con forma compatible
        set((state) => ({
          foros: state.foros.map((f) =>
            String(f.id) === foroId
              ? {
                  ...f,
                  publicaciones: [
                    ...(f.publicaciones ?? []),
                    {
                      id: data.id,
                      titulo: data.titulo,
                      usuario: data.usuario_detail,
                      categoria: data.categoria_detail,
                      foto: data.foto,
                      uploaded_at: data.uploaded_at,
                      likes: data.likes,
                    } as never,
                  ],
                }
              : f
          ),
        }));
      }
      set({ isLoading: false, error: null });
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
      // Refrescar el foro concreto (best-effort, no bloquea si falla)
      const foroId = String((payload as PublicacionPayload).foro_id);
      if (foroId) {
        try {
          await get().fetchForo(foroId);
        } catch {
          // Ignorar si el refresco falla
        }
      }
      set({ isLoading: false, error: null });
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
      // Eliminar de todos los foros en memoria
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
