"""
Resolution check: an account is "resolved" (trustworthy enough to
transact) if it clears at least one strong identity signal — a
recognized device, a verified email, or sufficient account age. An
account with none of these is the profile of a throwaway fraud account.
"""

from app.models.transaction import TransactionInput

_MIN_TRUSTED_ACCOUNT_AGE_DAYS = 30


def check_resolution(tx: TransactionInput) -> tuple[bool, str, dict]:
    metadata = {
        "device_recognized": tx.device_recognized,
        "email_verified": tx.email_verified,
        "account_age_days": tx.account_age_days,
    }

    resolved = (
        tx.device_recognized
        or tx.email_verified
        or tx.account_age_days >= _MIN_TRUSTED_ACCOUNT_AGE_DAYS
    )

    if not resolved:
        return False, "account has no recognized device, verified email, or sufficient age", metadata

    return True, "account has at least one trusted identity signal", metadata
