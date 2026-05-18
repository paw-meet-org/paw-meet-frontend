"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import type { PublicacionList } from "@/api";
import { useSocialStore } from "@/stores";

/**
 * Página de detalle de publicación sin contexto de foro.
 * Busca la publicación en todos los foros y redirige al detalle con contexto.
 */
export default function PublicacionPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const { foros, isLoading, fetchForos } = useSocialStore();

  useEffect(() => {
    if (foros.length === 0) void fetchForos();
  }, [foros.length, fetchForos]);

  // Buscar la publicación en todos los foros para obtener el foroId
  let foroId: string | null = null;
  for (const foro of foros) {
    if (foro.publicaciones.some((p: PublicacionList) => String(p.id) === id)) {
      foroId = String(foro.id);
      break;
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
          <p className="mt-4 font-medium text-slate-500">Buscando publicación...</p>
        </div>
      </div>
    );
  }

  if (foroId) {
    // Redirigir al detalle en contexto del foro
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 gap-6">
        <p className="text-slate-600 font-medium">Redirigiendo a la publicación...</p>
        <Link
          href={`/auth/foros/${foroId}/publicaciones/${id}`}
          className="rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600"
        >
          Ver publicación en su foro →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-5xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
          <div className="mb-6 flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-slate-50 text-5xl">
            🔍
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Publicación no encontrada</h1>
          <p className="mt-2 text-slate-500">
            Las publicaciones se encuentran dentro de sus foros correspondientes.
          </p>
          <Link
            href="/auth/foros"
            className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600"
          >
            Explorar foros
          </Link>
        </div>
      </main>
    </div>
  );
}
