import { proxyBackendJson } from "@/lib/backend-proxy";

export async function POST(request: Request) {
  try {
    return await proxyBackendJson(request, "/api/auth/register/", "POST", true);
  } catch (error) {
    return Response.json(
      {
        message: "No se pudo completar el registro",
        details: String(error),
      },
      { status: 502 }
    );
  }
}

