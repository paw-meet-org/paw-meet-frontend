"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuthStore } from "@/stores";

export default function LoginPage() {
  const router = useRouter();
  const { login, fetchProfile, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
	event.preventDefault();
	clearError();

	await login({ username: email, password });
	await fetchProfile();
	router.push("/perfil");
  }

  return (
	<div className="min-h-screen bg-white px-6 py-10 text-blue-950">
	  <main className="mx-auto w-full max-w-md rounded-2xl border border-blue-100 bg-blue-50 p-6">
		<h1 className="text-2xl font-bold text-blue-900">Iniciar sesion</h1>
		<p className="mt-1 text-sm text-blue-700">
		  Accede con tu cuenta para gestionar tu perfil.
		</p>

		<form className="mt-6 space-y-4" onSubmit={onSubmit}>
		  <label className="block">
			<span className="mb-1 block text-sm font-medium text-blue-800">Email</span>
			<input
			  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
			  type="email"
			  value={email}
			  onChange={(event) => setEmail(event.target.value)}
			  required
			/>
		  </label>

		  <label className="block">
			<span className="mb-1 block text-sm font-medium text-blue-800">Password</span>
			<input
			  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:border-blue-400"
			  type="password"
			  value={password}
			  onChange={(event) => setPassword(event.target.value)}
			  required
			/>
		  </label>

		  {error ? (
			<p className="rounded-md bg-orange-100 px-3 py-2 text-sm text-orange-800">
			  {error}
			</p>
		  ) : null}

		  <button
			type="submit"
			disabled={isLoading}
			className="w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
		  >
			{isLoading ? "Entrando..." : "Entrar"}
		  </button>
		</form>

		<p className="mt-4 text-sm text-blue-700">
		  No tienes cuenta?{" "}
		  <Link className="font-semibold text-blue-900 underline" href="/registro">
			Registrate
		  </Link>
		</p>
	  </main>
	</div>
  );
}

