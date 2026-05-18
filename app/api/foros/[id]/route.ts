import { NextResponse } from 'next/server';
import { ForosService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createAuthedApiClient();
    const result = await ForosService.sociaslForosRetrieve({ client, path: { id: Number(id) } });

    if (result.error) {
      const status = result.response?.status ?? 502;
      // Si el backend devuelve 404, devolver 404 para que el cliente lo detecte correctamente
      return NextResponse.json(
        { message: 'API error', details: result.error, backendStatus: status },
        { status }
      );
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

