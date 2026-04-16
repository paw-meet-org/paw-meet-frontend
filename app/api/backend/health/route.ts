export async function GET() {
  const baseUrl = process.env.API_BASE_URL ?? "http://localhost:8003";
  const url = `${baseUrl.replace(/\/$/, "")}/api/schema`;

  try {
    const response = await fetch(url, { method: "GET" });
    const raw = await response.text();

    let body: unknown = raw;
    try {
      body = raw ? (JSON.parse(raw) as unknown) : null;
    } catch {
      body = raw;
    }

    return Response.json(
      {
        backendUrl: baseUrl,
        target: "/api/schema",
        status: response.status,
        ok: response.ok,
        body,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        backendUrl: baseUrl,
        target: "/api/schema",
        ok: false,
        message: "No se pudo conectar con el backend",
        details: String(error),
      },
      { status: 502 }
    );
  }
}

