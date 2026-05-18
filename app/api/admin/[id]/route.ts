import { NextResponse } from 'next/server';
import { AdminService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createAuthedApiClient();
    const list = await AdminService.adminUsersListList({ client });

    if (list.error) {
      return NextResponse.json({ message: 'API error', details: list.error }, { status: list.response?.status ?? 502 });
    }

    const users = list.data?.results ?? [];
    const user = users.find((item) => String(item.id) === id) ?? null;
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // El SDK actual no expone endpoint admin de actualización por id.
    const { id } = await params;
    const payload = await request.json();
    return NextResponse.json(
      {
        message: 'Update admin no disponible en contrato OpenAPI actual',
        id,
        payload,
      },
      { status: 501 }
    );
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

    const list = await AdminService.adminUsersListList({ client });
    if (list.error) {
      return NextResponse.json({ message: 'API error', details: list.error }, { status: list.response?.status ?? 502 });
    }

    const users = list.data?.results ?? [];
    const user = users.find((item) => String(item.id) === id) ?? null;
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const result = await AdminService.adminUsersDeleteDestroy({
      client,
      query: { email: user.email },
    });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json({ message: 'Usuario eliminado' }, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

