/**
 * Hand-written stand-in for a future generated file. Mirrors
 * backend/app/models/trace.py exactly. When codegen exists, this file
 * is replaced wholesale — don't hand-edit the shape without checking
 * the backend models first.
 */

export type NodeStatus = "PASSED" | "FAILED" | "SKIPPED";

export type Decision = "APPROVE" | "DECLINE";

export interface NodeResult {
  node_id: string;
  status: NodeStatus;
  reason: string;
  metadata: Record<string, unknown>;
}

export interface DecisionTrace {
  transaction_id: string;
  decision: Decision;
  nodes: NodeResult[];
}
