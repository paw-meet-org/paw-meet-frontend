const DEFAULT_BACKEND_URL = "http://localhost:8003";

function getBackendBaseUrl() {
  return (process.env.API_BASE_URL ?? DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
	return null;
  }

  return authorization.slice("Bearer ".length);
}

async function parseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) {
	return null;
  }

  try {
	return JSON.parse(raw) as unknown;
  } catch {
	return raw;
  }
}

export async function proxyBackendJson(
  request: Request,
  path: string,
  method: "GET" | "POST" | "PATCH",
  includeBody = false
): Promise<Response> {
  const token = getBearerToken(request);

  let body: string | undefined;
  if (includeBody) {
	body = JSON.stringify(await request.json());
  }

  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
	method,
	headers: {
	  "Content-Type": "application/json",
	  ...(token ? { Authorization: `Bearer ${token}` } : {}),
	},
	...(body ? { body } : {}),
  });

  const payload = await parseBody(response);
  return Response.json(payload, { status: response.status });
}

