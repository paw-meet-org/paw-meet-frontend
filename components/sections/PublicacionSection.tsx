import Link from "next/link";
import type { PublicacionDetail, PublicacionList } from "@/api";

export function PublicacionSection({ 
  publicacion, 
  foroId 
}: { 
  publicacion: PublicacionDetail | PublicacionList; 
  foroId?: string;
}) {
  // Verificar si es un PublicacionDetail (tiene texto)
  const isDetail = "texto" in publicacion;
  const texto = isDetail ? (publicacion as PublicacionDetail).texto : undefined;

  // Si es PublicacionList, no tenemos foroId. Esto no debería pasar en el flujo normal
  // pero lo dejamos como fallback para compatibilidad
  if (!foroId) {
    return (
      <>
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl shadow-inner">
              📝
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{publicacion.titulo}</h3>
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mt-1">
                Publicación #{publicacion.id}
              </span>
            </div>
          </div>
        </div>
        
        {texto && (
          <p className="relative z-10 mt-4 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {texto}
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl shadow-inner">
            📝
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{publicacion.titulo}</h3>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mt-1">
              Publicación #{publicacion.id}
            </span>
          </div>
        </div>
      </div>
      
      {texto && (
        <p className="relative z-10 mt-4 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {texto}
        </p>
      )}
      
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          href={`/auth/foros/${foroId}/publicaciones/${publicacion.id}`}
          className="flex items-center gap-2 text-sm font-bold text-orange-500 transition-colors hover:text-orange-600"
        >
          Leer más
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </>
  );
}
