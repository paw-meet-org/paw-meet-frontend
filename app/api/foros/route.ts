import { NextResponse } from 'next/server';
import { ForosService, PublicacionesService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';
import type { Client } from '@/api/client';

// El schema OpenAPI no documenta ?foro_id= en publicaciones pero el backend lo soporta.
// Usamos el cliente SDK para mantener la autenticación centralizada.
async function fetchPublicacionesByForo(foroId: number, client: Client) {
  try {
    // @ts-expect-error — foro_id no está en los tipos generados pero el backend lo acepta
    const result = await PublicacionesService.socialPublicacionesList({ client, query: { foro_id: foroId } });
    if (result.error) return [];
    const data = result.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// GET /api/foros -> lista foros
export async function GET() {
  try {
    const client = await createAuthedApiClient();
    const result = await ForosService.sociaslForosRetrieve({ client });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    const foros = result.data ?? [];
    if (!Array.isArray(foros)) {
      return NextResponse.json(foros, { status: 200 });
    }

    // Camino principal: detalle por id (backend debería incluir publicaciones).
    // Fallback: usar ?foro_id= mientras el retrieve falle en backend.
    const enrichedForos = await Promise.all(
      foros.map(async (foro) => {
        const detailResult = await ForosService.sociaslForosRetrieve2({ client, path: { id: foro.id } });
        if (!detailResult.error && detailResult.data) {
          return detailResult.data;
        }

        const publicaciones = await fetchPublicacionesByForo(foro.id, client);
        return { ...foro, publicaciones };
      })
    );

    return NextResponse.json(enrichedForos, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

// POST /api/foros -> crear foro
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const client = await createAuthedApiClient();
    const result = await ForosService.sociaslForosCreate({ client, body: payload });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return mapApiError(error, 400);
  }
}

