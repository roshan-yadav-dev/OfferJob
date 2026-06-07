"""
Application exception types for readable API error handling.
"""

from __future__ import annotations

from typing import Optional


class ServiceError(Exception):
    """Base class for predictable service-layer errors."""

    def __init__(self, message: str, details: Optional[list[dict[str, str]]] = None):
        super().__init__(message)
        self.message = message
        self.details = details


class InvalidMatchInputError(ServiceError):
    """Raised when matching input is invalid after request parsing."""


class AIInferenceError(ServiceError):
    """Raised when the AI model cannot produce a result."""
