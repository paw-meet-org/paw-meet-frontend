"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PublicacionList } from "@/api";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useSocialStore } from "@/stores";
import { useCurrentUser } from "@/lib/use-current-user";
import { PublicacionSection } from "@/components/sections/PublicacionSection";

export default function ForoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const foroId = params?.id as string;

  const { foros, isLoading, error, fetchForos, fetchForo } = useSocialStore();
  const { user, isAdmin } = useCurrentUser();
  const [isEditingForo, setIsEditingForo] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isForoLoading, setIsForoLoading] = useState(true);

  const foro = foros.find((f) => String(f.id) === foroId);
  const isOwner = !foro || String(foro?.usuario?.id ?? "") === String(user?.id ?? "");
  const canEditForo = isAdmin || isOwner;

  useEffect(() => {
    let isMounted = true;

    const loadForo = async () => {
      if (!foroId) {
        if (isMounted) setIsForoLoading(false);
        return;
      }

      try {
        await fetchForo(foroId);
      } catch {
        // Fallback: mantiene compatibilidad con el flujo previo si falla el detalle.
        await fetchForos();
      } finally {
        if (isMounted) setIsForoLoading(false);
      }
    };

    void loadForo();

    return () => {
      isMounted = false;
    };
  }, [foroId, fetchForo, fetchForos]);

  const onUpdateForo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEditForo || !foro) {
      setFormError("No puedes editar este foro");
      return;
    }
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      titulo: String(formData.get("titulo") ?? "").trim(),
      tipo_foro: String(formData.get("tipo_foro") ?? "general"),
      encuentro: formData.get("encuentro") ? Number(formData.get("encuentro")) : null,
    };

    try {
      const { updateForo } = useSocialStore.getState();
      await updateForo(String(foro.id), payload);
      setIsEditingForo(false);
    } catch (err) {
      setFormError(String(err));
    }
  };

  const onDeleteForo = async () => {
    if (!foro) return;
    if (!confirm("¿Eliminar foro y todas sus publicaciones?")) return;
    try {
      const { deleteForo } = useSocialStore.getState();
      await deleteForo(String(foro.id));
      router.replace("/auth/foros");
    } catch (err) {
      setFormError(String(err));
    }
  };

  if ((isLoading || isForoLoading) && !foro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-purple-500"></div>
          <p className="mt-4 font-medium text-slate-500">Cargando foro...</p>
        </div>
      </div>
    );
  }

  if (!foro) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <main className="mx-auto w-full max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Foro no encontrado</h1>
            <Link href="/auth/foros" className="mt-6 inline-block rounded-full bg-purple-600 px-6 py-3 font-bold text-white">
              Volver a foros
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Foros", href: "/auth/foros" },
            { label: foro.titulo },
          ]}
        />

        {/* Header del Foro */}
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900">{foro.titulo}</h1>
              <p className="mt-2 text-slate-500">
                Creado por <span className="font-semibold text-slate-700">{foro.usuario.full_name || foro.usuario.username}</span>
              </p>
              <span className="mt-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700 uppercase tracking-wide">
                {foro.tipo_foro}
              </span>
            </div>
            {canEditForo && (
              <button
                onClick={() => setIsEditingForo(!isEditingForo)}
                className="rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-700 transition-colors hover:bg-slate-200"
              >
                {isEditingForo ? "Cancelar" : "Editar foro"}
              </button>
            )}
          </div>

          {isEditingForo && canEditForo && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              {(error || formError) && (
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100">
                  <span>⚠️</span>
                  <p className="text-sm font-medium">{error || formError}</p>
                </div>
              )}
              <form className="space-y-4" onSubmit={onUpdateForo}>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Título</label>
                  <input
                    name="titulo"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                    defaultValue={foro.titulo}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Tipo de foro</label>
                  <input
                    name="tipo_foro"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                    defaultValue={foro.tipo_foro}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 rounded-full bg-purple-600 px-4 py-2 font-bold text-white transition-transform hover:bg-purple-700 disabled:opacity-60"
                  >
                    {isLoading ? "Guardando..." : "Guardar cambios"}
                  </button>
                  {canEditForo && (
                    <button
                      type="button"
                      onClick={onDeleteForo}
                      disabled={isLoading}
                      className="rounded-full bg-red-50 px-6 py-2 font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
                    >
                      {isLoading ? "Eliminando..." : "Eliminar foro"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Publicaciones del Foro */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Publicaciones ({(foro.publicaciones ?? []).length})</h2>
              <p className="mt-2 text-slate-500">Discusiones y contenido compartido en este foro</p>
            </div>
            <Link
              href={`/auth/foros/${foroId}/publicaciones/nuevo`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-105 hover:bg-orange-600"
            >
              <span>+</span> Nueva publicación
            </Link>
          </div>

          {(foro.publicaciones ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-5xl">
                📝
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Aún no hay publicaciones</h3>
              <p className="mt-2 max-w-md text-slate-500">
                Sé el primero en compartir una publicación en este foro.
              </p>
              <Link
                href={`/auth/foros/${foroId}/publicaciones/nuevo`}
                className="mt-8 rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600"
              >
                Crear publicación
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {(foro.publicaciones ?? []).map((pub: PublicacionList) => (
                <div key={pub.id} className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-orange-500/5 blur-2xl transition-transform group-hover:scale-150"></div>
                  <PublicacionSection publicacion={pub} foroId={foroId} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Volver */}
        <div className="flex justify-center">
          <Link
            href="/auth/foros"
            className="rounded-full border-2 border-slate-200 bg-white px-8 py-3 font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            ← Volver a foros
          </Link>
        </div>
      </main>
    </div>
  );
}
