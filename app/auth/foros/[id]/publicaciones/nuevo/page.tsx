"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useSocialStore } from "@/stores";

export default function NewPublicacionPage() {
  const router = useRouter();
  const params = useParams();
  const foroId = params?.id as string;

  const { categorias, isLoading, error, createPublicacion, fetchCategorias, clearError, fetchForos } = useSocialStore();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (categorias.length === 0) {
        await fetchCategorias();
      }
      await fetchForos();
    };
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    clearError();

    const formData = new FormData(event.currentTarget);
    const payload = {
      titulo: String(formData.get("titulo") ?? "").trim(),
      texto: String(formData.get("texto") ?? ""),
      foro_id: Number(foroId),
      categoria_id: Number(formData.get("categoria_id") ?? "1"),
    };

    try {
      await createPublicacion(payload);
      router.replace(`/auth/foros/${foroId}`);
    } catch (err) {
      setFormError(String(err));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-xl rounded-[2.5rem] border border-white/50 bg-white/80 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Foros", href: "/auth/foros" },
            { label: `Foro #${foroId}`, href: `/auth/foros/${foroId}` },
            { label: "Nueva publicación" },
          ]}
        />

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl shadow-inner">
            📝
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Nueva publicación</h1>
          <p className="mt-2 text-slate-500">Comparte tu aporte con la comunidad</p>
        </div>

        {(error || formError) && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100">
            <span>⚠️</span>
            <p className="text-sm font-medium">{error || formError}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Título</label>
            <input
              name="titulo"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              placeholder="Un título llamativo..."
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Categoría</label>
            <select
              name="categoria_id"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              defaultValue="1"
            >
              {categorias.length === 0 ? (
                <option value="1">Cargando categorías...</option>
              ) : (
                categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Contenido</label>
            <textarea
              name="texto"
              rows={6}
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 resize-none"
              placeholder="Escribe aquí tu publicación..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-full bg-orange-500 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isLoading ? "Publicando..." : "Publicar"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row border-t border-slate-100 pt-6">
          <Link
            href={`/auth/foros/${foroId}`}
            className="flex-1 rounded-full border-2 border-slate-200 bg-white px-4 py-3 text-center font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            Volver al foro
          </Link>
        </div>
      </main>
    </div>
  );
}
