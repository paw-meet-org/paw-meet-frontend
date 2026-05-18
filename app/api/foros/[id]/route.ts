import { NextResponse } from 'next/server';
import { ForosService, PublicacionesService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const foroId = Number(id);
    const client = await createAuthedApiClient();

    // Camino principal: el backend debería devolver publicaciones en el detalle.
    const detailResult = await ForosService.sociaslForosRetrieve2({ client, path: { id: foroId } });
    if (!detailResult.error && detailResult.data) {
      return NextResponse.json(detailResult.data, { status: 200 });
    }

    // Fallback temporal: el backend todavía puede responder 500 en /foros/{id}/.
    // En ese caso, reconstruimos el detalle desde la lista + filtro por foro_id.
    const listResult = await ForosService.sociaslForosRetrieve({ client });
    if (listResult.error) {
      return NextResponse.json(
        { message: 'API error', details: listResult.error, backendStatus: listResult.response?.status ?? 502 },
        { status: listResult.response?.status ?? 502 }
      );
    }

    const foros = listResult.data ?? [];
    const foro = Array.isArray(foros) ? foros.find((f) => f.id === foroId) : undefined;

    if (!foro) {
      return NextResponse.json({ message: 'Foro no encontrado', backendStatus: 404 }, { status: 404 });
    }

    // @ts-expect-error — foro_id no está en los tipos generados pero el backend lo acepta
    const pubsResult = await PublicacionesService.socialPublicacionesList({ client, query: { foro_id: foroId } });
    const publicaciones = !pubsResult.error && Array.isArray(pubsResult.data) ? pubsResult.data : [];

    return NextResponse.json({ ...foro, publicaciones }, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const client = await createAuthedApiClient();
    const result = await ForosService.sociaslForosPartialUpdate({
      client,
      path: { id: Number(id) },
      body: payload,
    });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return mapApiError(error, 400);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createAuthedApiClient();
    const result = await ForosService.sociaslForosDestroy({ client, path: { id: Number(id) } });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json({ message: 'Foro eliminado' }, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

