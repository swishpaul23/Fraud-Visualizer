"""
Thin HTTP adapter over the decision engine. Parses the request body into
a TransactionInput and returns the DecisionTrace produced by
run_decision. No decisioning logic lives here — that belongs entirely to
the engine.
"""

from fastapi import APIRouter

from app.engine.runner import run_decision
from app.models.trace import DecisionTrace
from app.models.transaction import TransactionInput

router = APIRouter()


@router.post("/decisions", response_model=DecisionTrace)
async def create_decision(transaction: TransactionInput) -> DecisionTrace:
    return run_decision(transaction)
