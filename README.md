This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## OpenAPI -> cliente TypeScript

Este proyecto genera un cliente TS desde `generated/openapi.yaml`.

- Salida generada: `generated/api-client/`
- Reexport estable: `generated/api/index.ts`

Comandos:

```bash
npm run api:generate
npm run api:generate:clean
```

Ejemplo de uso:

```ts
import { OpenAPI, UsuarioService } from "@/generated/api";

OpenAPI.BASE = "http://localhost:8000";
OpenAPI.TOKEN = "<jwt>";

const auth = await UsuarioService.login({
  username: "demo",
  password: "demo",
});
```

## Estado global con Zustand

Se anadio Zustand para gestionar el estado del frontend por dominios.

- `stores/auth.store.ts`: login, token, sesion y errores de autenticacion.
- `stores/encuentros.store.ts`: listado de encuentros, cache temporal y creacion.
- `stores/mascotas.store.ts`: listado/registro de mascotas del usuario.
- `stores/social.store.ts`: foros, temas y publicaciones.
- `stores/admin.store.ts`: usuarios, sponsors, ciudades, razas y moderacion.
- `stores/request-state.ts`: tipos comunes para estados de peticion.

Ejemplo rapido en un componente cliente:

```tsx
"use client";

import { useEffect } from "react";
import { useEncuentrosStore } from "@/stores";

export function EncuentrosList() {
  const { encuentros, isLoading, error, fetchEncuentros } = useEncuentrosStore();

  useEffect(() => {
    void fetchEncuentros();
  }, [fetchEncuentros]);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {encuentros.map((encuentro, index) => (
        <li key={`${encuentro.titulo ?? "encuentro"}-${index}`}>
          {encuentro.titulo ?? "Sin titulo"}
        </li>
      ))}
    </ul>
  );
}
```

## Backend local y comprobación E2E

El backend dockerizado se encuentra en `env/backend_produccion` (ahora ignorado en git).

1) Levantar backend:

```bash
cd env/backend_produccion
docker compose up -d postgres pawmeet
```

2) Levantar frontend apuntando al backend local:

```bash
cd /home/awahiid/proyectos/iw/paw-meet-frontend
API_BASE_URL=http://localhost:8003 npm run dev
```

3) Abrir `http://localhost:3000/smoke` y ejecutar pruebas de endpoints.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
