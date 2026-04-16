import { proxyBackendJson } from "@/lib/backend-proxy";

export async function GET(request: Request) {
  try {
    return await proxyBackendJson(request, "/api/users/me/", "GET");
  } catch (error) {
    return Response.json(
      {
        message: "No se pudo cargar el perfil",
        details: String(error),
      },
      { status: 502 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    return await proxyBackendJson(request, "/api/users/me/", "PATCH", true);
  } catch (error) {
    return Response.json(
      {
        message: "No se pudo actualizar el perfil",
        details: String(error),
      },
      { status: 502 }
    );
  }
}

