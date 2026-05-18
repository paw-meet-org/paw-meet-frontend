"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSocialStore } from "@/stores";
import { PublicacionSection } from "@/components/sections/PublicacionSection";

export default function PublicacionesPage() {
  const { foros, isLoading, fetchForos } = useSocialStore();

  // Todas las publicaciones con su foroId
  const allPublicaciones = foros.flatMap((foro) =>
    foro.publicaciones.map((pub) => ({ ...pub, foroId: String(foro.id), foroTitulo: foro.titulo }))
  );

  useEffect(() => {
    void fetchForos();
  }, [fetchForos]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Publicaciones</h1>
            <p className="mt-2 text-slate-600">Resumen de las últimas publicaciones de todos los foros</p>
          </div>
          <Link
            href="/auth/foros"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-slate-800"
          >
            💬 Ver foros
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
            <p className="mt-4 font-medium text-slate-500">Cargando publicaciones...</p>
          </div>
        ) : allPublicaciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-5xl">
              📝
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Aún no hay publicaciones</h2>
            <p className="mt-2 max-w-md text-slate-500">
              Las publicaciones se crean dentro de cada foro. ¡Explora los foros y participa!
            </p>
            <Link
              href="/auth/foros"
              className="mt-8 rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600"
            >
              Explorar foros
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {allPublicaciones.map((pub) => (
              <div key={pub.id} className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-orange-500/5 blur-2xl transition-transform group-hover:scale-150"></div>
                <div className="relative z-10 mb-3">
                  <Link
                    href={`/auth/foros/${pub.foroId}`}
                    className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                  >
                    💬 {pub.foroTitulo}
                  </Link>
                </div>
                <PublicacionSection publicacion={pub} foroId={pub.foroId} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

