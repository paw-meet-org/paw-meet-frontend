"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useAsistenciasStore } from "@/stores";
import { useCurrentUser } from "@/lib/use-current-user";

export default function AsistenciaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEditing = id && id !== "nuevo";

  const { asistencias, isLoading, error, createAsistencia, updateAsistencia, deleteAsistencia, clearError } = useAsistenciasStore();
  const { user, isAdmin } = useCurrentUser();
  const [formError, setFormError] = useState<string | null>(null);

  const current = isEditing ? asistencias.find((a) => String(a.id) === id) : null;
  const isOwner =
    !isEditing ||
    !!(
      current &&
      (String(current.user) === String(user?.id) || String(current.user_email) === String(user?.email))
    );
  const canEdit = !isEditing || isAdmin || isOwner;

  useEffect(() => {
    if (isEditing && id && !current) {
      void useAsistenciasStore.getState().fetchAsistencias();
    }
  }, [current, id, isEditing]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEdit) {
      setFormError("No puedes editar una asistencia que no es tuya");
      return;
    }
    setFormError(null);
    clearError();

    const formData = new FormData(event.currentTarget);
    const meetingId = Number(formData.get("meetingId") ?? "0");
    const status = String(formData.get("status") ?? "confirmed");
    const notes = String(formData.get("notes") ?? "");

    try {
      if (isEditing && id) {
        await updateAsistencia(id, { status: status as "confirmed" | "cancelled" | "attended" | "no_show", notes });
      } else {
        await createAsistencia({ meetingId, status: status as "confirmed" | "cancelled" | "attended" | "no_show", notes });
      }
      router.replace("/auth/asistencias");
    } catch (err) {
      setFormError(String(err));
    }
  };

  const onDelete = async () => {
    if (!id) return;
    if (!confirm("¿Eliminar asistencia?")) return;
    try {
      await deleteAsistencia(id);
      router.replace("/auth/asistencias");
    } catch (err) {
      setFormError(String(err));
    }
  };

  if (isEditing && isLoading && !current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500"></div>
          <p className="mt-4 font-medium text-slate-500">Cargando asistencia...</p>
        </div>
      </div>
    );
  }

  if (isEditing && !current) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <main className="mx-auto w-full max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Asistencia no encontrada</h1>
            <Link
              href="/perfil"
              className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 font-bold text-white"
            >
              Volver al perfil
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-lg rounded-[2.5rem] border border-white/50 bg-white/80 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Perfil", href: "/perfil" },
            { label: "Asistencias", href: "/auth/asistencias" },
            { label: isEditing ? `Asistencia #${id}` : "Nueva asistencia" },
          ]}
        />

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl shadow-inner">
            🗓️
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {isEditing ? "Detalles de asistencia" : "Nueva asistencia"}
          </h1>
          <p className="mt-2 text-slate-500">
            {isEditing ? "Gestiona tu estado de asistencia" : "Apúntate a un encuentro"}
          </p>
        </div>

        {(error || formError) && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100">
            <span>⚠️</span>
            <p className="text-sm font-medium">{error || formError}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          {!isEditing && (
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">ID del Encuentro</label>
              <input
                name="meetingId"
                type="number"
                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-70 disabled:bg-slate-100"
                required
                disabled={!canEdit}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Estado de asistencia</label>
            <div className="relative">
              <select
                name="status"
                defaultValue={current?.status ?? "confirmed"}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-70 disabled:bg-slate-100"
                disabled={!canEdit}
              >
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
                <option value="attended">He asistido</option>
                <option value="no_show">No he asistido</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Notas (opcional)</label>
            <textarea
              name="notes"
              rows={4}
              defaultValue={current?.notes ?? ""}
              placeholder="¿Algún comentario para el organizador?"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 resize-none disabled:opacity-70 disabled:bg-slate-100"
              disabled={!canEdit}
            />
          </div>

          {canEdit && (
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-full bg-blue-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/30 transition-transform hover:-translate-y-1 hover:bg-blue-700 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isLoading ? "Guardando..." : isEditing ? "Actualizar asistencia" : "Confirmar asistencia"}
            </button>
          )}
        </form>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row border-t border-slate-100 pt-6">
          <Link
            href="/auth/asistencias"
            className="flex-1 rounded-full border-2 border-slate-200 bg-white px-4 py-3 text-center font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            Volver
          </Link>
          {isEditing && canEdit && (
            <button
              onClick={onDelete}
              disabled={isLoading}
              className="flex-1 rounded-full bg-red-50 px-4 py-3 font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
