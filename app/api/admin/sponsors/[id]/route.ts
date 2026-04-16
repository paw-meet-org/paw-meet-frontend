import { AdministradorService, type SponsorBase } from "@/generated/api";
import { configureOpenApiFromRequest, mapApiError } from "@/lib/api-client-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    const data = await AdministradorService.obtenerSponsorPoIdentificador(id);
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    const payload = (await request.json()) as SponsorBase;
    const data = await AdministradorService.actualizarSponsor(id, payload);
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    await AdministradorService.deleteSponsor(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return mapApiError(error);
  }
}

