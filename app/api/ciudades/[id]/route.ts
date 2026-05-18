import { NextResponse } from 'next/server';
import { CitiesService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createAuthedApiClient();
    const result = await CitiesService.citiesRetrieve({ client, path: { id: Number(id) } });

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
    const result = await CitiesService.citiesPartialUpdate({
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
    const result = await CitiesService.citiesDestroy({ client, path: { id: Number(id) } });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json({ message: 'Ciudad eliminada' }, { status: 204 });
  } catch (error) {
    return mapApiError(error);
  }
}

