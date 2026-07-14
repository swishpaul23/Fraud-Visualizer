import type { Edge, Node } from "@xyflow/react";
import type { DecisionTrace, NodeStatus } from "../types/trace.gen";
import { edgeColor } from "./statusStyles";

/**
 * Fixed left-to-right lane layout for a linear check pipeline. No
 * force-directed or physics-based layout — the trace is always a
 * straight sequence, so a fixed lane is all this needs.
 */
const LANE_X_STEP = 220;
const LANE_Y = 0;

export interface TraceNodeData extends Record<string, unknown> {
  node_id: string;
  status: NodeStatus;
  reason: string;
}

export type TraceNode = Node<TraceNodeData>;

/**
 * Pure transform: DecisionTrace in, ReactFlow nodes/edges out. No side
 * effects, no internal state, no fetching — callers own all of that.
 */
export function traceToFlow(trace: DecisionTrace): { nodes: TraceNode[]; edges: Edge[] } {
  const nodes: TraceNode[] = trace.nodes.map((result, index) => ({
    id: result.node_id,
    type: "traceNode",
    position: { x: index * LANE_X_STEP, y: LANE_Y },
    data: {
      node_id: result.node_id,
      status: result.status,
      reason: result.reason,
    },
  }));

  const edges: Edge[] = trace.nodes.slice(0, -1).map((result, index) => {
    const next = trace.nodes[index + 1];
    return {
      id: `${result.node_id}->${next.node_id}`,
      source: result.node_id,
      target: next.node_id,
      // Animated only while the upstream node actually passed data through.
      animated: result.status === "PASSED",
      style: { stroke: edgeColor(result.status) },
    };
  });

  return { nodes, edges };
}
