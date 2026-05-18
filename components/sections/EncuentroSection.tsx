import Link from "next/link";
import type { MeetingDetail } from "@/api";

export function EncuentroSection({ encuentro }: { encuentro: MeetingDetail }) {
  return (
    <>
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl shadow-inner">
            📍
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{encuentro.title}</h3>
            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                📅 {encuentro.date ? new Date(encuentro.date).toLocaleDateString() : "Fecha por definir"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-5 mb-2 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 w-full">
        <span className="text-slate-400">🗺️</span>
        <span className="truncate font-medium">{encuentro.location || "Ubicación por definir"}</span>
      </div>
      
      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          href={`/auth/encuentros/${encuentro.id}`}
          className="flex items-center gap-2 text-sm font-bold text-green-600 transition-colors hover:text-green-700"
        >
          Ver detalles
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </>
  );
}

