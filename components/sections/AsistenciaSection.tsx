import type { Attendance } from "@/api";

export function AsistenciaSection({
  asistencia,
}: {
  asistencia: Attendance | (Omit<Attendance, 'id'> & { id: number });
}) {
  const isCreator = asistencia.id === -1;
  
  return (
    <>
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl shadow-inner">
            {isCreator ? "👑" : "👤"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 line-clamp-1">
              {asistencia.user_name || `Usuario #${asistencia.id}`}
            </h3>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mt-1">
              {asistencia.status || "confirmado"}
            </span>
          </div>
        </div>
      </div>

      {asistencia.created_at && (
        <p className="relative z-10 mt-4 text-sm text-slate-600 leading-relaxed">
          {isCreator ? "Creador del encuentro" : `Se unió el ${new Date(asistencia.created_at).toLocaleDateString()}`}
        </p>
      )}
    </>
  );
}

