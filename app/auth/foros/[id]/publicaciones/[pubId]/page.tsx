"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useSocialStore } from "@/stores";
import { useCurrentUser } from "@/lib/use-current-user";
import type { PublicacionList } from "@/api";

export default function PublicacionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const foroId = params?.id as string;
  const pubId = params?.pubId as string;

  const { foros, categorias, isLoading, error, fetchForos, fetchCategorias, updatePublicacion, deletePublicacion, clearError } = useSocialStore();
  const { user, isAdmin } = useCurrentUser();
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const foro = foros.find((f) => String(f.id) === foroId);
  const publicacion = foro?.publicaciones.find((p: PublicacionList) => String(p.id) === pubId) as PublicacionList | undefined;
  const isOwner = publicacion && "usuario_detail" in publicacion
    ? String((publicacion.usuario_detail as unknown as { id?: string })?.id ?? "") === String(user?.id ?? "")
    : false;
  const canEdit = isAdmin || isOwner;

  useEffect(() => {
    const load = async () => {
      if (foros.length === 0) await fetchForos();
      if (categorias.length === 0) await fetchCategorias();
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!publicacion) return;
    setFormError(null);
    clearError();
    const formData = new FormData(event.currentTarget);
    const payload = {
      titulo: String(formData.get("titulo") ?? "").trim(),
      texto: String(formData.get("texto") ?? ""),
      foro_id: Number(foroId),
      categoria_id: Number(formData.get("categoria_id") ?? categorias[0]?.id ?? 1),
    };
    try {
      await updatePublicacion(pubId, payload);
      setIsEditing(false);
    } catch (err) {
      setFormError(String(err));
    }
  };

  const onDelete = async () => {
    if (!publicacion) return;
    if (!confirm("¿Eliminar esta publicación?")) return;
    try {
      await deletePublicacion(pubId);
      router.replace(`/auth/foros/${foroId}`);
    } catch (err) {
      setFormError(String(err));
    }
  };

  if (!foro || !publicacion) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <main className="mx-auto w-full max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Publicación no encontrada</h1>
            <Link
              href={`/auth/foros/${foroId}`}
              className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 font-bold text-white"
            >
              Volver al foro
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const pubDetail = publicacion as unknown as { texto?: string; categoria?: { id: number; nombre: string } };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Foros", href: "/auth/foros" },
            { label: foro.titulo, href: `/auth/foros/${foroId}` },
            { label: publicacion.titulo },
          ]}
        />

        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
          <Link href={`/auth/foros/${foroId}`} className="mb-6 inline-block text-sm font-semibold text-slate-500 hover:text-slate-800">
            ← Volver al foro
          </Link>

          {(error || formError) && (
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100">
              <span>⚠️</span>
              <p className="text-sm font-medium">{error || formError}</p>
            </div>
          )}

          {isEditing && canEdit ? (
            <form className="space-y-4" onSubmit={onUpdate}>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Título</label>
                <input
                  name="titulo"
                  defaultValue={publicacion.titulo}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Categoría</label>
                <select
                  name="categoria_id"
                  defaultValue={pubDetail.categoria?.id ?? categorias[0]?.id ?? 1}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                >
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Contenido</label>
                <textarea
                  name="texto"
                  rows={6}
                  defaultValue={pubDetail.texto ?? ""}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-full bg-orange-500 px-4 py-2 font-bold text-white transition-transform hover:bg-orange-600 disabled:opacity-60"
                >
                  {isLoading ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full bg-slate-100 px-6 py-2 font-bold text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-extrabold text-slate-900">{publicacion.titulo}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>Publicación #{publicacion.id}</span>
                    {publicacion.likes !== undefined && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">❤️ <span className="font-semibold text-slate-700">{publicacion.likes} likes</span></span>
                      </>
                    )}
                    {pubDetail.categoria && (
                      <>
                        <span>•</span>
                        <span className="rounded-full bg-orange-100 px-3 py-0.5 font-semibold text-orange-700">{pubDetail.categoria.nombre}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {canEdit && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-700 transition-colors hover:bg-slate-200"
                    >
                      Editar
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={onDelete}
                      disabled={isLoading}
                      className="rounded-full bg-red-50 px-4 py-2 font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
                    >
                      {isLoading ? "Eliminando..." : "Eliminar"}
                    </button>
                  )}
                </div>
              </div>

              {pubDetail.texto ? (
                <div className="mt-6 rounded-2xl bg-slate-50 p-6">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-slate-700">{pubDetail.texto}</p>
                </div>
              ) : (
                <p className="mt-6 text-slate-500 italic">Esta publicación no tiene contenido visible.</p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}



