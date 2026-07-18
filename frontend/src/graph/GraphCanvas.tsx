import { Background, ReactFlow, type NodeTypes, type ReactFlowInstance } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo, useRef } from "react";
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

  // fitView only on the true first load of this ReactFlow instance —
  // onInit fires once per mount, never again on subsequent node/edge
  // prop updates, so a control change never yanks the user's zoom/pan
  // back to a fitted view.
  const hasFitOnce = useRef(false);

  function handleInit(instance: ReactFlowInstance<Node<SelectableTraceNodeData>>) {
    if (hasFitOnce.current) return;
    hasFitOnce.current = true;
    instance.fitView();
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={selectableNodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onInit={handleInit}
      >
        <Background gap={16} size={1} color="#e5e5e5" />
      </ReactFlow>
    </div>
  );
}
