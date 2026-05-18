import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span className="text-slate-300">/</span> : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded-full px-2 py-1 font-medium text-slate-500 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="rounded-full bg-white px-2 py-1 font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

