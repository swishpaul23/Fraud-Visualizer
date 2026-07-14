import { useQuery } from "@tanstack/react-query";
import { fetchDecision } from "../api/decisionClient";
import type { TransactionInput } from "../types/trace.gen";

/**
 * Re-fetches whenever `input` changes, purely by virtue of the query
 * key changing — no manual refetch-on-change wiring needed.
 */
export function useDecision(input: TransactionInput) {
  return useQuery({
    queryKey: ["decision", JSON.stringify(input)],
    queryFn: () => fetchDecision(input),
  });
}
