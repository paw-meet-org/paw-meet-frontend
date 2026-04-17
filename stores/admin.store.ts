import type { CiudadBase } from "@/generated/api-client/models/CiudadBase";
import type { GlobalResponseSchema } from "@/generated/api-client/models/GlobalResponseSchema";
import type { SponsorBase } from "@/generated/api-client/models/SponsorBase";
import type { Usuario } from "@/generated/api-client/models/Usuario";
import type { UsuarioBase } from "@/generated/api-client/models/UsuarioBase";
import { create } from "zustand";
import { AdministradorService } from "@/generated/api-client/services/AdministradorService";

type AdminStore = {
  usuarios: Usuario[];
  sponsors: SponsorBase[];
  ciudades: CiudadBase[];
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
  clearError: () => void;
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  usuarios: [],
  sponsors: [],
  ciudades: [],
  isLoading: false,
  error: null,
  async fetchUsuarios() {
    set({ isLoading: true, error: null });
    try {
      const data = await AdministradorService.obtenerUsuarios();
      set({ usuarios: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createUsuario(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await AdministradorService.registrarUsuario(payload);
      await get().fetchUsuarios();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async updateUsuario(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await AdministradorService.actualizarUsuario(id, payload);
      await get().fetchUsuarios();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deleteUsuario(id) {
    set({ isLoading: true, error: null });
    try {
      await AdministradorService.deleteUsuario(id);
      await get().fetchUsuarios();
      set({ isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async fetchSponsors() {
    set({ isLoading: true, error: null });
    try {
      const data = await AdministradorService.obtenerSponsors();
      set({ sponsors: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createSponsor(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await AdministradorService.registrarSponsor(payload);
      await get().fetchSponsors();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async updateSponsor(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await AdministradorService.actualizarSponsor(id, payload);
      await get().fetchSponsors();
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deleteSponsor(id) {
    set({ isLoading: true, error: null });
    try {
      await AdministradorService.deleteSponsor(id);
      await get().fetchSponsors();
      set({ isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async fetchCiudades() {
    set({ isLoading: true, error: null });
    try {
      const data = await AdministradorService.obtenerCiudades();
      set({ ciudades: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createCiudad(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await AdministradorService.registrarCiudad(payload);
      await get().fetchCiudades();
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
