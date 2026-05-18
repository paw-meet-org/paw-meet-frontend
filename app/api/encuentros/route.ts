import { NextResponse } from 'next/server';
import { MeetingsService } from '@/api';
import { createAuthedApiClient, getBackendBaseUrl, mapApiError } from '@/lib/api-client-server';
import { getAccessToken } from '@/lib/supabase/server';

// GET /api/encuentros -> lista encuentros
export async function GET() {
  try {
    const client = await createAuthedApiClient();
    const result = await MeetingsService.meetingsList({ client });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    // Enriquecer cada encuentro con sus detalles completos (incluye asistentes)
    const meetings = result.data ?? [];
    if (!Array.isArray(meetings)) {
      return NextResponse.json(meetings, { status: 200 });
    }

    const enrichedMeetings = await Promise.all(
      meetings.map(async (meeting) => {
        try {
          const detailResult = await MeetingsService.meetingsRetrieve({
            client,
            path: { id: meeting.id },
          });
          
          if (!detailResult.error && detailResult.data) {
            return detailResult.data;
          }
        } catch {
          // Si falla obtener detalles, retornar el basic meeting
        }
        return meeting;
      })
    );

    return NextResponse.json(enrichedMeetings, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

// POST /api/encuentros -> crear encuentro
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const token = await getAccessToken();

    // Some backend deployments parse this endpoint only as form-data.
    const body = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((item) => body.append(key, String(item)));
        return;
      }
      body.append(key, String(value));
    });

    const backendResponse = await fetch(`${getBackendBaseUrl()}/api/meetings/`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body,
    });

    const contentType = backendResponse.headers.get('content-type') ?? '';
    const responseData = contentType.includes('application/json')
      ? await backendResponse.json()
      : { raw: await backendResponse.text() };

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: 'API error', details: responseData },
        { status: backendResponse.status || 502 }
      );
    }

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    return mapApiError(error, 400);
  }
}
