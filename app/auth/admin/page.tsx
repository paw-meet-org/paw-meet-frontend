"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAdminStore } from "@/stores";
import { AdminUserSection } from "@/components/sections/AdminUserSection";

export default function AdminPage() {
  const { usuarios, isLoading, fetchUsuarios } = useAdminStore();

  useEffect(() => {
    void fetchUsuarios();
  }, [fetchUsuarios]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Administración</h1>
            <p className="mt-2 text-slate-600">Gestiona los usuarios de la plataforma</p>
          </div>
          <Link
            href="/auth/admin/nuevo"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-slate-800"
          >
            <span>+</span> Nuevo usuario
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
            <p className="mt-4 font-medium text-slate-500">Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-5xl">
              👥
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No hay usuarios</h2>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-bold">Usuario</th>
                    <th scope="col" className="px-6 py-4 font-bold">Email</th>
                    <th scope="col" className="px-6 py-4 font-bold">Rol</th>
                    <th scope="col" className="px-6 py-4 text-right font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map((user) => (
                    <AdminUserSection key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
