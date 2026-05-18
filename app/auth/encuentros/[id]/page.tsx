"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useEncuentrosStore, useAsistenciasStore } from "@/stores";
import { useCurrentUser } from "@/lib/use-current-user";
import { AsistenciaSection } from "@/components/sections/AsistenciaSection";
import type { City } from "@/api";

export default function EncuentroDetailPage() {
  const router = useRouter();
  const params = useParams();
  const encuentroId = params?.id as string;

  const { encuentros, isLoading, error, fetchEncuentros } = useEncuentrosStore();
  const { asistencias, isLoading: isLoadingAsistencias, createAsistencia, deleteAsistencia, fetchAsistencias } = useAsistenciasStore();
  const { user, isAdmin } = useCurrentUser();
  const [isEditingEncuentro, setIsEditingEncuentro] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  const encuentro = encuentros.find((e) => String(e.id) === encuentroId);
  const isCreator =
    !encuentro ||
    (String(encuentro?.creator ?? "") === String(user?.id ?? "") ||
      String(encuentro?.creator_email ?? "") === String(user?.email ?? "") ||
      String(encuentro?.is_creator ?? "").toLowerCase() === "true");
  const canEditEncuentro = isAdmin || isCreator;

  // Comprobar si el usuario ya está apuntado
  const myAsistencia = asistencias.find(
    (a) => String(a.meeting) === encuentroId &&
      (String(a.user) === String(user?.id ?? "") || String(a.user_email) === String(user?.email ?? ""))
  );

  useEffect(() => {
    if (encuentros.length === 0) fetchEncuentros();
    void fetchAsistencias();
  }, [encuentros.length, fetchEncuentros, fetchAsistencias]);

  useEffect(() => {
    fetch("/api/ciudades")
      .then((response) => response.json())
      .then((data: City[] | { results?: City[] }) => {
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setCities(list);
      })
      .catch(() => setCities([]));
  }, []);

  const onUpdateEncuentro = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEditEncuentro || !encuentro) {
      setFormError("No puedes editar este encuentro");
      return;
    }
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? ""),
      date: String(formData.get("date") ?? ""),
      start_time: String(formData.get("start_time") ?? ""),
      end_time: String(formData.get("end_time") ?? ""),
      location: String(formData.get("location") ?? ""),
      city_id: Number(formData.get("city_id") ?? "0"),
    };

    try {
      const { updateEncuentro } = useEncuentrosStore.getState();
      await updateEncuentro(Number(encuentroId), payload);
      setIsEditingEncuentro(false);
    } catch (err) {
      setFormError(String(err));
    }
  };

  const onDeleteEncuentro = async () => {
    if (!encuentro) return;
    if (!confirm("¿Eliminar encuentro y todas sus asistencias?")) return;
    try {
      const { deleteEncuentro } = useEncuentrosStore.getState();
      await deleteEncuentro(Number(encuentroId));
      router.replace("/auth/encuentros");
    } catch (err) {
      setFormError(String(err));
    }
  };

  const onJoin = async () => {
    setFormError(null);
    try {
      const asistencia = await createAsistencia({ meetingId: Number(encuentroId), status: "confirmed", notes: "" });
      setJoinSuccess(true);
      await fetchEncuentros(true);
      router.push(`/auth/asistencias/${asistencia.id}`);
    } catch (err) {
      setFormError(String(err));
    }
  };

  const onLeave = async () => {
    if (!myAsistencia) return;
    if (!confirm("¿Cancelar tu asistencia a este encuentro?")) return;
    setFormError(null);
    try {
      await deleteAsistencia(String(myAsistencia.id));
      setJoinSuccess(false);
      await fetchEncuentros(true);
    } catch (err) {
      setFormError(String(err));
    }
  };

  if (isLoading && !encuentro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-green-500"></div>
          <p className="mt-4 font-medium text-slate-500">Cargando encuentro...</p>
        </div>
      </div>
    );
  }

  if (!encuentro) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <main className="mx-auto w-full max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Encuentro no encontrado</h1>
            <Link href="/auth/encuentros" className="mt-6 inline-block rounded-full bg-green-600 px-6 py-3 font-bold text-white">
              Volver a encuentros
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Encuentros", href: "/auth/encuentros" },
            { label: encuentro.title },
          ]}
        />

        {/* Header del Encuentro */}
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900">{encuentro.title}</h1>
              <p className="mt-2 text-slate-500">
                Organizado por <span className="font-semibold text-slate-700">{encuentro.creator_name}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 uppercase tracking-wide">
                  📅 {encuentro.date ? new Date(encuentro.date).toLocaleDateString() : "Fecha por definir"}
                </span>
                <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 uppercase tracking-wide">
                  🗺️ {encuentro.location || "Ubicación por definir"}
                </span>
              </div>
            </div>
            {canEditEncuentro && (
              <button
                onClick={() => setIsEditingEncuentro(!isEditingEncuentro)}
                className="rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-700 transition-colors hover:bg-slate-200"
              >
                {isEditingEncuentro ? "Cancelar" : "Editar encuentro"}
              </button>
            )}
          </div>

          {!isEditingEncuentro && encuentro.description && (
            <div className="mt-2 border-t border-slate-100 pt-4">
              <p className="text-slate-600 leading-relaxed">{encuentro.description}</p>
            </div>
          )}

          {(error || formError) && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100">
              <span>⚠️</span>
              <p className="text-sm font-medium">{error || formError}</p>
            </div>
          )}

          {/* Botón de unirse / salir */}
          {!isEditingEncuentro && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              {joinSuccess && (
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-800 border border-green-100">
                  <span>✅</span>
                  <p className="text-sm font-medium">¡Te has apuntado al encuentro!</p>
                </div>
              )}
              {myAsistencia ? (
                <button
                  onClick={onLeave}
                  disabled={isLoadingAsistencias}
                  className="w-full rounded-full bg-red-50 px-6 py-3 font-bold text-red-600 border-2 border-red-100 transition-colors hover:bg-red-100 disabled:opacity-60"
                >
                  {isLoadingAsistencias ? "Procesando..." : "❌ Cancelar asistencia"}
                </button>
              ) : (
                <button
                  onClick={onJoin}
                  disabled={isLoadingAsistencias}
                  className="w-full rounded-full bg-green-500 px-6 py-3 font-bold text-white shadow-lg shadow-green-500/30 transition-transform hover:-translate-y-1 hover:bg-green-600 disabled:opacity-60"
                >
                  {isLoadingAsistencias ? "Procesando..." : "✅ Unirse al encuentro"}
                </button>
              )}
            </div>
          )}

          {isEditingEncuentro && canEditEncuentro && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <form className="space-y-4" onSubmit={onUpdateEncuentro}>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Título</label>
                  <input
                    name="title"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                    defaultValue={encuentro.title}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Descripción</label>
                  <textarea
                    name="description"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 resize-none"
                    rows={4}
                    defaultValue={encuentro.description}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Fecha</label>
                    <input
                      type="date"
                      name="date"
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                      defaultValue={encuentro.date}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Ubicación</label>
                    <input
                      name="location"
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                      defaultValue={encuentro.location}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Hora inicio</label>
                    <input
                      type="time"
                      name="start_time"
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                      defaultValue={encuentro.start_time}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Hora fin</label>
                    <input
                      type="time"
                      name="end_time"
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                      defaultValue={encuentro.end_time}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Ciudad</label>
                    <select
                      name="city_id"
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                      defaultValue={encuentro.city?.id ?? ""}
                    >
                      <option value="" disabled>
                        {cities.length === 0 ? "Cargando ciudades..." : "Selecciona una ciudad"}
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}{city.province ? ` (${city.province})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 rounded-full bg-green-600 px-4 py-2 font-bold text-white transition-transform hover:bg-green-700 disabled:opacity-60"
                  >
                    {isLoading ? "Guardando..." : "Guardar cambios"}
                  </button>
                  {canEditEncuentro && (
                    <button
                      type="button"
                      onClick={onDeleteEncuentro}
                      disabled={isLoading}
                      className="rounded-full bg-red-50 px-6 py-2 font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
                    >
                      {isLoading ? "Eliminando..." : "Eliminar encuentro"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Asistencias del Encuentro */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Asistencias ({encuentro.attendees?.length ?? 0})
              </h2>
              <p className="mt-2 text-slate-500">Personas confirmadas para este encuentro</p>
            </div>
          </div>

          {!encuentro.attendees || encuentro.attendees.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-5xl">
                👥
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Aún no hay asistentes</h3>
              <p className="mt-2 max-w-md text-slate-500">
                Sé el primero en confirmar tu asistencia a este encuentro
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {encuentro.attendees.map((asistencia) => (
                <div key={asistencia.id} className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl transition-transform group-hover:scale-150"></div>
                  <AsistenciaSection asistencia={asistencia} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Volver */}
        <div className="flex justify-center">
          <Link
            href="/auth/encuentros"
            className="rounded-full border-2 border-slate-200 bg-white px-8 py-3 font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            ← Volver a encuentros
          </Link>
        </div>
      </main>
    </div>
  );
}

