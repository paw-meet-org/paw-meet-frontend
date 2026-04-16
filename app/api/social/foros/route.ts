import { SocialService } from "@/generated/api";
import { configureOpenApiFromRequest, mapApiError } from "@/lib/api-client-server";

export async function GET(request: Request) {
  try {
    configureOpenApiFromRequest(request);
    const data = await SocialService.obtenerForos();
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

