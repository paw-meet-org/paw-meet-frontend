import { NextResponse } from 'next/server';
import { PetTypeService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

// GET /api/tipos-mascotas/[id] -> obtener tipo de mascota por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createAuthedApiClient();
    const result = await PetTypeService.pettypesRetrieve({ client, path: { id } });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

// PATCH /api/tipos-mascotas/[id] -> actualizar tipo de mascota
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const client = await createAuthedApiClient();
    const result = await PetTypeService.pettypesPartialUpdate({ 
      client, 
      path: { id }, 
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

// DELETE /api/tipos-mascotas/[id] -> eliminar tipo de mascota
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createAuthedApiClient();
    const result = await PetTypeService.pettypesDestroy({ client, path: { id } });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json({ message: 'Tipo de mascota eliminado' }, { status: 204 });
  } catch (error) {
    return mapApiError(error);
  }
}

