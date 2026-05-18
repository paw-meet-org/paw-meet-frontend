import { NextResponse } from 'next/server';
import { ForosService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

// GET /api/foros -> lista foros
export async function GET() {
  try {
    const client = await createAuthedApiClient();
    const result = await ForosService.sociaslForosList({ client });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    // Enriquecer cada foro con sus detalles completos (incluye publicaciones)
    const foros = result.data ?? [];
    if (!Array.isArray(foros)) {
      return NextResponse.json(foros, { status: 200 });
    }

    const enrichedForos = await Promise.all(
      foros.map(async (foro) => {
        try {
          const detailResult = await ForosService.sociaslForosRetrieve({
            client,
            path: { id: foro.id },
          });
          
          if (!detailResult.error && detailResult.data) {
            return detailResult.data;
          }
        } catch {
          // Si falla obtener detalles, retornar el foro básico
        }
        return foro;
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

