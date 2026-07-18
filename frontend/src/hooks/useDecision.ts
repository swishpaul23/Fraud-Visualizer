import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchDecision } from "../api/decisionClient";
import type { TransactionInput } from "../types/trace.gen";

/**
 * Re-fetches whenever `input` changes, purely by virtue of the query
 * key changing — no manual refetch-on-change wiring needed.
 *
 * placeholderData: keepPreviousData matters beyond a loading-flicker
 * nicety here: without it, `data` resets to undefined on every key
 * change, which makes `trace` in App.tsx briefly falsy on every
 * control tweak — unmounting <GraphCanvas> (and the ReactFlow instance
 * inside it) and remounting it fresh once the new data lands. That
 * remount is what was silently resetting the graph's pan/zoom on every
 * change; keeping the previous trace visible during a refetch keeps
 * GraphCanvas mounted continuously instead.
 */
export function useDecision(input: TransactionInput) {
  return useQuery({
    queryKey: ["decision", JSON.stringify(input)],
    queryFn: () => fetchDecision(input),
    placeholderData: keepPreviousData,
  });
}
