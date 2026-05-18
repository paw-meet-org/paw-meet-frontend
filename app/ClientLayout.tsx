"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserRole } from "@/lib/use-user-role";

const navItems: Array<{ href: string; label: string; isPrivate: boolean; adminOnly?: boolean; hideWhenAuth?: boolean }> = [
  { href: "/", label: "Inicio", isPrivate: false },
  { href: "/perfil", label: "Perfil", isPrivate: true },
  { href: "/auth/mascotas", label: "Mascotas", isPrivate: true },
  { href: "/auth/encuentros", label: "Encuentros", isPrivate: true },
  { href: "/auth/foros", label: "Foros", isPrivate: true },
  { href: "/auth/publicaciones", label: "Publicaciones", isPrivate: true },
  { href: "/auth/asistencias", label: "Asistencias", isPrivate: true },
  // Admin only
  { href: "/auth/admin", label: "Usuarios", isPrivate: true, adminOnly: true },
  { href: "/auth/ciudades", label: "Ciudades", isPrivate: true, adminOnly: true },
  { href: "/auth/categorias", label: "Categorías", isPrivate: true, adminOnly: true },
  { href: "/auth/tipos-mascotas", label: "Tipos Mascotas", isPrivate: true, adminOnly: true },
];

export function Navigation() {
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isAdmin } = useUserRole();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const visibleNavItems = useMemo(() => {
    return navItems.filter((item) => {
      if (item.isPrivate && !isAuthenticated) return false;
      if (item.adminOnly && !isAdmin) return false;
      return !item.hideWhenAuth || !isAuthenticated;
    });
  }, [isAdmin, isAuthenticated]);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl shadow-lg shadow-orange-500/30">
            🐾
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">
            Paw Meet
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-orange-50 hover:text-orange-600"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="rounded-full border-2 border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Cerrar sesión
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-5 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-slate-800"
              >
                Registro
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
