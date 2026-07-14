import { useState } from "react";
import { GraphCanvas } from "./graph/GraphCanvas";
import type { DecisionTrace } from "./types/trace.gen";

/**
 * Placeholder demo trace so the graph layer is viewable before the
 * data-fetching phase exists. Replace with a real fetched trace then.
 */
const DEMO_TRACE: DecisionTrace = {
  transaction_id: "tx_demo_1",
  decision: "DECLINE",
  nodes: [
    { node_id: "ingress", status: "PASSED", reason: "transaction timestamp is within the accepted freshness window", metadata: {} },
    { node_id: "geo", status: "PASSED", reason: "at least two of ip/billing/shipping countries agree", metadata: {} },
    { node_id: "proxy", status: "FAILED", reason: "ip address is a known proxy", metadata: {} },
    { node_id: "velocity", status: "SKIPPED", reason: "skipped after an earlier check failed", metadata: {} },
    { node_id: "resolution", status: "SKIPPED", reason: "skipped after an earlier check failed", metadata: {} },
  ],
};

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-gray-200 px-4 py-2">
        <h1 className="text-lg font-semibold">Fraud Decision Visualizer</h1>
        {selectedNodeId && (
          <p className="text-sm text-gray-500">Selected node: {selectedNodeId}</p>
        )}
      </header>
      <main className="flex-1">
        <GraphCanvas trace={DEMO_TRACE} onSelect={setSelectedNodeId} />
      </main>
    </div>
  );
}

export default App;
