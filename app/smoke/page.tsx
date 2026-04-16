"use client";

import { useState } from "react";

type Probe = {
  label: string;
  endpoint: string;
};

type ProbeResult = {
  status: number;
  ok: boolean;
  body: unknown;
};

const probes: Probe[] = [
  { label: "Backend health (/api/schema)", endpoint: "/api/backend/health" },
  { label: "Health API frontend", endpoint: "/api" },
  { label: "Encuentros", endpoint: "/api/encuentros" },
  { label: "Foros", endpoint: "/api/social/foros" },
  { label: "Usuarios admin", endpoint: "/api/admin/users" },
  { label: "Mascotas", endpoint: "/api/user/mascotas" },
];

export default function SmokePage() {
  const [results, setResults] = useState<Record<string, ProbeResult>>({});
  const [isLoading, setIsLoading] = useState(false);

  async function runProbe(endpoint: string) {
    const response = await fetch(endpoint);
    const raw = await response.text();

    let body: unknown = raw;
    try {
      body = raw ? (JSON.parse(raw) as unknown) : null;
    } catch {
      body = raw;
    }

    setResults((prev) => ({
      ...prev,
      [endpoint]: {
        status: response.status,
        ok: response.ok,
        body,
      },
    }));
  }

  async function runAll() {
    setIsLoading(true);
    try {
      for (const probe of probes) {
        // Run serially so logs/results are easier to correlate.
        await runProbe(probe.endpoint);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-blue-950">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <h1 className="text-3xl font-bold text-blue-900">Smoke test E2E</h1>
        <p className="text-blue-700">
          Esta pantalla prueba la comunicación frontend - rutas API de Next -
          backend.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runAll}
            disabled={isLoading}
            className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {isLoading ? "Probando..." : "Probar todo"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {probes.map((probe) => {
            const result = results[probe.endpoint];
            return (
              <section
                key={probe.endpoint}
                className="rounded-xl border border-blue-100 bg-blue-50 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-blue-900">{probe.label}</h2>
                  <button
                    type="button"
                    onClick={() => void runProbe(probe.endpoint)}
                    className="rounded-md border border-blue-300 bg-white px-3 py-1 text-sm text-blue-800 hover:bg-blue-100"
                  >
                    Test
                  </button>
                </div>
                <p className="text-sm text-blue-700">`{probe.endpoint}`</p>

                {result ? (
                  <div className="mt-3 text-sm">
                    <p>
                      Estado: {" "}
                      <span
                        className={result.ok ? "text-green-700" : "text-orange-700"}
                      >
                        {result.status}
                      </span>
                    </p>
                    <pre className="mt-2 overflow-auto rounded-md bg-white p-3 text-xs text-blue-950">
                      {JSON.stringify(result.body, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-blue-600">Sin ejecutar.</p>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

