import { NextResponse } from 'next/server';
import { PetTypeService } from '@/api';
import { createApiClient, createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

type PetTypesFetchFailure = {
  source: 'authenticated' | 'public';
  status?: number;
  statusText?: string;
  error: unknown;
};

// GET /api/tipos-mascotas -> lista tipos de mascotas
export async function GET() {
  try {
    const failures: PetTypesFetchFailure[] = [];
    const authedClient = await createAuthedApiClient();
    const authedResult = await PetTypeService.pettypesList({ client: authedClient });

    if (!authedResult.error) {
      const data = Array.isArray(authedResult.data) ? authedResult.data : [];
      return NextResponse.json(data, { status: 200 });
    }

    failures.push({
      source: 'authenticated',
      status: authedResult.response?.status,
      statusText: authedResult.response?.statusText,
      error: authedResult.error,
    });

    console.warn('GET /api/tipos-mascotas failed with auth, retrying without token:', failures[0]);

    const publicClient = createApiClient();
    const publicResult = await PetTypeService.pettypesList({ client: publicClient });

    if (!publicResult.error) {
      const data = Array.isArray(publicResult.data) ? publicResult.data : [];
      return NextResponse.json(data, { status: 200 });
    }

    failures.push({
      source: 'public',
      status: publicResult.response?.status,
      statusText: publicResult.response?.statusText,
      error: publicResult.error,
    });

    console.error('GET /api/tipos-mascotas failed:', failures);

    return NextResponse.json(
      {
        message: 'Failed to fetch pet types',
        details: failures,
      },
      {
        status:
          failures.find((failure) => typeof failure.status === 'number')?.status ?? 502,
      }
    );
  } catch (error) {
    console.error('GET /api/tipos-mascotas unexpected error:', error);
    return mapApiError(error);
  }
}

// POST /api/tipos-mascotas -> crear tipo de mascota
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const client = await createAuthedApiClient();
    const result = await PetTypeService.pettypesCreate({ client, body: payload });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return mapApiError(error, 400);
  }
}

