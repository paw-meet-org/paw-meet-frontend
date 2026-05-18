"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSocialStore } from "@/stores";
import { ForoSection } from "@/components/sections/ForoSection";

export default function ForosPage() {
  const { foros, isLoading, fetchForos } = useSocialStore();

  useEffect(() => {
    void fetchForos();
  }, [fetchForos]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Foros</h1>
            <p className="mt-2 text-slate-600">Únete a las conversaciones y comparte con la comunidad</p>
          </div>
          <Link
            href="/auth/foros/nuevo"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-slate-800"
          >
            <span>+</span> Nuevo foro
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
            <p className="mt-4 font-medium text-slate-500">Cargando foros...</p>
          </div>
        ) : foros.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-5xl">
              💬
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Aún no hay foros</h2>
            <p className="mt-2 max-w-md text-slate-500">
              Sé el primero en crear un espacio para debatir temas interesantes sobre mascotas.
            </p>
            <Link
              href="/auth/foros/nuevo"
              className="mt-8 rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600"
            >
              Crear primer foro
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {foros.map((foro) => (
              <div key={foro.id} className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl transition-transform group-hover:scale-150"></div>
                <ForoSection foro={foro} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
