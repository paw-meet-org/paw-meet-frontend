import { NextResponse } from 'next/server';
import { ForosService } from '@/api';
import { createAuthedApiClient, mapApiError, getBackendBaseUrl } from '@/lib/api-client-server';
import { getAccessToken } from '@/lib/supabase/server';

// Obtiene publicaciones de un foro usando el query param soportado por el backend
async function fetchPublicacionesByForo(foroId: number, token: string | null) {
  try {
    const url = `${getBackendBaseUrl()}/api/social/publicaciones/?foro_id=${foroId}`;
    const res = await fetch(url, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!res.ok) return [];
    const data = await res.json() as unknown;
    return Array.isArray(data) ? data : ((data as Record<string, unknown>).results ?? []);
  } catch {
    return [];
  }
}

// GET /api/foros -> lista foros
export async function GET() {
  try {
    const token = await getAccessToken();
    const client = await createAuthedApiClient();
    const result = await ForosService.sociaslForosList({ client });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    const foros = result.data ?? [];
    if (!Array.isArray(foros)) {
      return NextResponse.json(foros, { status: 200 });
    }

    // Enriquecer cada foro con sus publicaciones via ?foro_id= (el retrieve devuelve 403)
    const enrichedForos = await Promise.all(
      foros.map(async (foro) => {
        const publicaciones = await fetchPublicacionesByForo(foro.id, token);
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

