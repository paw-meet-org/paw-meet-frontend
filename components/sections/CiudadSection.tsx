import Link from "next/link";
import type { City } from "@/api";

export function CiudadSection({ ciudad }: { ciudad: City }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition-transform group-hover:scale-150"></div>

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl shadow-inner">
            🏙️
          </div>
          <div>
            <h3 className="line-clamp-1 text-xl font-bold text-slate-800">{ciudad.name}</h3>
            <span className="mt-1 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Ciudad #{ciudad.id}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          href={`/auth/ciudades/${ciudad.id}`}
          className="flex items-center gap-2 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
        >
          Administrar
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

