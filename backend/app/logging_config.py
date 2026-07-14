"""
Structured JSON logging for the decision engine.

The only fields ever attached to a log record here are trace_id,
node_id, status, and evaluated_at_ms. user_id, amount_cents, and a
NodeResult's raw metadata dict are never passed to the logger — there
is no parameter for any of them on log_node_result or log_engine_error,
so there is no code path that could pass them in. See
backend/tests/engine/test_logging.py, which asserts this stays true by
patching logging.Logger._log and inspecting every payload produced
during a real run_decision() call.
"""

import json
import logging
import sys
import time

_ENGINE_LOGGER_NAME = "fraud_visualizer.engine"

_LEVEL_BY_STATUS = {
    "PASSED": logging.INFO,
    "SKIPPED": logging.INFO,
    "FAILED": logging.WARNING,
}

_EXTRA_FIELDS = ("trace_id", "node_id", "status", "evaluated_at_ms")


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        for field in _EXTRA_FIELDS:
            if hasattr(record, field):
                payload[field] = getattr(record, field)
        if record.exc_info:
            payload["exc_info"] = self.formatException(record.exc_info)
        return json.dumps(payload)


def configure_logging() -> None:
    """Attaches a JSON stdout handler to the engine logger. Call once at app startup."""
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())

    logger = logging.getLogger(_ENGINE_LOGGER_NAME)
    logger.handlers = [handler]
    logger.propagate = False
    logger.setLevel(logging.INFO)


def log_node_result(trace_id: str, node_id: str, status: str) -> None:
    logger = logging.getLogger(_ENGINE_LOGGER_NAME)
    logger.log(
        _LEVEL_BY_STATUS[status],
        "node_evaluated",
        extra={
            "trace_id": trace_id,
            "node_id": node_id,
            "status": status,
            "evaluated_at_ms": int(time.time() * 1000),
        },
    )


def log_engine_error(trace_id: str, node_id: str | None, exc: Exception) -> None:
    logger = logging.getLogger(_ENGINE_LOGGER_NAME)
    logger.log(
        logging.ERROR,
        "engine_error",
        extra={
            "trace_id": trace_id,
            "node_id": node_id,
            "status": "ERROR",
            "evaluated_at_ms": int(time.time() * 1000),
        },
        exc_info=exc,
    )
