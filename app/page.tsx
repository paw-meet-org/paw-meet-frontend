export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-blue-950">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-8 px-6 text-center">
        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
          Bienvenido
        </span>
        <h1 className="text-5xl font-extrabold tracking-tight text-blue-900 sm:text-6xl">
          Paw Meet Frontend
        </h1>
        <p className="max-w-2xl text-lg text-blue-700 sm:text-xl">
          La base inicial de nuestra app para conectar amantes de mascotas,
          organizar encuentros y construir comunidad.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#"
            className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            Empezar ahora
          </a>
          <a
            href="/smoke"
            className="rounded-xl border border-blue-300 bg-blue-50 px-6 py-3 font-semibold text-blue-800 transition hover:bg-blue-100"
          >
            Probar integracion
          </a>
        </div>
        <div className="w-full max-w-3xl rounded-2xl border border-blue-100 bg-blue-50 p-6 text-left">
          <p className="text-sm font-medium uppercase tracking-wide text-orange-600">
            Estado
          </p>
          <p className="mt-2 text-blue-800">
            Home base lista. Proximo paso: conectar esta vista con la API
            generada desde OpenAPI.
          </p>
        </div>
      </main>
    </div>
  );
}
