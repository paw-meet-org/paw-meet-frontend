import { NextResponse } from 'next/server';
import { MeetingsService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

// GET /api/encuentros/[id] -> obtener encuentro por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createAuthedApiClient();
    const result = await MeetingsService.meetingsRetrieve({ client, path: { id: Number(id) } });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

// PATCH /api/encuentros/[id] -> actualizar encuentro
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const client = await createAuthedApiClient();
    const result = await MeetingsService.meetingsPartialUpdate({ 
      client, 
      path: { id: Number(id) }, 
      body: payload 
    });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return mapApiError(error, 400);
  }
}

// DELETE /api/encuentros/[id] -> eliminar encuentro
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
     const { id } = await params;
     const client = await createAuthedApiClient();
     const result = await MeetingsService.meetingsDestroy({ client, path: { id: Number(id) } });

     if (result.error) {
       return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
     }

     return NextResponse.json({ message: 'Encuentro eliminado' }, { status: 200 });
   } catch (error) {
     return mapApiError(error);
   }
}

