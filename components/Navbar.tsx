import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-900">
          <span className="text-2xl">🐾</span> Paw Meet
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-blue-800">
          <Link href="/faq" className="transition hover:text-orange-500">
            FAQ
          </Link>
          <Link href="/login" className="transition hover:text-orange-500">
            Iniciar Sesión
          </Link>
          <Link
            href="/registro"
            className="rounded-full bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600 shadow-sm"
          >
            Registrarse
          </Link>
        </nav>
      </div>
    </header>
  );
}
