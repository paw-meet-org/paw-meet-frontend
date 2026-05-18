"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useEncuentrosStore } from "@/stores";
import { EncuentroSection } from "@/components/sections/EncuentroSection";

export default function EncuentrosPage() {
  const { encuentros, isLoading, error, fetchEncuentros, clearError } = useEncuentrosStore();

  useEffect(() => {
    void fetchEncuentros();
  }, [fetchEncuentros]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Encuentros</h1>
            <p className="mt-2 text-slate-600">Descubre y organiza quedadas con otras mascotas</p>
          </div>
          <Link
            href="/auth/encuentros/nuevo"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-slate-800"
          >
            <span>+</span> Nuevo encuentro
          </Link>
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
            <p className="mt-4 font-medium text-slate-500">Cargando encuentros...</p>
          </div>
        ) : encuentros.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-5xl">
              🏕️
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Aún no hay encuentros</h2>
            <p className="mt-2 max-w-md text-slate-500">
              Anímate y organiza el primer encuentro para que las mascotas de tu zona puedan socializar.
            </p>
            <Link
              href="/auth/encuentros/nuevo"
              className="mt-8 rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600"
            >
              Crear primer encuentro
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {encuentros.map((encuentro) => (
              <div
                key={encuentro.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-green-200"
              >
                <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-green-500/10 blur-2xl transition-transform group-hover:scale-110"></div>
                <EncuentroSection encuentro={encuentro} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
