"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegistroPage() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFormError(null);

    if (password !== passwordConfirm) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }
      
      router.push("/perfil");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-md rounded-[2.5rem] border border-white/50 bg-white/80 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-3xl shadow-lg shadow-orange-500/30">
            🐾
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Crear cuenta</h1>
          <p className="mt-2 text-slate-500">Únete a la comunidad Paw Meet</p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Usuario</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="tu_usuario"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Contraseña</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Confirmar contraseña</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              type="password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          {(formError || error) && (
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100">
              <span>⚠️</span>
              <p className="text-sm font-medium">{formError || error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-full bg-orange-500 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-1 hover:bg-orange-600 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isLoading ? "Creando cuenta..." : "Comenzar ahora"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium">
          ¿Ya tienes cuenta?{" "}
          <Link className="font-bold text-orange-500 transition-colors hover:text-orange-600 hover:underline" href="/login">
            Inicia sesión aquí
          </Link>
        </p>
      </main>
    </div>
  );
}
