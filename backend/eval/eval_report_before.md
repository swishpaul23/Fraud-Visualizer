# Synthetic evaluation report

Dataset: 1000 synthetic transactions, seed=42
Ground truth: independent additive risk heuristic (see assess_risk()),
NOT the same thresholds the engine uses — this measures agreement,
not access to real fraud labels.

## Confusion matrix

|                | GT: BLOCK | GT: ALLOW |
|----------------|-----------|-----------|
| **Engine: BLOCK** | 790 (TP) | 160 (FP) |
| **Engine: ALLOW** | 12 (FN) | 38 (TN) |

## Metrics

- Precision: **83.2%**
- Recall: **98.5%**
- False positive rate: **80.8%**
- F1: **0.902**
- Overall agreement (accuracy): **82.8%**

## Top missed risk cases (false negatives)

Transactions the independent heuristic scored as high-risk that
the engine allowed through — these point at concrete rule gaps.

- `txn-602-779055` (account `acct-4926`) — risk_score=7, distinct_accounts_on_device_24h=1, account_age_days=765, ground_truth=BLOCK, engine=ALLOW
- `txn-622-553348` (account `acct-3542`) — risk_score=7, distinct_accounts_on_device_24h=3, account_age_days=1473, ground_truth=BLOCK, engine=ALLOW
- `txn-796-661104` (account `acct-174`) — risk_score=7, distinct_accounts_on_device_24h=0, account_age_days=1740, ground_truth=BLOCK, engine=ALLOW