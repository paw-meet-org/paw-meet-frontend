import { SocialService, type PublicacionesBase } from "@/generated/api";
import { configureOpenApiFromRequest, mapApiError } from "@/lib/api-client-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    const data = await SocialService.obtenerPublicacion(id);
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    const payload = (await request.json()) as PublicacionesBase;
    const data = await SocialService.registrarPublicacion(id, payload);
    return Response.json(data, { status: 201 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    await SocialService.eliminarPublicacion(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return mapApiError(error);
  }
}

