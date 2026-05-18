"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminStore } from "@/stores";
import { useUserRole } from "@/lib/use-user-role";

export default function CiudadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEditing = id && id !== "nuevo";

  const { ciudades, isLoading, error, createCiudad, updateCiudad, deleteCiudad, clearError } = useAdminStore();
  const { isAdmin } = useUserRole();
  const [formError, setFormError] = useState<string | null>(null);

  const current = isEditing ? ciudades.find((c) => String(c.id) === id) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAdmin) {
      setFormError("No tienes permisos para modificar ciudades");
      return;
    }
    setFormError(null);
    clearError();

    const formData = new FormData(e.currentTarget);
    const payload = { name: String(formData.get("name") ?? "") };

    try {
      if (isEditing && id) {
        await updateCiudad(id, payload);
      } else {
        await createCiudad(payload);
      }
      router.replace("/auth/ciudades");
    } catch (err) {
      setFormError(String(err));
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-blue-950">
      <main className="mx-auto w-full max-w-md rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h1 className="text-2xl font-bold text-blue-900">{isEditing ? "Editar" : "Nueva"} ciudad</h1>

        {(error || formError) && (
          <div className="mt-4 rounded-md bg-orange-100 px-3 py-2 text-sm text-orange-800">
            {error || formError}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blue-800">Nombre</span>
            <input
              type="text"
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2"
              name="name"
              defaultValue={current?.name ?? ""}
              required
            />
          </label>

          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white disabled:opacity-60">
            {isLoading ? "Guardando..." : !isAdmin ? "Solo lectura" : isEditing ? "Actualizar" : "Crear"}
          </button>
        </form>

        <div className="mt-4 flex gap-2">
          <Link href="/auth/ciudades" className="flex-1 rounded-lg border border-blue-300 bg-white px-4 py-2 text-center font-semibold text-blue-800">
            Cancelar
          </Link>
          {isEditing && isAdmin && (
            <button onClick={() => id && deleteCiudad(id).then(() => router.replace("/auth/ciudades"))} disabled={isLoading} className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white disabled:opacity-60">
              Eliminar
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
