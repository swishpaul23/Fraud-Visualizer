import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { statusClass } from "../graph/statusStyles";
import type { TraceNodeData } from "../graph/traceToFlow";

const REASON_TRUNCATE_LENGTH = 60;

function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export interface SelectableTraceNodeData extends TraceNodeData {
  onSelect?: (nodeId: string) => void;
}

type SelectableTraceNode = Node<SelectableTraceNodeData>;

/**
 * Presentational only — holds no selection state of its own. The
 * click handler just forwards to whatever onSelect the parent supplied
 * via node data; ownership of "which node is selected" lives up the tree.
 */
export function NodeCard({ id, data }: NodeProps<SelectableTraceNode>) {
  const { node_id, status, reason, onSelect } = data;

  return (
    <div
      className={`w-48 cursor-pointer rounded-lg border-2 px-3 py-2 shadow-sm transition-shadow duration-200 ease-out hover:shadow-lg motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:scale-[1.02] ${statusClass(status)}`}
      onClick={() => onSelect?.(id)}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-semibold">{node_id}</span>
        <span className="rounded px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide">
          {status}
        </span>
      </div>
      <p className="mt-1 text-xs" title={reason}>
        {truncate(reason, REASON_TRUNCATE_LENGTH)}
      </p>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
