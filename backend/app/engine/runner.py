"""
Executes the registry against one transaction and produces the full
DecisionTrace. Recording stops discriminating after the first failure —
every remaining node is marked SKIPPED without being called. Checks are
called directly; if one raises, that propagates as an unhandled
exception, because a raising check is a bug in the check, not a
condition this runner should paper over.
"""

from app.engine.registry import CHECKS
from app.models.trace import Decision, DecisionTrace, NodeResult, NodeStatus
from app.models.transaction import TransactionInput


def run_decision(tx: TransactionInput) -> DecisionTrace:
    nodes: list[NodeResult] = []
    failed = False

    for node_id, check in CHECKS:
        if failed:
            nodes.append(
                NodeResult(
                    node_id=node_id,
                    status=NodeStatus.SKIPPED,
                    reason="skipped after an earlier check failed",
                    metadata={},
                )
            )
            continue

        passed, reason, metadata = check(tx)
        nodes.append(
            NodeResult(
                node_id=node_id,
                status=NodeStatus.PASSED if passed else NodeStatus.FAILED,
                reason=reason,
                metadata=metadata,
            )
        )
        if not passed:
            failed = True

    decision = Decision.DECLINE if failed else Decision.APPROVE

    return DecisionTrace(transaction_id=tx.transaction_id, decision=decision, nodes=tuple(nodes))
