"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { usePetTypesStore } from "@/stores";
import { useUserRole } from "@/lib/use-user-role";

export default function TipoMascotaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEditing = id && id !== "nuevo";

  const { tipos, isLoading, error, createTipo, updateTipo, deleteTipo, clearError } = usePetTypesStore();
  const { isAdmin } = useUserRole();
  const [formError, setFormError] = useState<string | null>(null);
  const current = isEditing ? tipos.find((t) => String(t.id) === id) : null;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin) {
      setFormError("No tienes permisos para modificar tipos de mascota");
      return;
    }
    setFormError(null);
    clearError();

    const formData = new FormData(event.currentTarget);
    const payload = {
      nombre: String(formData.get("nombre") ?? "").trim(),
      codigo: String(formData.get("codigo") ?? "").trim(),
    };

    try {
      if (isEditing && id) {
        await updateTipo(id, payload);
      } else {
        await createTipo(payload);
      }
      router.replace("/auth/tipos-mascotas");
    } catch (err) {
      setFormError(String(err));
    }
  };

  const onDelete = async () => {
    if (!id) return;
    if (!confirm("¿Eliminar tipo?")) return;
    try {
      await deleteTipo(id);
      router.replace("/auth/tipos-mascotas");
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

      <main className="relative z-10 mx-auto w-full max-w-md rounded-[2.5rem] border border-white/50 bg-white/80 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl shadow-inner">
            🐕
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {isEditing ? "Editar tipo" : "Nuevo tipo"}
          </h1>
          <p className="mt-2 text-slate-500">
            Gestiona los tipos de mascotas del sistema
          </p>
        </div>

        {(error || formError) && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100">
            <span>⚠️</span>
            <p className="text-sm font-medium">{error || formError}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Nombre</label>
            <input
              name="nombre"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:opacity-70 disabled:bg-slate-100"
              defaultValue={current?.nombre ?? ""}
              placeholder="Ej. Perro, Gato..."
              required
              disabled={!isAdmin}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Código</label>
            <input
              name="codigo"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:opacity-70 disabled:bg-slate-100"
              defaultValue={current?.codigo ?? ""}
              placeholder="Ej. DOG, CAT..."
              required
              disabled={!isAdmin}
            />
          </div>

          {isAdmin && (
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-full bg-orange-500 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isLoading ? "Guardando..." : isEditing ? "Actualizar tipo" : "Crear tipo"}
            </button>
          )}
        </form>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row border-t border-slate-100 pt-6">
          <Link
            href="/auth/tipos-mascotas"
            className="flex-1 rounded-full border-2 border-slate-200 bg-white px-4 py-3 text-center font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            Volver
          </Link>
          {isEditing && isAdmin && (
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
