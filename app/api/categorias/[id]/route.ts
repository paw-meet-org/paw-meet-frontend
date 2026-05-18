import { NextResponse } from 'next/server';
import { CategoriasPublicacionService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createAuthedApiClient();
    const result = await CategoriasPublicacionService.socialCategoriasRetrieve({ client, path: { id: Number(id) } });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
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
    const result = await CategoriasPublicacionService.socialCategoriasPartialUpdate({
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
    const result = await CategoriasPublicacionService.socialCategoriasDestroy({ client, path: { id: Number(id) } });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json({ message: 'Categoría eliminada' }, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

