import Link from "next/link";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem-120px)]">
      {/* Hero Section */}
      <section 
        className="relative bg-slate-900 py-32 text-center px-6 border-b border-slate-200 overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/hero-image.webp')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80"></div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="inline-block rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-semibold text-orange-200 mb-6 border border-orange-500/30 shadow-sm backdrop-blur-sm">
            🐾 La comunidad n.º 1 para amantes de mascotas
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-8 drop-shadow-md">
            Conecta, pasea y <br className="hidden sm:block" /> diviértete juntos
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-200 mb-10 leading-relaxed drop-shadow">
            Paw Meet es la red social donde tu mascota es la protagonista. 
            Organiza encuentros, únete a grupos de paseo y encuentra a los 
            mejores amigos para tu peludo.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center items-center">
            <Link
              href="/registro"
              className="rounded-xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-orange-600 w-full sm:w-auto"
            >
              Crear cuenta gratis
            </Link>
            <Link
              href="/login"
              className="rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-md px-8 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-white/20 w-full sm:w-auto"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Todo lo que necesitas para tu mascota
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Descubre las herramientas que hemos creado pensando en el bienestar social de tus animales.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center transition-shadow hover:shadow-md">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                📍
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Encuentros Cercanos</h3>
              <p className="text-slate-600">
                Descubre quedadas en tu zona. Filtra por tipo de mascota, tamaño o nivel de energía para encontrar el grupo perfecto.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center transition-shadow hover:shadow-md">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                🐕
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Perfiles de Mascotas</h3>
              <p className="text-slate-600">
                Crea un perfil único para cada una de tus mascotas. Comparte sus fotos, carácter y preferencias de juego.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center transition-shadow hover:shadow-md">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-3xl">
                💬
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Comunidad y Foros</h3>
              <p className="text-slate-600">
                Resuelve dudas, comparte consejos y participa en debates con otros dueños en nuestros foros temáticos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-20 px-6 text-center mt-auto">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            ¿Listo para socializar?
          </h2>
          <p className="text-lg text-slate-300 mb-10">
            Únete a cientos de dueños de mascotas que ya están organizando encuentros cada día. ¡Es rápido, seguro y gratis!
          </p>
          <Link
            href="/registro"
            className="inline-block rounded-xl bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-orange-600"
          >
            Únete a Paw Meet
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
