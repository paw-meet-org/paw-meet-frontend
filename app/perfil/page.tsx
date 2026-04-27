"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";

export default function PerfilPage() {
  const router = useRouter();
  const {
    token,
    user,
    isLoading,
    hasHydrated,
    error,
    fetchProfile,
    updateProfile,
    logout,
  } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token) {
      router.replace("/login");
      return;
    }

    void fetchProfile();
  }, [fetchProfile, hasHydrated, router, token]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await updateProfile({
      nombre: String(formData.get("nombre") ?? ""),
      biografia: String(formData.get("biografia") ?? ""),
    });
  }

  function onLogout() {
    logout();
    router.replace("/login");
  }

  if (!hasHydrated) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-blue-950">
      <main className="mx-auto w-full max-w-2xl rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-blue-900">Tu perfil</h1>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-blue-800"
          >
            Cerrar sesion
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit} key={user?.username ?? "profile-form"}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blue-800">Email</span>
            <input
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2"
              value={user?.email ?? ""}
              disabled
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blue-800">Usuario</span>
            <input
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2"
              name="username"
              defaultValue={user?.username ?? ""}
              disabled
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blue-800">Nombre</span>
            <input
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
              name="nombre"
              defaultValue={user?.username ?? ""} 
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blue-800">Biografia</span>
            <textarea
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
              rows={4}
              name="biografia"
              defaultValue={user?.biography ?? ""}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-1">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-blue-800">Ciudad</span>
              <input
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
                name="ciudad"
                defaultValue={user?.ciudad ?? ""}
                disabled
              />
            </label>
          </div>

          {error ? (
            <p className="rounded-md bg-orange-100 px-3 py-2 text-sm text-orange-800">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </main>
    </div>
  );
}
