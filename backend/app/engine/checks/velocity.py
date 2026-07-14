"""
Velocity check: caps how many transactions an account can make in a
short window and how many distinct accounts can share a single device
in a day. Thresholds are local to this check — tune them here, not by
pushing exceptions into other checks.
"""

from app.models.transaction import TransactionInput

_MAX_TRANSACTIONS_PER_HOUR = 5
_MAX_TRANSACTIONS_PER_DAY = 20
_MAX_ACCOUNTS_PER_DEVICE_PER_DAY = 3


def check_velocity(tx: TransactionInput) -> tuple[bool, str, dict]:
    metadata = {
        "transactions_from_account_1h": tx.transactions_from_account_1h,
        "transactions_from_account_24h": tx.transactions_from_account_24h,
        "distinct_accounts_on_device_24h": tx.distinct_accounts_on_device_24h,
    }

    if tx.transactions_from_account_1h > _MAX_TRANSACTIONS_PER_HOUR:
        return False, "account exceeded max transactions in the last hour", metadata

    if tx.transactions_from_account_24h > _MAX_TRANSACTIONS_PER_DAY:
        return False, "account exceeded max transactions in the last 24 hours", metadata

    if tx.distinct_accounts_on_device_24h > _MAX_ACCOUNTS_PER_DEVICE_PER_DAY:
        return False, "device shared by too many distinct accounts in the last 24 hours", metadata

    return True, "account and device velocity within accepted limits", metadata
