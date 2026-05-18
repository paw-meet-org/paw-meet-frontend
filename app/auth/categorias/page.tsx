"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSocialStore } from "@/stores";
import { CategoriaSection } from "@/components/sections/CategoriaSection";
import { useUserRole } from "@/lib/use-user-role";

export default function CategoriasPage() {
  const { categorias, isLoading, fetchCategorias } = useSocialStore();
  const { isAdmin } = useUserRole();

  useEffect(() => {
    void fetchCategorias();
  }, [fetchCategorias]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Categorías</h1>
            <p className="mt-2 text-slate-600">Explora y gestiona las categorías de la comunidad</p>
          </div>
          {isAdmin ? (
            <Link 
              href="/auth/categorias/nuevo" 
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-slate-800"
            >
              <span>+</span> Nueva categoría
            </Link>
          ) : null}
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
            <p className="mt-4 font-medium text-slate-500">Cargando categorías...</p>
          </div>
        ) : categorias.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-5xl">
              📂
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Aún no hay categorías</h2>
            <p className="mt-2 max-w-md text-slate-500">
              Vuelve más tarde para ver nuevas categorías o contacta con un administrador.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((cat) => (
              <div key={cat.id} className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition-transform group-hover:scale-150"></div>
                <CategoriaSection categoria={cat} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
