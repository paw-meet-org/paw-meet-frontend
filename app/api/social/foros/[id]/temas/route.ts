import { SocialService, type TemasBase } from "@/generated/api";
import { configureOpenApiFromRequest, mapApiError } from "@/lib/api-client-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    const data = await SocialService.obtenerTemasForo(id);
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    const payload = (await request.json()) as TemasBase;
    const data = await SocialService.registrarTemaForo(id, payload);
    return Response.json(data, { status: 201 });
  } catch (error) {
    return mapApiError(error);
  }
}

