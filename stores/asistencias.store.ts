import { create } from "zustand";
import type { Attendance, AttendanceRequest } from "@/api";

type AttendanceCreatePayload = AttendanceRequest & { meetingId?: number };

type AttendancesStore = {
  asistencias: Attendance[];
  isLoading: boolean;
  error: string | null;
  fetchAsistencias: () => Promise<Attendance[]>;
  createAsistencia: (payload: AttendanceCreatePayload) => Promise<Attendance>;
  updateAsistencia: (id: string, payload: AttendanceRequest) => Promise<Attendance>;
  deleteAsistencia: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useAsistenciasStore = create<AttendancesStore>((set, get) => ({
  asistencias: [],
  isLoading: false,
  error: null,
  async fetchAsistencias() {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/asistencias");
      if (!response.ok) {
        throw new Error(`Failed to fetch asistencias: ${response.statusText}`);
      }
      const data = (await response.json()) as Attendance[];
      set({ asistencias: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async createAsistencia(payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/asistencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let detail = response.statusText;
        try {
          const body = (await response.json()) as Record<string, unknown>;
          detail = JSON.stringify(body.details ?? body.message ?? body);
        } catch {
          // ignore parse errors and keep statusText
        }
        throw new Error(`Error al crear asistencia: ${detail}`);
      }
      const data = (await response.json()) as Attendance;
      await get().fetchAsistencias();
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async updateAsistencia(id, payload) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/asistencias/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let detail = response.statusText;
        try {
          const body = (await response.json()) as Record<string, unknown>;
          detail = JSON.stringify(body.details ?? body.message ?? body);
        } catch {
          // ignore parse errors and keep statusText
        }
        throw new Error(`Error al actualizar asistencia: ${detail}`);
      }
      const data = (await response.json()) as Attendance;
      await get().fetchAsistencias();
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({ isLoading: false, error: String(error) });
      throw error;
    }
  },
  async deleteAsistencia(id) {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/asistencias/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let detail = response.statusText;
        try {
          const body = (await response.json()) as Record<string, unknown>;
          detail = JSON.stringify(body.details ?? body.message ?? body);
        } catch {
          // ignore parse errors and keep statusText
        }
        throw new Error(`Error al eliminar asistencia: ${detail}`);
      }
      await get().fetchAsistencias();
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

