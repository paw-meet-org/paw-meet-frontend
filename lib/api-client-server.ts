import { ApiError, OpenAPI } from "@/generated/api";

// Use backend URL from env in server routes; fallback to generated default.
OpenAPI.BASE = process.env.API_BASE_URL ?? OpenAPI.BASE;
export function configureOpenApiFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;

  OpenAPI.TOKEN = bearerToken;
}

export function mapApiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(
      {
        message: error.message,
        status: error.status,
        details: error.body ?? null,
      },
      { status: error.status || 500 }
    );
  }

  console.error("Unexpected API route error", error);
  return Response.json({ message: "Unexpected server error" }, { status: 500 });
}

