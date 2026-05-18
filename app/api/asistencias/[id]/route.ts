import { NextResponse } from 'next/server';
import { AttendancesService, MeetingsService } from '@/api';
import { createAuthedApiClient, mapApiError } from '@/lib/api-client-server';

// GET /api/asistencias/[id] -> obtener asistencia por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createAuthedApiClient();
    const result = await AttendancesService.attendancesRetrieve({ client, path: { id } });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

// PATCH /api/asistencias/[id] -> actualizar asistencia
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const client = await createAuthedApiClient();
    const result = await AttendancesService.attendancesPartialUpdate({ 
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

// DELETE /api/asistencias/[id] -> eliminar asistencia
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createAuthedApiClient();
    const attendance = await AttendancesService.attendancesRetrieve({ client, path: { id } });

    if (attendance.error || !attendance.data) {
      return NextResponse.json({ message: 'API error', details: attendance.error }, { status: attendance.response?.status ?? 502 });
    }

    const meetingId = Number(attendance.data.meeting);
    const meeting = await MeetingsService.meetingsRetrieve({ client, path: { id: meetingId } });

    if (meeting.error || !meeting.data) {
      return NextResponse.json({ message: 'No se pudo recuperar el encuentro', details: meeting.error }, { status: meeting.response?.status ?? 502 });
    }

    const body = {
      title: meeting.data.title ?? '',
      description: meeting.data.description ?? '',
      date: meeting.data.date ?? '',
      start_time: meeting.data.start_time ?? '',
      end_time: meeting.data.end_time ?? '',
      location: meeting.data.location ?? '',
      city_id: Number(meeting.data.city?.id ?? 0),
      max_participants: meeting.data.max_participants,
      pets: meeting.data.pets ?? [],
      pet_ids: meeting.data.pets ?? [],
    };

    const result = await MeetingsService.meetingsLeaveCreate({ client, path: { id: meetingId }, body });

    if (result.error) {
      return NextResponse.json({ message: 'API error', details: result.error }, { status: result.response?.status ?? 502 });
    }

    return NextResponse.json({ message: 'Asistencia eliminada' }, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

