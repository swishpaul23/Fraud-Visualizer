import { useState } from "react";
import type { TransactionInput } from "../types/trace.gen";

export interface ControlPanelState {
  amountDollars: string;
  isKnownProxy: boolean;
  transactionsFromAccount1h: number;
  geoMismatch: boolean;
  distinctAccountsOnDevice24h: number;
}

export const DEFAULT_CONTROL_STATE: ControlPanelState = {
  amountDollars: "50.00",
  isKnownProxy: false,
  transactionsFromAccount1h: 1,
  geoMismatch: false,
  distinctAccountsOnDevice24h: 0,
};

// Held fixed — not exposed as controls in this phase, but the backend
// requires them on every request.
const FIXED_TRANSACTION_ID = "tx_demo";
const FIXED_ACCOUNT_ID = "acct_demo";
const FIXED_DEVICE_ID = "dev_demo";

/**
 * Pure: maps the panel's small set of exposed controls onto a full
 * TransactionInput, filling everything else with fixed baseline values
 * so the resulting trace isolates whichever signal the user is
 * exploring. Exported so App.tsx can compute the same initial value.
 */
export function buildTransactionInput(state: ControlPanelState): TransactionInput {
  return {
    transaction_id: FIXED_TRANSACTION_ID,
    account_id: FIXED_ACCOUNT_ID,
    amount: state.amountDollars,
    currency: "USD",
    timestamp: new Date().toISOString(),
    ip_address: "203.0.113.7",
    ip_country: state.geoMismatch ? "RU" : "US",
    is_known_proxy: state.isKnownProxy,
    is_known_datacenter: false,
    billing_country: "US",
    shipping_country: state.geoMismatch ? "CA" : "US",
    account_home_country: "US",
    device_id: FIXED_DEVICE_ID,
    device_recognized: true,
    distinct_accounts_on_device_24h: state.distinctAccountsOnDevice24h,
    transactions_from_account_1h: state.transactionsFromAccount1h,
    transactions_from_account_24h: state.transactionsFromAccount1h,
    account_age_days: 400,
    email_verified: true,
  };
}

export interface ControlPanelProps {
  onChange: (input: TransactionInput) => void;
}

/**
 * Owns the form state for its five exposed controls and lifts a full
 * TransactionInput to the parent on every change. Makes no API calls
 * itself — that's the parent's job via useDecision.
 */
export function ControlPanel({ onChange }: ControlPanelProps) {
  const [state, setState] = useState<ControlPanelState>(DEFAULT_CONTROL_STATE);

  function update(partial: Partial<ControlPanelState>) {
    const next = { ...state, ...partial };
    setState(next);
    onChange(buildTransactionInput(next));
  }

  return (
    <div className="flex w-80 flex-col gap-4 border-r border-gray-200 bg-gray-50 p-4 shadow-sm">
      <h2 className="text-base font-semibold uppercase tracking-wide text-gray-500">
        Transaction controls
      </h2>

      <label className="flex flex-col gap-1 text-base">
        Amount (USD)
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={state.amountDollars}
          onChange={(e) => update({ amountDollars: e.target.value })}
          className="rounded border border-gray-300 px-2 py-1"
        />
      </label>

      <label className="flex items-center gap-2 text-base">
        <input
          type="checkbox"
          checked={state.isKnownProxy}
          onChange={(e) => update({ isKnownProxy: e.target.checked })}
        />
        Known VPN / proxy IP
      </label>

      <label className="flex flex-col gap-1 text-base">
        Transactions in last hour: {state.transactionsFromAccount1h}
        <input
          type="range"
          min={0}
          max={10}
          value={state.transactionsFromAccount1h}
          onChange={(e) => update({ transactionsFromAccount1h: Number(e.target.value) })}
        />
      </label>

      <label className="flex items-center gap-2 text-base">
        <input
          type="checkbox"
          checked={state.geoMismatch}
          onChange={(e) => update({ geoMismatch: e.target.checked })}
        />
        Billing / shipping / IP country mismatch
      </label>

      <label className="flex flex-col gap-1 text-base">
        Accounts sharing this device (24h): {state.distinctAccountsOnDevice24h}
        <input
          type="range"
          min={0}
          max={10}
          value={state.distinctAccountsOnDevice24h}
          onChange={(e) => update({ distinctAccountsOnDevice24h: Number(e.target.value) })}
        />
      </label>
    </div>
  );
}
