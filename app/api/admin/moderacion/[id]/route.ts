import { AdministradorService } from "@/generated/api";
import { configureOpenApiFromRequest, mapApiError } from "@/lib/api-client-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  try {
    configureOpenApiFromRequest(request);
    const { id } = await context.params;
    const user = new URL(request.url).searchParams.get("user");

    if (!user) {
      return Response.json(
        { message: "Missing required query param: user" },
        { status: 400 }
      );
    }

    await AdministradorService.moderacionDeletePublicacion(user, id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return mapApiError(error);
  }
}

