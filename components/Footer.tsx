import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-8 text-slate-400 border-t border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Paw Meet. Todos los derechos
          reservados.
        </p>
        <div className="flex gap-6 text-sm">
          <Link href="/faq" className="transition hover:text-white">
            Preguntas Frecuentes
          </Link>
          <Link href="/terminos" className="transition hover:text-white">
            Términos y Condiciones
          </Link>
        </div>
      </div>
    </footer>
  );
}
