"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSocialStore } from "@/stores";
import { useUserRole } from "@/lib/use-user-role";

export default function CategoriaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEditing = id && id !== "nuevo";

  const { categorias, isLoading, error, createCategoria, updateCategoria, deleteCategoria, clearError } = useSocialStore();
  const { isAdmin } = useUserRole();
  const [formError, setFormError] = useState<string | null>(null);
  const current = isEditing ? categorias.find((c) => String(c.id) === id) : null;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin) {
      setFormError("No tienes permisos para modificar categorías");
      return;
    }
    setFormError(null);
    clearError();

    const formData = new FormData(event.currentTarget);
    const payload = { nombre: String(formData.get("nombre") ?? "").trim() };

    try {
      if (isEditing && id) {
        await updateCategoria(id, payload);
      } else {
        await createCategoria(payload);
      }
      router.replace("/auth/categorias");
    } catch (err) {
      setFormError(String(err));
    }
  };

  const onDelete = async () => {
    if (!id) return;
    if (!confirm("¿Eliminar categoría?")) return;
    try {
      await deleteCategoria(id);
      router.replace("/auth/categorias");
    } catch (err) {
      setFormError(String(err));
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-blue-950">
      <main className="mx-auto w-full max-w-md rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h1 className="text-2xl font-bold text-blue-900">{isEditing ? "Editar" : "Nueva"} categoría</h1>
        {(error || formError) && <p className="mt-4 rounded-md bg-orange-100 px-3 py-2 text-sm text-orange-800">{error || formError}</p>}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block"><span className="mb-1 block text-sm font-medium text-blue-800">Nombre</span><input name="nombre" defaultValue={current?.nombre ?? ""} className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2" required /></label>
          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white disabled:opacity-60">{isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}</button>
        </form>

        <div className="mt-4 flex gap-2">
          <Link href="/auth/categorias" className="flex-1 rounded-lg border border-blue-300 bg-white px-4 py-2 text-center font-semibold text-blue-800">Cancelar</Link>
          {isEditing && isAdmin && <button onClick={onDelete} className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white">Eliminar</button>}
        </div>
      </main>
    </div>
  );
}

