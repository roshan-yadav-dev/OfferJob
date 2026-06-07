"""
Centralized FastAPI exception handlers for readable API responses.
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import AIInferenceError, InvalidMatchInputError


logger = logging.getLogger(__name__)


def _build_error_response(
    error: str,
    message: str,
    details: Optional[list[dict[str, str]]] = None,
) -> dict:
    """Return a consistent JSON error payload."""
    payload = {
        "error": error,
        "message": message,
    }
    if details:
        payload["details"] = details
    return payload


def _format_validation_errors(exc: RequestValidationError) -> list[dict[str, str]]:
    """Convert FastAPI validation errors into a simpler structure."""
    formatted_errors: list[dict[str, str]] = []

    for error in exc.errors():
        location = ".".join(str(part) for part in error.get("loc", []))
        formatted_errors.append(
            {
                "field": location or "body",
                "message": error.get("msg", "Invalid value"),
            }
        )

    return formatted_errors


def register_exception_handlers(app: FastAPI) -> None:
    """Register all application exception handlers."""

    @app.exception_handler(RequestValidationError)
    async def request_validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        logger.warning("Validation error on %s", request.url.path)
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=_build_error_response(
                error="validation_error",
                message="Request payload validation failed",
                details=_format_validation_errors(exc),
            ),
        )

    @app.exception_handler(InvalidMatchInputError)
    async def invalid_match_input_exception_handler(
        request: Request,
        exc: InvalidMatchInputError,
    ) -> JSONResponse:
        logger.warning("Invalid matching input on %s: %s", request.url.path, exc.message)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=_build_error_response(
                error="invalid_input",
                message=exc.message,
                details=exc.details,
            ),
        )

    @app.exception_handler(AIInferenceError)
    async def ai_inference_exception_handler(
        request: Request,
        exc: AIInferenceError,
    ) -> JSONResponse:
        logger.error("AI inference failure on %s: %s", request.url.path, exc.message)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=_build_error_response(
                error="ai_inference_failed",
                message=exc.message,
                details=exc.details,
            ),
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request,
        exc: StarletteHTTPException,
    ) -> JSONResponse:
        logger.warning("HTTP exception on %s: %s", request.url.path, exc.detail)
        return JSONResponse(
            status_code=exc.status_code,
            content=_build_error_response(
                error="http_error",
                message=str(exc.detail),
            ),
            headers=exc.headers,
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request,
        exc: Exception,
    ) -> JSONResponse:
        logger.error("Unhandled server error on %s", request.url.path, exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_build_error_response(
                error="internal_server_error",
                message="Unexpected server error. Please try again later.",
            ),
        )
