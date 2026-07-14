"""
Input contract for a transaction submitted for a fraud decision.

Frozen: once constructed, a TransactionInput cannot be mutated, so no
check can alter the record another check reads later in the same run.
Every field is required — velocity, device, and geo signals are treated
as already resolved/aggregated by whatever system hands the transaction
to this engine, not as optional extras this engine could derive itself.
"""

from datetime import datetime
from decimal import Decimal
from ipaddress import IPv4Address, IPv6Address
from typing import Union

from pydantic import BaseModel, ConfigDict, Field

IPAddress = Union[IPv4Address, IPv6Address]


class TransactionInput(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    # --- Identity ---------------------------------------------------
    transaction_id: str = Field(min_length=1)
    account_id: str = Field(min_length=1)

    # --- Money --------------------------------------------------------
    amount: Decimal = Field(gt=0)
    currency: str = Field(min_length=3, max_length=3)

    # --- Timing -------------------------------------------------------
    timestamp: datetime

    # --- Network --------------------------------------------------------
    ip_address: IPAddress
    ip_country: str = Field(min_length=2, max_length=2)
    is_known_proxy: bool
    is_known_datacenter: bool

    # --- Declared / resolved geography -----------------------------------
    billing_country: str = Field(min_length=2, max_length=2)
    shipping_country: str = Field(min_length=2, max_length=2)
    account_home_country: str = Field(min_length=2, max_length=2)

    # --- Device & velocity (pre-aggregated upstream) ----------------------
    device_id: str = Field(min_length=1)
    device_recognized: bool
    distinct_accounts_on_device_24h: int = Field(ge=0)
    transactions_from_account_1h: int = Field(ge=0)
    transactions_from_account_24h: int = Field(ge=0)

    # --- Account identity resolution ---------------------------------------
    account_age_days: int = Field(ge=0)
    email_verified: bool
