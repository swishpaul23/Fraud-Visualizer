import { ReactFlow, type NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
import { traceToFlow } from "./traceToFlow";
import { NodeCard, type SelectableTraceNodeData } from "../components/NodeCard";
import type { DecisionTrace } from "../types/trace.gen";
import type { Node } from "@xyflow/react";

const NODE_TYPES: NodeTypes = { traceNode: NodeCard };

export interface GraphCanvasProps {
  trace: DecisionTrace;
  onSelect?: (nodeId: string) => void;
}

/**
 * Thin ReactFlow wrapper: turns a trace into nodes/edges via
 * traceToFlow and renders them. No fetching, no fallback trace — it
 * only renders what it's given.
 */
export function GraphCanvas({ trace, onSelect }: GraphCanvasProps) {
  const { nodes, edges } = useMemo(() => traceToFlow(trace), [trace]);

  const selectableNodes = useMemo<Node<SelectableTraceNodeData>[]>(
    () => nodes.map((node) => ({ ...node, data: { ...node.data, onSelect } })),
    [nodes, onSelect],
  );

  return (
    <div className="h-full w-full">
      <ReactFlow nodes={selectableNodes} edges={edges} nodeTypes={NODE_TYPES} />
    </div>
  );
}
