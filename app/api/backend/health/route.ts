import { NextResponse } from 'next/server';
import { SchemaService } from '@/api';
import { createApiClient, mapApiError } from '@/lib/api-client-server';

// GET /api/backend/health -> returns backend schema (health)
export async function GET() {
  try {
    const client = createApiClient();
    const result = await SchemaService.schemaRetrieve({ client });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

