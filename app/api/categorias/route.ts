import { NextResponse } from 'next/server';
import { CategoriasPublicacionService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

// GET /api/categorias -> lista categorias de publicaciones
export async function GET() {
  try {
    const client = await createAuthedApiClient();
    const result = await CategoriasPublicacionService.socialCategoriasList({ client });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

// POST /api/categorias -> crear categoría
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const client = await createAuthedApiClient();
    const result = await CategoriasPublicacionService.socialCategoriasCreate({ client, body: payload });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return mapApiError(error, 400);
  }
}

