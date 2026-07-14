/**
 * Hand-written stand-in for a future generated file. Mirrors
 * backend/app/models/trace.py and backend/app/models/transaction.py
 * exactly. When codegen exists, this file is replaced wholesale —
 * don't hand-edit the shape without checking the backend models first.
 */

export interface TransactionInput {
  transaction_id: string;
  account_id: string;
  amount: string;
  currency: string;
  timestamp: string;
  ip_address: string;
  ip_country: string;
  is_known_proxy: boolean;
  is_known_datacenter: boolean;
  billing_country: string;
  shipping_country: string;
  account_home_country: string;
  device_id: string;
  device_recognized: boolean;
  distinct_accounts_on_device_24h: number;
  transactions_from_account_1h: number;
  transactions_from_account_24h: number;
  account_age_days: number;
  email_verified: boolean;
}

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
