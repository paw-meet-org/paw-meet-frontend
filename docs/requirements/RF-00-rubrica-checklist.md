# RF-00 React Rubrica Checklist

Estado de cumplimiento del proyecto frente a la rubrica solicitada.

## Criterios globales

- [x] Se hace uso de todas las entidades principales en alguna parte del proyecto (Users, Pets, Meetings, Attendances, Cities, PetTypes, Foros, Categorias, Publicaciones).
- [x] Existe una pagina de listado por entidad accesible desde la barra de navegacion (`app/ClientLayout.tsx` -> `navItems`: mascotas, encuentros, foros, publicaciones, asistencias, admin, ciudades, categorias, tipos-mascotas).
- [x] Se usa `map` para renderizar listas de entidades.
- [x] Se usa render condicional `if/else` (loading, empty state, listado).
- [x] Existe una ruta con parametro `id` por entidad para detalle/edicion (`/auth/*/[id]`).
- [x] Existe un componente tipo seccion por entidad que recibe el objeto de la entidad (`components/sections/*Section.tsx`, incluyendo `MascotaSection.tsx` y `CiudadSection.tsx`).

## Matriz por entidad

| Entidad | Listado | Crear | Editar | Eliminar | Detalle | Ruta `[id]` | Seccion |
|---|---|---|---|---|---|---|---|
| Usuarios Admin | x | x | x* | x | x | x | x |
| Asistencias | x | x | x | x | x | x | x |
| Categorias | x | x | x | x | x | x | x |
| Ciudades | x | x | x | x | x | x | x |
| Encuentros | x | x | x | x | x | x | x |
| Foros | x (`/auth/foros`) | x (`/auth/foros/nuevo`) | x (`/auth/foros/[id]`) | x (`/auth/foros/[id]`) | x (`/auth/foros/[id]`) | x | x |
| Mascotas | x | x | x | x | x | x | x |
| Publicaciones | x | x | x | x | x | x | x |
| Tipos Mascotas | x | x | x | x | x | x | x |

\* En Usuarios Admin, la actualizacion depende del contrato OpenAPI backend. El flujo UI y ruta existen en `/auth/admin/[id]` y proxy `/api/admin/[id]`.

## Evidencia de rutas

- Listados: `app/auth/*/page.tsx`
- Creacion dedicada de foros: `app/auth/foros/nuevo/page.tsx`
- Detalle por id: `app/auth/*/[id]/page.tsx`
- Proxies CRUD: `app/api/*/route.ts` y `app/api/*/[id]/route.ts`
- Secciones: `components/sections/*Section.tsx` (AdminUser, Attendance/Asistencia, Categoria, Ciudad, Encuentro, Foro, Mascota, PetType, Publicacion)

