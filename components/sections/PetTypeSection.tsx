import Link from "next/link";
import type { PetType } from "@/api";

export function PetTypeSection({ tipo }: { tipo: PetType }) {
  return (
    <>
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl shadow-inner">
            🐕
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{tipo.nombre ?? "Sin nombre"}</h3>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
              {tipo.codigo ?? "-"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          href={`/auth/tipos-mascotas/${tipo.id}`}
          className="flex items-center gap-2 text-sm font-bold text-orange-600 transition-colors hover:text-orange-700"
        >
          Administrar
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
    </>
  );
}
