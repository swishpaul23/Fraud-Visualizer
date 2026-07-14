"""
The single source of truth for which checks run and in what order.
To change decisioning order, edit this list — nowhere else.
"""

from app.engine.checks.geo import check_geo
from app.engine.checks.ingress import check_ingress
from app.engine.checks.proxy import check_proxy
from app.engine.checks.resolution import check_resolution
from app.engine.checks.velocity import check_velocity

CHECKS = (
    ("ingress", check_ingress),
    ("geo", check_geo),
    ("proxy", check_proxy),
    ("velocity", check_velocity),
    ("resolution", check_resolution),
)
