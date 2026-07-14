"""
Ingress check: rejects transactions whose timestamp isn't plausibly
"now" — too far in the future (clock skew) or too far in the past
(a stale or replayed payload). This is the only check concerned with
the integrity of the payload itself rather than the transaction's risk.
"""

from datetime import datetime, timedelta, timezone

from app.models.transaction import TransactionInput

_MAX_FUTURE_SKEW = timedelta(minutes=5)
_MAX_STALENESS = timedelta(minutes=15)


def check_ingress(tx: TransactionInput) -> tuple[bool, str, dict]:
    now = datetime.now(timezone.utc)
    ts = tx.timestamp if tx.timestamp.tzinfo else tx.timestamp.replace(tzinfo=timezone.utc)
    age = now - ts

    metadata = {"timestamp": tx.timestamp.isoformat(), "age_seconds": age.total_seconds()}

    if age < -_MAX_FUTURE_SKEW:
        return False, "transaction timestamp is further in the future than the allowed skew", metadata

    if age > _MAX_STALENESS:
        return False, "transaction timestamp is older than the allowed staleness window", metadata

    return True, "transaction timestamp is within the accepted freshness window", metadata
