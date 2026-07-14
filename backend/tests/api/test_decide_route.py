"""
Integration test for the decision endpoint via FastAPI's TestClient.
Exercises the full HTTP -> route -> engine -> response path for a happy
path and a client-input validation failure.

Note: the implemented route is POST /api/v1/decisions (see
app/api/routes.py), not /api/v1/decide.
"""

from app.main import app
from fastapi.testclient import TestClient

from tests.conftest import valid_transaction_kwargs

client = TestClient(app)


def _json_payload(**overrides) -> dict:
    kwargs = valid_transaction_kwargs()
    kwargs.update(overrides)
    kwargs["timestamp"] = kwargs["timestamp"].isoformat()
    kwargs["ip_address"] = str(kwargs["ip_address"])
    return kwargs


def test_decisions_route_happy_path_returns_approve():
    response = client.post("/api/v1/decisions", json=_json_payload())

    assert response.status_code == 200
    body = response.json()
    assert body["decision"] == "APPROVE"
    assert len(body["nodes"]) == 5


def test_decisions_route_rejects_negative_amount_with_422():
    response = client.post("/api/v1/decisions", json=_json_payload(amount="-5.00"))

    assert response.status_code == 422
    assert response.json()["error"] == "invalid_transaction_input"
