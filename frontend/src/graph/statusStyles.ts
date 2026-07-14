import type { NodeStatus } from "../types/trace.gen";

/**
 * Single source of truth for how a node/edge status maps to visual
 * styling. Nothing else in the graph layer should branch on status —
 * route new styling through these two functions instead of adding
 * conditionals elsewhere.
 */

const STATUS_CLASSES: Record<NodeStatus, string> = {
  PASSED: "border-emerald-500 bg-emerald-50 text-emerald-900",
  FAILED: "border-red-500 bg-red-50 text-red-900",
  SKIPPED: "border-gray-300 bg-gray-50 text-gray-500",
};

const EDGE_COLORS: Record<NodeStatus, string> = {
  PASSED: "#10b981",
  FAILED: "#ef4444",
  SKIPPED: "#d1d5db",
};

export function statusClass(status: NodeStatus): string {
  return STATUS_CLASSES[status];
}

export function edgeColor(status: NodeStatus): string {
  return EDGE_COLORS[status];
}
