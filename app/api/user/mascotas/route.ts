import { UsuarioService, type MascotasBase } from "@/generated/api";
import { configureOpenApiFromRequest, mapApiError } from "@/lib/api-client-server";

export async function GET(request: Request) {
  try {
    configureOpenApiFromRequest(request);
    const data = await UsuarioService.getMascotas();
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    configureOpenApiFromRequest(request);
    const payload = (await request.json()) as MascotasBase;
    const data = await UsuarioService.registrarMascotas(payload);
    return Response.json(data, { status: 201 });
  } catch (error) {
    return mapApiError(error);
  }
}

