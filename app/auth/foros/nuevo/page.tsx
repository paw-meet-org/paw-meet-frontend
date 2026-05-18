"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useSocialStore } from "@/stores";

export default function NewForoPage() {
  const router = useRouter();
  const { isLoading, error, createForo, clearError } = useSocialStore();
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    clearError();

    const formData = new FormData(event.currentTarget);
    const payload = {
      titulo: String(formData.get("titulo") ?? "").trim(),
      tipo_foro: String(formData.get("tipo_foro") ?? "general").trim(),
      encuentro: null,
    };

    if (!payload.titulo) {
      setFormError("El título es obligatorio");
      return;
    }

    try {
      await createForo(payload);
      router.replace("/auth/foros");
    } catch (err) {
      setFormError(String(err));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-xl rounded-[2.5rem] border border-white/50 bg-white/80 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Foros", href: "/auth/foros" },
            { label: "Nuevo foro" },
          ]}
        />

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl shadow-inner">
            💬
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Crear foro</h1>
          <p className="mt-2 text-slate-500">Abre un nuevo espacio de conversación para la comunidad</p>
        </div>

        {(error || formError) && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-800">
            <span>⚠️</span>
            <p className="text-sm font-medium">{error || formError}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Título *</label>
            <input
              name="titulo"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
              placeholder="Ej. Quedadas de perros pequeños"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Tipo de foro *</label>
            <input
              name="tipo_foro"
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
              placeholder="general"
              defaultValue="general"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-full bg-purple-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-purple-600/30 transition-transform hover:-translate-y-1 hover:bg-purple-700 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isLoading ? "Creando..." : "Crear foro"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <Link
            href="/auth/foros"
            className="block w-full rounded-full border-2 border-slate-200 bg-white px-4 py-3 text-center font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            Cancelar
          </Link>
        </div>
      </main>
    </div>
  );
}

