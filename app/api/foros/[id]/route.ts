import { NextResponse } from 'next/server';
import { ForosService } from '@/api';
import { createAuthedApiClient, mapApiError, getBackendBaseUrl } from '@/lib/api-client-server';
import { getAccessToken } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const foroId = Number(id);
    const token = await getAccessToken();
    const client = await createAuthedApiClient();

    // El endpoint de detalle GET /api/sociasl/foros/{id}/ devuelve 403 para todos los usuarios.
    // Workaround: obtener la lista de foros y filtrar por id, luego pedir publicaciones con ?foro_id=
    const listResult = await ForosService.sociaslForosList({ client });
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

    // Obtener publicaciones del foro con el query param soportado
    let publicaciones: unknown[] = [];
    try {
      const url = `${getBackendBaseUrl()}/api/social/publicaciones/?foro_id=${foroId}`;
      const res = await fetch(url, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const data = await res.json() as unknown;
        publicaciones = Array.isArray(data) ? data : ((data as Record<string, unknown>).results as unknown[] ?? []);
      }
    } catch { /* si falla, devolver publicaciones vacías */ }

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

