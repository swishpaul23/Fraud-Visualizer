import type { DecisionTrace, TransactionInput } from "../types/trace.gen";

/**
 * Backend origin, overridable via VITE_API_BASE_URL. The API is on a
 * different origin than the Vite dev server (CORS-allowlisted in
 * backend/app/main.py), so this can't be a bare relative path.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/**
 * Note: the implemented backend route is POST /api/v1/decisions (see
 * backend/app/api/routes.py), not /api/v1/decide.
 */
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
