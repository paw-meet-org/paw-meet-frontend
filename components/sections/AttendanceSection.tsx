import Link from "next/link";
import type { Attendance } from "@/api";

export function AttendanceSection({ asistencia }: { asistencia: Attendance }) {
  const statusColors: Record<string, string> = {
    'CONFIRMED': 'bg-green-100 text-green-800',
    'confirmed': 'bg-green-100 text-green-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'cancelled': 'bg-red-100 text-red-800',
    'attended': 'bg-blue-100 text-blue-800',
    'no_show': 'bg-slate-100 text-slate-600',
  };
  
  const statusText: Record<string, string> = {
    'CONFIRMED': 'Confirmada',
    'confirmed': 'Confirmada',
    'PENDING': 'Pendiente',
    'pending': 'Pendiente',
    'CANCELLED': 'Cancelada',
    'cancelled': 'Cancelada',
    'attended': 'Ha asistido',
    'no_show': 'No ha asistido',
  };

  return (
    <>
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl shadow-inner">
            🗓️
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 line-clamp-1">Encuentro #{asistencia.meeting}</h3>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold mt-2 ${statusColors[asistencia.status ?? 'pending'] ?? 'bg-slate-100 text-slate-600'}`}>
              {statusText[asistencia.status ?? 'pending'] ?? asistencia.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          href={`/auth/asistencias/${asistencia.id}`}
          className="flex items-center gap-2 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
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
