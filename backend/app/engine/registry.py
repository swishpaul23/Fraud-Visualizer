"""
The single source of truth for which checks run and in what order.
To change decisioning order, edit this list — nowhere else.
"""

from app.engine.checks.amount_risk import check_amount_risk
from app.engine.checks.geo import check_geo
from app.engine.checks.ingress import check_ingress
from app.engine.checks.proxy import check_proxy
from app.engine.checks.resolution import check_resolution
from app.engine.checks.velocity import check_velocity

CHECKS = (
    ("ingress", check_ingress),
    ("geo", check_geo),
    ("proxy", check_proxy),
    # amount_risk goes here rather than first/last: ingress/geo/proxy/
    # amount_risk are all facts about this one transaction in isolation
    # (payload validity, location, network reputation, value) and don't
    # need any account/device history; velocity/resolution are the only
    # two checks that depend on aggregated account/device behavior. This
    # keeps that split intact instead of interleaving them. All checks
    # here are cheap (no I/O), so the ordering is chosen for narrative
    # clarity, not fail-fast performance.
    ("amount_risk", check_amount_risk),
    ("velocity", check_velocity),
    ("resolution", check_resolution),
)
