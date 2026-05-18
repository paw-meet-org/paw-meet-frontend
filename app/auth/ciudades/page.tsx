"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAdminStore } from "@/stores";
import { useUserRole } from "@/lib/use-user-role";
import { CiudadSection } from "@/components/sections/CiudadSection";

export default function CiudadesPage() {
  const { ciudades, isLoading, error, fetchCiudades, clearError } = useAdminStore();
  const { isAdmin } = useUserRole();

  useEffect(() => {
    void fetchCiudades();
  }, [fetchCiudades]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Ciudades</h1>
            <p className="mt-2 text-slate-600">Administra las ciudades disponibles en la plataforma</p>
          </div>
          {isAdmin ? (
            <Link
              href="/auth/ciudades/nuevo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-slate-800"
            >
              <span>+</span> Añadir ciudad
            </Link>
          ) : null}
        </div>

        {error && (
          <div className="mb-8 flex items-center justify-between rounded-2xl bg-red-50 p-4 text-red-800 border border-red-100 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="rounded-full bg-white/50 px-4 py-1.5 text-sm font-bold transition-colors hover:bg-white"
            >
              Descartar
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
            <p className="mt-4 font-medium text-slate-500">Cargando ciudades...</p>
          </div>
        ) : ciudades.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-5xl">
              🗺️
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No hay ciudades</h2>
            <p className="mt-2 max-w-md text-slate-500">
              Añade la primera ciudad para que los usuarios puedan organizar encuentros.
            </p>
            {isAdmin && (
              <Link
                href="/auth/ciudades/nuevo"
                className="mt-8 rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600"
              >
                Añadir primera ciudad
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ciudades.map((ciudad) => (
              <CiudadSection key={ciudad.id} ciudad={ciudad} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
