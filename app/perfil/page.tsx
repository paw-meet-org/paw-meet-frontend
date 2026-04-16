"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await updateProfile({
      username: String(formData.get("username") ?? ""),
      first_name: String(formData.get("first_name") ?? ""),
      last_name: String(formData.get("last_name") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      ciudad: String(formData.get("ciudad") ?? ""),
      phone: String(formData.get("phone") ?? ""),
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

        <form className="space-y-4" onSubmit={onSubmit} key={user?.id ?? "profile-form"}>
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
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
              name="username"
              defaultValue={user?.username ?? ""}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-blue-800">Nombre</span>
              <input
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
                name="first_name"
                defaultValue={user?.first_name ?? ""}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-blue-800">Apellidos</span>
              <input
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
                name="last_name"
                defaultValue={user?.last_name ?? ""}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blue-800">Biografia</span>
            <textarea
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
              rows={4}
              name="bio"
              defaultValue={user?.bio ?? ""}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-blue-800">Ciudad</span>
              <input
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
                name="ciudad"
                defaultValue={user?.ciudad ?? ""}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-blue-800">Telefono</span>
              <input
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
                name="phone"
                defaultValue={user?.phone ?? ""}
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

