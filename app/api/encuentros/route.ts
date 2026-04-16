import { EncuentrosService, type EncuentrosBase } from "@/generated/api";
import { mapApiError } from "@/lib/api-client-server";

export async function GET() {
  try {
    const data = await EncuentrosService.obtenerEncuentros();
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as EncuentrosBase;
    const data = await EncuentrosService.registrarEncuentro(payload);
    return Response.json(data, { status: 201 });
  } catch (error) {
    return mapApiError(error);
  }
}

