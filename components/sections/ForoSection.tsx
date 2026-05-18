import Link from "next/link";
import type { ForoDetail } from "@/lib/types/social";

export function ForoSection({ foro }: { foro: ForoDetail }) {
  return (
    <>
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl shadow-inner">
            💬
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{foro.titulo}</h3>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
              {foro.tipo_foro}
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          href={`/auth/foros/${foro.id}`}
          className="flex items-center gap-2 text-sm font-bold text-purple-600 transition-colors hover:text-purple-700"
        >
          Entrar al foro
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </>
  );
}
