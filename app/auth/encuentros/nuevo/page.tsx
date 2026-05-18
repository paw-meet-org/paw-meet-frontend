"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useEncuentrosStore } from "@/stores";
import type { City } from "@/api";

export default function NuevoEncuentroPage() {
  const router = useRouter();
  const { isLoading, error, createEncuentro, clearError } = useEncuentrosStore();
  const [formError, setFormError] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    fetch("/api/ciudades")
      .then((r) => r.json())
      .then((data: City[] | { results?: City[] }) => {
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setCities(list);
      })
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const date = String(formData.get("date") ?? "").trim();
    const start_time = String(formData.get("start_time") ?? "").trim();
    const end_time = String(formData.get("end_time") ?? "").trim();
    const city_id = Number(formData.get("city_id") ?? "0");

    if (!title) { setFormError("El nombre del encuentro es requerido"); return; }
    if (!date) { setFormError("La fecha es requerida"); return; }
    if (!start_time) { setFormError("La hora de inicio es requerida"); return; }
    if (!end_time) { setFormError("La hora de fin es requerida"); return; }
    if (!city_id) { setFormError("Selecciona una ciudad"); return; }

    try {
      await createEncuentro({
        title,
        description: description || "",
        date,
        start_time,
        end_time,
        location: location || "",
        city_id,
      });
      router.replace("/auth/encuentros");
    } catch (err) {
      setFormError(String(err));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-xl rounded-[2.5rem] border border-white/50 bg-white/80 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Encuentros", href: "/auth/encuentros" },
            { label: "Nuevo encuentro" },
          ]}
        />

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl shadow-inner">
            📍
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Organizar encuentro</h1>
          <p className="mt-2 text-slate-500">Crea un nuevo evento para que las mascotas socialicen</p>
        </div>

        {(error || formError) && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100">
            <span>⚠️</span>
            <p className="text-sm font-medium">{error || formError}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Nombre del evento *</label>
            <input
              type="text"
              name="title"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
              placeholder="Ej. Tarde de juegos en el parque"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Ciudad *</label>
            <select
              name="city_id"
              required
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
              defaultValue=""
            >
              <option value="" disabled>
                {loadingCities ? "Cargando ciudades..." : "Selecciona una ciudad"}
              </option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.province ? ` (${c.province})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Ubicación específica</label>
            <input
              type="text"
              name="location"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
              placeholder="Ej. Parque de los Patos, entrada norte"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Fecha *</label>
              <input
                type="date"
                name="date"
                required
                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Hora inicio *</label>
              <input
                type="time"
                name="start_time"
                required
                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Hora fin *</label>
              <input
                type="time"
                name="end_time"
                required
                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Descripción</label>
            <textarea
              name="description"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 resize-none"
              rows={4}
              placeholder="Detalles sobre el encuentro..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || loadingCities}
            className="mt-6 w-full rounded-full bg-green-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-green-600/30 transition-transform hover:-translate-y-1 hover:bg-green-700 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isLoading ? "Creando..." : "Crear encuentro"}
          </button>
        </form>

        <div className="mt-6 flex justify-center border-t border-slate-100 pt-6">
          <Link
            href="/auth/encuentros"
            className="rounded-full border-2 border-slate-200 bg-white px-8 py-3 font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            Cancelar
          </Link>
        </div>
      </main>
    </div>
  );
}
