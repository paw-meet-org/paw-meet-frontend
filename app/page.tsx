"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setHasHydrated(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem-120px)] bg-slate-50">
      {/* Hero Section */}
      <section 
        className="relative py-32 text-center px-6 overflow-hidden rounded-b-[4rem] shadow-sm mb-12"
      >
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 hover:scale-100"
          style={{ backgroundImage: "url('/assets/hero-image.webp')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90 backdrop-blur-[2px]"></div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="inline-block rounded-full bg-orange-500/20 px-5 py-2 text-sm font-semibold text-orange-200 mb-8 border border-orange-500/30 shadow-sm backdrop-blur-md">
            🐾 La comunidad n.º 1 para amantes de mascotas
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-8 drop-shadow-lg leading-tight">
            Conecta, pasea y <br className="hidden sm:block" /> diviértete juntos
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-200 mb-12 leading-relaxed drop-shadow-md">
            Paw Meet es la red social donde tu mascota es la protagonista. 
            Organiza encuentros, únete a grupos de paseo y encuentra a los 
            mejores amigos para tu peludo.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center items-center">
            {hasHydrated && isAuthenticated ? (
              <Link
                href="/auth/encuentros"
                className="rounded-full bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-orange-500/30 hover:bg-orange-600 w-full sm:w-auto"
              >
                Ver próximos encuentros
              </Link>
            ) : (
              <>
                <Link
                  href="/registro"
                  className="rounded-full bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-orange-500/30 hover:bg-orange-600 w-full sm:w-auto"
                >
                  Crear cuenta gratis
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md px-10 py-4 text-lg font-bold text-white shadow-sm transition-all hover:bg-white/20 hover:border-white/50 w-full sm:w-auto"
                >
                  Ya tengo cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-transparent py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Todo lo que necesitas para tu mascota
            </h2>
            <div className="h-1.5 w-24 bg-orange-500 rounded-full mx-auto mt-6 mb-4"></div>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Descubre las herramientas que hemos creado pensando en el bienestar social de tus animales.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="rounded-3xl border-none bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-4xl shadow-inner">
                📍
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Encuentros Cercanos</h3>
              <p className="text-slate-600 leading-relaxed">
                Descubre quedadas en tu zona. Filtra por tipo de mascota, tamaño o nivel de energía para encontrar el grupo perfecto.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="rounded-3xl border-none bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] relative md:-top-6">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 text-4xl shadow-inner">
                🐕
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Perfiles de Mascotas</h3>
              <p className="text-slate-600 leading-relaxed">
                Crea un perfil único para cada una de tus mascotas. Comparte sus fotos, carácter y preferencias de juego.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="rounded-3xl border-none bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50 text-4xl shadow-inner">
                💬
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Comunidad y Foros</h3>
              <p className="text-slate-600 leading-relaxed">
                Resuelve dudas, comparte consejos y participa en debates con otros dueños en nuestros foros temáticos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && hasHydrated && (
        <section className="bg-slate-900 py-24 px-6 text-center mt-auto rounded-t-[4rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
              ¿Listo para socializar?
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Únete a cientos de dueños de mascotas que ya están organizando encuentros cada día. ¡Es rápido, seguro y gratis!
            </p>
            <Link
              href="/registro"
              className="inline-block rounded-full bg-orange-500 px-12 py-5 text-xl font-bold text-white shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all hover:scale-105 hover:bg-orange-600"
            >
              Únete a Paw Meet
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
