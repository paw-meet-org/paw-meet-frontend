export async function GET() {
  return Response.json({
    service: "paw-meet-frontend-api",
    message: "Proxy routes backed by generated OpenAPI client",
    endpoints: [
      { method: "POST", path: "/api/login" },
      { method: "GET", path: "/api/encuentros" },
      { method: "POST", path: "/api/encuentros" },
    ],
  });
}

