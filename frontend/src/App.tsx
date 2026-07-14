import { useState } from "react";
import { GraphCanvas } from "./graph/GraphCanvas";
import { ControlPanel, DEFAULT_CONTROL_STATE, buildTransactionInput } from "./components/ControlPanel";
import { TraceInspector } from "./components/TraceInspector";
import { useDecision } from "./hooks/useDecision";
import type { TransactionInput } from "./types/trace.gen";

function App() {
  const [input, setInput] = useState<TransactionInput>(() =>
    buildTransactionInput(DEFAULT_CONTROL_STATE),
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const { data: trace, error, isPending } = useDecision(input);

  const selectedNode = trace?.nodes.find((node) => node.node_id === selectedNodeId) ?? null;

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-gray-200 px-4 py-2">
        <h1 className="text-lg font-semibold">Fraud Decision Visualizer</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ControlPanel onChange={setInput} />
        <main className="flex-1 overflow-hidden">
          {isPending && <p className="p-4 text-sm text-gray-400">Loading decision…</p>}
          {error && <p className="p-4 text-sm text-red-600">{(error as Error).message}</p>}
          {trace && <GraphCanvas trace={trace} onSelect={setSelectedNodeId} />}
        </main>
        <TraceInspector node={selectedNode} />
      </div>
    </div>
  );
}

export default App;
