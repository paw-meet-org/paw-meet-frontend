import { AdministradorService, type UsuarioBase } from "@/generated/api";
import { configureOpenApiFromRequest, mapApiError } from "@/lib/api-client-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    const data = await AdministradorService.obtenerUsuarioPoIdentificador(id);
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    const payload = (await request.json()) as UsuarioBase;
    const data = await AdministradorService.actualizarUsuario(id, payload);
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    await AdministradorService.deleteUsuario(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return mapApiError(error);
  }
}

