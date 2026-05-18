import Link from "next/link";
import type { MeetingDetail } from "@/api";

export function EncuentroSection({ encuentro }: { encuentro: MeetingDetail }) {
  return (
    <div className="relative z-10 flex h-full flex-col">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-2xl">
          📍
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-slate-800">{encuentro.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
            {encuentro.description || "Sin descripción proporcionada."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-slate-600">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <span>📅</span>
          <span>{encuentro.date ? new Date(encuentro.date).toLocaleDateString() : "Fecha por definir"}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <span>⏰</span>
          <span>
            {encuentro.start_time || "--:--"} - {encuentro.end_time || "--:--"}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <span>👤</span>
          <span className="truncate">{encuentro.creator_name || "Organizador anónimo"}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-sm text-slate-700">
        <span className="text-base text-slate-400">🗺️</span>
        <span className="truncate font-medium">{encuentro.location || "Ubicación por definir"}</span>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <Link
          href={`/auth/encuentros/${encuentro.id}`}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-50 px-5 py-2.5 text-sm font-bold text-green-700 transition-colors hover:bg-green-100"
        >
          Ver detalles del encuentro
          <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

