import Link from "next/link";
import type { UserProfile } from "@/api";

export function AdminUserSection({ user }: { user: UserProfile }) {
  return (
    <tr className="transition-colors hover:bg-slate-50 group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
            {user.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="font-semibold text-slate-800">{user.username}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600">{user.email}</td>
      <td className="px-6 py-4">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
          String(user.role).toLowerCase() === 'admin' 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-slate-100 text-slate-600'
        }`}>
          {user.role || "User"}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <Link 
          href={`/auth/admin/${user.id}`} 
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700 opacity-0 group-hover:opacity-100"
        >
          Editar
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </Link>
      </td>
    </tr>
  );
}
