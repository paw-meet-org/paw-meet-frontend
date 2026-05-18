"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMascotasStore, usePetTypesStore } from "@/stores";

export default function NuevaOEditarMascotaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEditing = id && id !== "nuevo";

  const {
    mascotas,
    isLoading,
    error,
    createMascota,
    updateMascota,
    deleteMascota,
    clearError,
  } = useMascotasStore();
  const { tipos, isLoading: isLoadingTipos, error: tiposError, fetchTipos } = usePetTypesStore();
  const [formError, setFormError] = useState<string | null>(null);

  const currentMascota = isEditing ? mascotas.find((m) => m.id === id) : null;

  const petTypeOptions = useMemo(
    () =>
      tipos.filter((tipo) => {
        const idValue = String(tipo.id ?? "").trim();
        return idValue !== "";
      }),
    [tipos]
  );

  const selectedPetTypeValue = useMemo(() => {
    const current = String(currentMascota?.pet_type ?? "").trim();
    if (!current) return "";

    const match = tipos.find(
      (tipo) =>
        String(tipo.codigo ?? "").toLowerCase() === current.toLowerCase() ||
        String(tipo.nombre ?? "").toLowerCase() === current.toLowerCase() ||
        String(tipo.id ?? "") === current
    );

    return String(match?.id ?? current);
  }, [currentMascota?.pet_type, tipos]);

  useEffect(() => {
    if (tipos.length === 0) {
      void fetchTipos().catch(() => undefined);
    }
  }, [fetchTipos, tipos.length]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const rawPetType = String(formData.get("pet_type") ?? "").trim();
    const bio = String(formData.get("bio") ?? "");

    const selectedType = tipos.find(
      (tipo) =>
        String(tipo.codigo ?? "").toLowerCase() === rawPetType.toLowerCase() ||
        String(tipo.nombre ?? "").toLowerCase() === rawPetType.toLowerCase() ||
        String(tipo.id ?? "") === rawPetType
    );
    const pet_type = String(selectedType?.id ?? rawPetType);

    if (!name || !pet_type) {
      setFormError("El nombre y el tipo de mascota son requeridos");
      return;
    }

    if (petTypeOptions.length === 0) {
      setFormError("No hay tipos de mascota disponibles en este momento.");
      return;
    }

    try {
      if (isEditing && id) {
        await updateMascota(id, { name, pet_type, bio });
      } else {
        await createMascota({ name, pet_type, bio });
      }
      router.replace("/auth/mascotas");
    } catch (err) {
      setFormError(String(err));
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("¿Estás seguro de que quieres eliminar esta mascota?")) return;
    try {
      await deleteMascota(id);
      router.replace("/auth/mascotas");
    } catch (err) {
      setFormError(String(err));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-lg rounded-[2.5rem] border border-white/50 bg-white/80 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl shadow-inner">
            🐕
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {isEditing ? "Editar mascota" : "Nueva mascota"}
          </h1>
          <p className="mt-2 text-slate-500">Completa los datos de tu compañero</p>
        </div>

        {(error || formError) && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100">
            <span>⚠️</span>
            <p className="text-sm font-medium">{error || formError}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Nombre</label>
            <input
              type="text"
              name="name"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              defaultValue={currentMascota?.name ?? ""}
              placeholder="Ej. Toby"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Tipo de mascota</label>
            <select
              name="pet_type"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:bg-slate-100 disabled:text-slate-500"
              defaultValue={selectedPetTypeValue}
              required
              disabled={petTypeOptions.length === 0}
            >
              <option value="" disabled>
                {isLoadingTipos ? "Cargando tipos..." : "Selecciona un tipo de mascota"}
              </option>
              {petTypeOptions.map((tipo) => {
                const value = String(tipo.id ?? "").trim();
                if (!value) return null;
                return (
                  <option key={tipo.id ?? value} value={value}>
                    {tipo.codigo ?? tipo.nombre}
                  </option>
                );
              })}
            </select>
            {tiposError && petTypeOptions.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">
                No se pudo cargar el catálogo de tipos. Intenta de nuevo en unos segundos.
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Descripción o biografía</label>
            <textarea
              name="bio"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 resize-none"
              rows={4}
              placeholder="Cuéntanos un poco sobre tu mascota..."
              defaultValue={currentMascota?.bio ?? ""}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || petTypeOptions.length === 0}
            className="mt-6 w-full rounded-full bg-orange-500 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar perfil" : "Añadir mascota"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row border-t border-slate-100 pt-6">
          <Link
            href="/auth/mascotas"
            className="flex-1 rounded-full border-2 border-slate-200 bg-white px-4 py-3 text-center font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            Cancelar
          </Link>
          {isEditing && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 rounded-full bg-red-50 px-4 py-3 font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
            >
              {isLoading ? "Eliminando..." : "Eliminar mascota"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
