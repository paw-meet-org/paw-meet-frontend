import { createClient, createConfig, type Client } from "@/api/client";
import { getAccessToken } from "@/lib/supabase/server";
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client";

const DEFAULT_BACKEND_URL =
  process.env.OPENAPI_URL ?? process.env.API_BASE_URL ?? "http://localhost:8003";

export function getBackendBaseUrl() {
  return DEFAULT_BACKEND_URL.replace(/\/$/, "");
}

export function createApiClient(token?: string): Client {
  return createClient(
    createConfig({
      baseUrl: getBackendBaseUrl(),
      auth: token,
    })
  );
}

export async function createAuthedApiClient(): Promise<Client> {
  const token = await getAccessToken();
  return createApiClient(token ?? undefined);
}

/**
 * Create a server-side API client that resolves auth by reading the
 * Supabase session token for the current request. Use this from
 * Route Handlers and Server Components.
 */
export function createServerApiClient(): Client {
  return createClient(
    createConfig({
      baseUrl: getBackendBaseUrl(),
      // auth may be a function; the SDK will call it and prefix appropriately
      auth: async () => {
        const token = await getAccessToken();
        return token ?? undefined;
      },
    })
  );
}

/**
 * Create a browser API client that reads the Supabase session from the
 * browser Supabase client. Use this in Client Components / browser code.
 */
export function createBrowserApiClient(): Client {
  const supabase = createSupabaseBrowserClient();
  return createClient(
    createConfig({
      baseUrl: getBackendBaseUrl(),
      auth: async () => {
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token ?? undefined;
      },
    })
  );
}

export function mapApiError(error: unknown, status = 500): Response {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : "Unexpected API route error";

  return Response.json(
    {
      message,
      details: error,
    },
    { status }
  );
}


