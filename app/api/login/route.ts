import { UsuarioService, type Login } from "@/generated/api";
import { mapApiError } from "@/lib/api-client-server";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Login;
    const data = await UsuarioService.login(payload);
    return Response.json(data, { status: 200 });
  } catch (error) {
    return mapApiError(error);
  }
}

