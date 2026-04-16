import type {
  CiudadBase,
  GlobalResponseSchema,
  PublicacionesBase,
  SponsorBase,
  TipoMascotaBase,
  Usuario,
  UsuarioBase,
} from "@/generated/api";
import { apiFetch, HttpError } from "@/lib/api/http";
import { create } from "zustand";

type AdminStore = {
  usuarios: Usuario[];
  sponsors: SponsorBase[];
  ciudades: CiudadBase[];
  razas: TipoMascotaBase[];
  moderacion: PublicacionesBase[];
  isLoading: boolean;
  error: string | null;
  fetchUsuarios: () => Promise<Usuario[]>;
  createUsuario: (payload: UsuarioBase) => Promise<GlobalResponseSchema>;
  updateUsuario: (id: string, payload: UsuarioBase) => Promise<GlobalResponseSchema>;
  deleteUsuario: (id: string) => Promise<void>;
  fetchSponsors: () => Promise<SponsorBase[]>;
  createSponsor: (payload: SponsorBase) => Promise<GlobalResponseSchema>;
  updateSponsor: (id: string, payload: SponsorBase) => Promise<GlobalResponseSchema>;
  deleteSponsor: (id: string) => Promise<void>;
  fetchCiudades: () => Promise<CiudadBase[]>;
  createCiudad: (payload: CiudadBase) => Promise<GlobalResponseSchema>;
  fetchRazas: () => Promise<TipoMascotaBase[]>;
  createRaza: (payload: TipoMascotaBase) => Promise<GlobalResponseSchema>;
  fetchModeracion: () => Promise<PublicacionesBase[]>;
  deleteModeracionPublicacion: (id: string, user: string) => Promise<void>;
  clearError: () => void;
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  usuarios: [],
  sponsors: [],
  ciudades: [],
  razas: [],
  moderacion: [],
  isLoading: false,
  error: null,
  async fetchUsuarios() {
    set({ isLoading: true, error: null });

    try {
      const data = await apiFetch<Usuario[]>("/api/admin/users");
      set({ usuarios: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al cargar usuarios";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async createUsuario(payload) {
    set({ isLoading: true, error: null });

    try {
      const response = await apiFetch<GlobalResponseSchema>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await get().fetchUsuarios();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al crear usuario";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async updateUsuario(id, payload) {
    set({ isLoading: true, error: null });

    try {
      const response = await apiFetch<GlobalResponseSchema>(`/api/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      await get().fetchUsuarios();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : "Error al actualizar usuario";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async deleteUsuario(id) {
    set({ isLoading: true, error: null });

    try {
      await apiFetch<null>(`/api/admin/users/${id}`, { method: "DELETE" });
      await get().fetchUsuarios();
      set({ isLoading: false, error: null });
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al eliminar usuario";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async fetchSponsors() {
    set({ isLoading: true, error: null });

    try {
      const data = await apiFetch<SponsorBase[]>("/api/admin/sponsors");
      set({ sponsors: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al cargar sponsors";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async createSponsor(payload) {
    set({ isLoading: true, error: null });

    try {
      const response = await apiFetch<GlobalResponseSchema>(
        "/api/admin/sponsors",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      await get().fetchSponsors();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al crear sponsor";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async updateSponsor(id, payload) {
    set({ isLoading: true, error: null });

    try {
      const response = await apiFetch<GlobalResponseSchema>(
        `/api/admin/sponsors/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );
      await get().fetchSponsors();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : "Error al actualizar sponsor";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async deleteSponsor(id) {
    set({ isLoading: true, error: null });

    try {
      await apiFetch<null>(`/api/admin/sponsors/${id}`, { method: "DELETE" });
      await get().fetchSponsors();
      set({ isLoading: false, error: null });
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al eliminar sponsor";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async fetchCiudades() {
    set({ isLoading: true, error: null });

    try {
      const data = await apiFetch<CiudadBase[]>("/api/admin/ciudades");
      set({ ciudades: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al cargar ciudades";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async createCiudad(payload) {
    set({ isLoading: true, error: null });

    try {
      const response = await apiFetch<GlobalResponseSchema>("/api/admin/ciudades", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await get().fetchCiudades();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al crear ciudad";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async fetchRazas() {
    set({ isLoading: true, error: null });

    try {
      const data = await apiFetch<TipoMascotaBase[]>("/api/admin/razas");
      set({ razas: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al cargar razas";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async createRaza(payload) {
    set({ isLoading: true, error: null });

    try {
      const response = await apiFetch<GlobalResponseSchema>("/api/admin/razas", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await get().fetchRazas();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "Error al crear raza";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async fetchModeracion() {
    set({ isLoading: true, error: null });

    try {
      const data = await apiFetch<PublicacionesBase[]>("/api/admin/moderacion");
      set({ moderacion: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : "Error al cargar moderacion";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  async deleteModeracionPublicacion(id, user) {
    set({ isLoading: true, error: null });

    try {
      await apiFetch<null>(`/api/admin/moderacion/${id}?user=${encodeURIComponent(user)}`, {
        method: "DELETE",
      });
      await get().fetchModeracion();
      set({ isLoading: false, error: null });
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : "Error al eliminar publicacion";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  clearError() {
    set({ error: null });
  },
}));

