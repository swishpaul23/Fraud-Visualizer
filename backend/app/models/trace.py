"""
Output contract: the full trace of node evaluations for one transaction,
plus the overall decision.

Frozen: once the engine hands back a DecisionTrace, nothing downstream
(API layer, tests) can alter what actually happened during evaluation.
`nodes` is a tuple rather than a list for the same reason — a frozen
model still allows in-place mutation of a mutable field's contents.
"""

from enum import Enum

from pydantic import BaseModel, ConfigDict


class NodeStatus(str, Enum):
    PASSED = "PASSED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"


class Decision(str, Enum):
    APPROVE = "APPROVE"
    DECLINE = "DECLINE"


class NodeResult(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    node_id: str
    status: NodeStatus
    reason: str
    metadata: dict


class DecisionTrace(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    transaction_id: str
    decision: Decision
    nodes: tuple[NodeResult, ...]
