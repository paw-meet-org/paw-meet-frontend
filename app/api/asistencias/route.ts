import { NextResponse } from 'next/server';
import { AttendancesService, MeetingsService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

// GET /api/asistencias -> lista asistencias
export async function GET() {
  try {
    const client = await createAuthedApiClient();
    const result = await AttendancesService.attendancesList({ client });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

// POST /api/asistencias -> crear asistencia (join a encuentro)
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const meetingId = Number(payload?.meetingId ?? 0);
    if (!Number.isFinite(meetingId) || meetingId <= 0) {
      return NextResponse.json({ message: 'meetingId es obligatorio' }, { status: 400 });
    }

    const client = await createAuthedApiClient();
    const detail = await MeetingsService.meetingsRetrieve({ client, path: { id: meetingId } });
    if (detail.error || !detail.data) {
      return NextResponse.json({ message: 'No se pudo recuperar el encuentro', details: detail.error }, { status: detail.response?.status ?? 502 });
    }

    const body = {
      title: detail.data.title ?? '',
      description: detail.data.description ?? '',
      date: detail.data.date ?? '',
      start_time: detail.data.start_time ?? '',
      end_time: detail.data.end_time ?? '',
      location: detail.data.location ?? '',
      city_id: Number(detail.data.city?.id ?? 0),
      max_participants: detail.data.max_participants,
      pets: detail.data.pets ?? [],
      pet_ids: detail.data.pets ?? [],
    };

    const result = await MeetingsService.meetingsJoinCreate({
      client,
      path: { id: meetingId },
      body,
    });

    if (result.error) {
      return NextResponse.json(
        {
          message: 'API error',
          details: result.error,
        },
        { status: result.response?.status ?? 502 }
      );
    }

    const attendanceId = String(result.data?.user_attendance ?? '').trim();
    if (attendanceId) {
      const attendanceResult = await AttendancesService.attendancesRetrieve({
        client,
        path: { id: attendanceId },
      });

      if (!attendanceResult.error && attendanceResult.data) {
        return NextResponse.json(attendanceResult.data, { status: 201 });
      }
    }

    return NextResponse.json(
      {
        message: 'Asistencia creada pero no se pudo resolver su detalle',
        details: result.data,
      },
      { status: 502 }
    );
  } catch (error) {
    return mapApiError(error, 400);
  }
}

