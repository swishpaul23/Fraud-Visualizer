# Synthetic evaluation report

Dataset: 1000 synthetic transactions, seed=42
Ground truth: independent additive risk heuristic (see assess_risk()),
NOT the same thresholds the engine uses — this measures agreement,
not access to real fraud labels.

## Confusion matrix

|                | GT: BLOCK | GT: ALLOW |
|----------------|-----------|-----------|
| **Engine: BLOCK** | 806 (TP) | 148 (FP) |
| **Engine: ALLOW** | 9 (FN) | 37 (TN) |

## Metrics

- Precision: **84.5%**
- Recall: **98.9%**
- False positive rate: **80.0%**
- F1: **0.911**
- Overall agreement (accuracy): **84.3%**

## Top missed risk cases (false negatives)

Transactions the independent heuristic scored as high-risk that
the engine allowed through — these point at concrete rule gaps.

- `txn-8-943313` (account `acct-4239`) — risk_score=12, distinct_accounts_on_device_24h=3, account_age_days=0, ground_truth=BLOCK, engine=ALLOW
- `txn-213-432459` (account `acct-2892`) — risk_score=8, distinct_accounts_on_device_24h=3, account_age_days=871, ground_truth=BLOCK, engine=ALLOW
- `txn-435-595130` (account `acct-2190`) — risk_score=8, distinct_accounts_on_device_24h=3, account_age_days=1587, ground_truth=BLOCK, engine=ALLOW