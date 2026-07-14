"""
Application entrypoint. Assembles the FastAPI app from its parts:
routes, CORS policy, and exception handling. Contains no business logic.
"""

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.api.routes import router as decision_router
from app.logging_config import configure_logging

configure_logging()
logger = logging.getLogger("fraud_visualizer")

app = FastAPI(
    title="Fraud Decision Visualizer API",
    version="1.0.0",
    # No default docs exposure assumptions — explicit is better than implicit
    docs_url="/docs",
    redoc_url=None,
)

# --- CORS -------------------------------------------------------------
# Explicit origin allowlist. No wildcard "*" — fail closed, not open.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
    ],
    allow_credentials=False,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

# --- Exception handlers ------------------------------------------------
# One handler per failure class. No generic catch-all that swallows
# and silently returns 200-with-error-in-body — fail loud, fail fast.

@app.exception_handler(RequestValidationError)
async def validation_error_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    logger.warning("request_validation_failed", extra={"path": request.url.path})
    return JSONResponse(
        status_code=422,
        content={"error": "invalid_transaction_input", "detail": exc.errors()},
    )


@app.exception_handler(ValidationError)
async def pydantic_model_error_handler(
    request: Request, exc: ValidationError
) -> JSONResponse:
    # Raised if a check function constructs a malformed NodeResult —
    # this is a programmer error in the engine, not a client error.
    logger.error("engine_produced_invalid_trace", extra={"path": request.url.path})
    return JSONResponse(
        status_code=500,
        content={"error": "internal_trace_error"},
    )


# --- Routes -------------------------------------------------------------
app.include_router(decision_router, prefix="/api/v1")