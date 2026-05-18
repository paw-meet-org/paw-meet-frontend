import { NextResponse } from 'next/server';
import { PublicacionesService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

// GET /api/publicaciones -> lista publicaciones
export async function GET() {
  try {
    const client = await createAuthedApiClient();
    const result = await PublicacionesService.socialPublicacionesList({ client });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

// POST /api/publicaciones -> crear publicación
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const client = await createAuthedApiClient();
    const result = await PublicacionesService.socialPublicacionesCreate({ client, body: payload });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return mapApiError(error, 400);
  }
}

