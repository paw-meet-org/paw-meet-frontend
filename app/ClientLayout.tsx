"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Inicio", isPrivate: false },
  { href: "/registro", label: "Registro", isPrivate: false, hideWhenAuth: true },
  { href: "/login", label: "Login", isPrivate: false, hideWhenAuth: true },
  { href: "/perfil", label: "Perfil", isPrivate: true },
  { href: "/smoke", label: "Smoke", isPrivate: false },
];

export function Navigation() {
  const { isAuthenticated, hasHydrated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleNavItems = navItems.filter((item) => {
    // Si no estamos en cliente hidratado, mostramos por defecto las rutas públicas no exclusivas
    if (!mounted || !hasHydrated) return !item.isPrivate && !item.hideWhenAuth;
    if (item.isPrivate && !isAuthenticated) return false;
    if (item.hideWhenAuth && isAuthenticated) return false;
    return true;
  });

  return (
    <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
      <Link href="/" className="text-lg font-bold text-blue-900">
        Paw Meet
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        {visibleNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-800 transition hover:bg-blue-50"
          >
            {item.label}
          </Link>
        ))}
        {mounted && hasHydrated && isAuthenticated && (
            <button
              onClick={() => logout()}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-800 transition hover:bg-red-100"
            >
              Cerrar sesión
            </button>
        )}
      </div>
    </nav>
  );
}
