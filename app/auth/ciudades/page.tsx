"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAdminStore } from "@/stores";
import type { City } from "@/api";
import { useUserRole } from "@/lib/use-user-role";

function CiudadSection({ ciudad }: { ciudad: City }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition-transform group-hover:scale-150"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl shadow-inner">
            🏙️
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{ciudad.name}</h3>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mt-1">
              Ciudad #{ciudad.id}
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          href={`/auth/ciudades/${ciudad.id}`}
          className="flex items-center gap-2 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
        >
          Administrar
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

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
