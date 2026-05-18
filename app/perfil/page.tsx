"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Attendance, MeetingDetail, Pet, UserProfile } from "@/api";

export default function PerfilPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [mascotas, setMascotas] = useState<Pet[]>([]);
  const [encuentrosCreados, setEncuentrosCreados] = useState<MeetingDetail[]>([]);
  const [asistenciasUsuario, setAsistenciasUsuario] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "activity">("profile");

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const profile = await response.json();
        setUser(profile);

        const [petsRes, meetingsRes, attendancesRes] = await Promise.all([
          fetch("/api/mascotas"),
          fetch("/api/encuentros"),
          fetch("/api/asistencias"),
        ]);

        if (petsRes.ok) {
          const petsData = (await petsRes.json()) as Pet[];
          setMascotas(petsData);
        }

        if (meetingsRes.ok) {
          const meetingsData = (await meetingsRes.json()) as MeetingDetail[];
          const ownMeetings = meetingsData.filter(
            (meeting) =>
              String(meeting.creator) === String(profile.id) ||
              String(meeting.creator_email) === String(profile.email) ||
              String(meeting.is_creator).toLowerCase() === "true"
          );
          setEncuentrosCreados(ownMeetings);
        }

        if (attendancesRes.ok) {
          const attendancesData = (await attendancesRes.json()) as Attendance[];
          const ownAttendances = attendancesData.filter(
            (attendance) =>
              String(attendance.user) === String(profile.id) ||
              String(attendance.user_email) === String(profile.email)
          );
          setAsistenciasUsuario(ownAttendances);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    void checkAuthAndFetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      first_name: String(formData.get("first_name") ?? ""),
      last_name: String(formData.get("last_name") ?? ""),
      bio: String(formData.get("bio") ?? ""),
    };

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }
      setUser((prev) => (prev ? { ...prev, ...payload } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function onLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }


  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <main className="mx-auto w-full max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Perfil" },
          ]}
        />

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl shadow-inner">
              👤
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Hola, {user?.first_name || user?.username || 'Usuario'}</h1>
              <p className="mt-1 text-slate-600">Gestiona tu cuenta y actividad</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-red-200 bg-white px-6 py-2.5 font-bold text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="flex gap-4 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-4 px-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === "profile" 
                ? "border-orange-500 text-orange-600" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Datos del perfil
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-4 px-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === "activity" 
                ? "border-orange-500 text-orange-600" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Mi actividad
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Información personal</h2>
            <form className="space-y-6" onSubmit={onSubmit} key={user?.username ?? "profile-form"}>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Email</span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 cursor-not-allowed"
                    value={user?.email ?? ""}
                    disabled
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Usuario</span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 cursor-not-allowed"
                    name="username"
                    defaultValue={user?.username ?? ""}
                    disabled
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Nombre</span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    name="first_name"
                    defaultValue={user?.first_name ?? ""} 
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Apellidos</span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    name="last_name"
                    defaultValue={user?.last_name ?? ""} 
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Biografía</span>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                  rows={4}
                  name="bio"
                  placeholder="Cuéntanos un poco sobre ti..."
                  defaultValue={user?.bio ?? ""}
                />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Ciudad</span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 cursor-not-allowed"
                    name="ciudad"
                    defaultValue={user?.ciudad ?? "No especificada"}
                    disabled
                  />
                </label>
              </div>

              {error ? (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100">
                  <span>⚠️</span>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              ) : null}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isLoading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-xl group-hover:scale-150 transition-transform"></div>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">🐕</span>
                <h3 className="font-bold text-slate-800">Mascotas <span className="text-blue-500">({mascotas.length})</span></h3>
              </div>
              
              {mascotas.length === 0 ? (
                <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">No has creado mascotas.</p>
              ) : (
                <ul className="space-y-2 text-sm text-slate-600">
                  {mascotas.map((pet) => (
                    <li key={pet.id} className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                        <span className="truncate">{pet.name}</span>
                      </div>
                      <Link
                        href={`/auth/mascotas/${pet.id}`}
                        className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-600 border border-blue-100 hover:bg-blue-50"
                      >
                        Editar
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/10 blur-xl group-hover:scale-150 transition-transform"></div>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl">📍</span>
                <h3 className="font-bold text-slate-800">Encuentros <span className="text-green-500">({encuentrosCreados.length})</span></h3>
              </div>

              {encuentrosCreados.length === 0 ? (
                <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">No has creado encuentros.</p>
              ) : (
                <ul className="space-y-2 text-sm text-slate-600">
                  {encuentrosCreados.map((meeting) => (
                    <li key={meeting.id} className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                        <span className="truncate">{meeting.title}</span>
                      </div>
                      <Link
                        href={`/auth/encuentros/${meeting.id}`}
                        className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-green-600 border border-green-100 hover:bg-green-50"
                      >
                        Editar
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-500/10 blur-xl group-hover:scale-150 transition-transform"></div>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-xl">🗓️</span>
                <h3 className="font-bold text-slate-800">Asistencias <span className="text-purple-500">({asistenciasUsuario.length})</span></h3>
              </div>

              {asistenciasUsuario.length === 0 ? (
                <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">No tienes asistencias registradas.</p>
              ) : (
                <ul className="space-y-2 text-sm text-slate-600">
                  {asistenciasUsuario.map((attendance) => (
                    <li key={attendance.id} className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
                        <span className="truncate">
                          Encuentro #{attendance.meeting} - <span className="font-medium text-slate-800">{attendance.status}</span>
                        </span>
                      </div>
                      <Link
                        href={`/auth/asistencias/${attendance.id}`}
                        className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-purple-600 border border-purple-100 hover:bg-purple-50"
                      >
                        Editar
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
