import { NextResponse } from 'next/server';
import { MeetingsService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

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
    const payload = await request.json();
    const client = await createAuthedApiClient();
    const result = await MeetingsService.meetingsCreate({ client, body: payload });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return mapApiError(error, 400);
  }
}
