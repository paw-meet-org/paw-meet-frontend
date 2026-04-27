import { UsuarioService, type Login as LoginType } from "@/generated/api-client";
import { configureOpenApiFromRequest, mapApiError } from "@/lib/api-client-server";

export async function POST(request: Request) {
  try {
    configureOpenApiFromRequest(request);
    const body = (await request.json()) as LoginType;
    const data = await UsuarioService.login(body);
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}
