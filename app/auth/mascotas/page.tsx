"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useMascotasStore, usePetTypesStore } from "@/stores";
import type { PetType } from "@/api";
import { MascotaSection } from "@/components/sections/MascotaSection";

const PET_TYPE_FALLBACK_BY_ID: Record<string, string> = {
  "1": "PERRO",
  "2": "GATO",
  "3": "AVE",
  "4": "ROEDOR",
  "5": "REPTIL",
  "6": "OTRO",
};

const PET_TYPE_FALLBACK_BY_CODE: Record<string, string> = {
  perro: "PERRO",
  gato: "GATO",
  ave: "AVE",
  roedor: "ROEDOR",
  reptil: "REPTIL",
  otro: "OTRO",
};


export default function MascotasPage() {
  const { mascotas, isLoading, error, fetchMascotas, clearError } = useMascotasStore();
  const { tipos, fetchTipos } = usePetTypesStore();

  const getPetTypeLabel = (petTypeValue: string, availableTypes: PetType[]) => {
    const normalized = String(petTypeValue ?? "").trim();
    if (!normalized) return "Tipo desconocido";

    const normalizedLower = normalized.toLowerCase();

    const byCode = availableTypes.find(
      (t) => String(t.codigo ?? "").toLowerCase() === normalizedLower
    );
    if (byCode) return byCode.codigo ?? byCode.nombre ?? normalized;

    const byName = availableTypes.find(
      (t) => String(t.nombre ?? "").toLowerCase() === normalizedLower
    );
    if (byName) return byName.codigo ?? byName.nombre ?? normalized;

    const byId = availableTypes.find((t) => String(t.id ?? "") === normalized);
    if (byId) return byId.codigo ?? byId.nombre ?? normalized;

    const byFallbackId = PET_TYPE_FALLBACK_BY_ID[normalized];
    if (byFallbackId) return byFallbackId;

    const byFallbackCode = PET_TYPE_FALLBACK_BY_CODE[normalized.toLowerCase()];
    if (byFallbackCode) return byFallbackCode;

    // Si llega un UUID sin catálogo disponible, evitamos mostrar el ID crudo.
    const looksLikeUuid = /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(normalized);
    if (looksLikeUuid) {
      return "Tipo de mascota";
    }

    return normalized;
  };

  useEffect(() => {
    void fetchMascotas();
    void fetchTipos().catch(() => undefined);
  }, [fetchMascotas, fetchTipos]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Mis Mascotas</h1>
            <p className="mt-2 text-slate-600">Gestiona los perfiles de tus compañeros peludos</p>
          </div>
          <Link
            href="/auth/mascotas/nuevo"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-slate-800"
          >
            <span>+</span> Añadir mascota
          </Link>
        </div>

        {error && (
          <div className="mb-8 flex items-center justify-between rounded-2xl bg-red-50 p-4 text-red-800 border border-red-100 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="rounded-full bg-white/50 px-4 py-1.5 text-sm font-bold transition-colors hover:bg-white"
            >
              Descartar
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
            <p className="mt-4 font-medium text-slate-500">Cargando mascotas...</p>
          </div>
        ) : mascotas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-5xl">
              😿
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Aún no tienes mascotas</h2>
            <p className="mt-2 max-w-md text-slate-500">
              Crea el perfil de tu primera mascota para empezar a socializar y encontrar nuevos amigos.
            </p>
            <Link
              href="/auth/mascotas/nuevo"
              className="mt-8 rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600"
            >
              Crear primera mascota
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mascotas.map((mascota) => (
              <MascotaSection
                key={mascota.id}
                mascota={mascota}
                labelTipo={getPetTypeLabel(mascota.pet_type, tipos)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
