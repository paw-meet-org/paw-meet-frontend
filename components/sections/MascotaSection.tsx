import Link from "next/link";
import type { Pet } from "@/api";

export function MascotaSection({ mascota, labelTipo }: { mascota: Pet; labelTipo: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl transition-transform group-hover:scale-150"></div>

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl shadow-inner">
            🐕
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{mascota.name}</h3>
            <span className="mt-1 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {labelTipo}
            </span>
          </div>
        </div>
      </div>

      {mascota.bio && (
        <p className="relative z-10 mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {mascota.bio}
        </p>
      )}

      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          href={`/auth/mascotas/${mascota.id}`}
          className="flex items-center gap-2 text-sm font-bold text-orange-500 transition-colors hover:text-orange-600"
        >
          Ver detalles
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

