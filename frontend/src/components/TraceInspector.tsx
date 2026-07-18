import type { NodeResult } from "../types/trace.gen";

function formatMetadataLabel(key: string): string {
  return key.replace(/_/g, " ");
}

function formatMetadataValue(value: unknown): string {
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return String(value);
}

export interface TraceInspectorProps {
  node: NodeResult | null;
}

/**
 * Read-only detail panel for whichever node is currently selected.
 * Holds no state of its own — it only renders what it's given.
 */
export function TraceInspector({ node }: TraceInspectorProps) {
  if (!node) {
    return (
      <div className="w-96 border-l border-gray-200 bg-gray-50 p-4 text-base text-gray-400 shadow-sm">
        Select a node to see its detail.
      </div>
    );
  }

  const metadataEntries = Object.entries(node.metadata);

  return (
    <div className="w-96 border-l border-gray-200 bg-gray-50 p-4 shadow-sm">
      <h2 className="font-mono text-base font-semibold uppercase tracking-wide text-gray-500">
        {node.node_id}
      </h2>
      <p className="mt-1 text-sm font-bold uppercase text-gray-600">{node.status}</p>
      <p className="mt-3 text-base">{node.reason}</p>

      {metadataEntries.length > 0 && (
        <dl className="mt-4 space-y-2 text-sm">
          {metadataEntries.map(([key, value]) => (
            <div key={key}>
              <dt className="text-gray-400">{formatMetadataLabel(key)}</dt>
              <dd className="font-mono text-gray-700">{formatMetadataValue(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
