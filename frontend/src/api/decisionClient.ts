import type { DecisionTrace, TransactionInput } from "../types/trace.gen";

/**
 * In production, frontend and backend are served from the same Vercel
 * deployment (see /vercel.json at the repo root) — same origin, so a
 * relative path is all that's needed. In local dev, Vite (5173) and
 * uvicorn (8000) are still two separate processes (CORS-allowlisted in
 * backend/app/main.py), so dev builds point at the backend explicitly.
 * import.meta.env.DEV is Vite's own dev-vs-prod build flag — nothing to
 * configure by hand, nothing to forget to set.
 *
 * Note: the implemented backend route is POST /api/v1/decisions (see
 * backend/app/api/routes.py), not /api/v1/decide.
 */
const API_BASE_URL = import.meta.env.DEV ? "http://localhost:8000" : "";
const DECIDE_PATH = "/api/v1/decisions";

/**
 * Posts a TransactionInput to the decision engine and returns its
 * DecisionTrace. Throws on any non-2xx response — callers (React
 * Query) own retry/error handling, this function never swallows a
 * failure into a default trace.
 */
export async function fetchDecision(input: TransactionInput): Promise<DecisionTrace> {
  const response = await fetch(`${API_BASE_URL}${DECIDE_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`fetchDecision failed (${response.status}): ${body}`);
  }

  return (await response.json()) as DecisionTrace;
}
