import { NextResponse } from 'next/server';
import { UsersService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

// GET /api/user -> returns current user's profile
export async function GET() {
  try {
    const client = await createAuthedApiClient();
    const result = await UsersService.usersMeRetrieve({ client });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

// PATCH /api/user -> partial update of current user's profile
export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const client = await createAuthedApiClient();
    const result = await UsersService.usersMePartialUpdate({ client, body: payload });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data ?? null, { status: result.response?.status ?? 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

