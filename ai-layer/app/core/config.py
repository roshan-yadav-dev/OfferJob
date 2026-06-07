"""
Application configuration loaded from environment variables.

This module keeps configuration in one place, loads `.env` automatically,
and exposes a cached `Settings` object for the rest of the app.
"""

from __future__ import annotations

import json
import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

# Load `.env` once at import time so local development works without extra setup.
load_dotenv(dotenv_path=ENV_FILE)


def _get_bool_env(name: str, default: bool) -> bool:
    """Read a boolean-like environment variable."""
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    return raw_value.strip().lower() in {"1", "true", "yes", "on"}


def _get_int_env(name: str, default: int) -> int:
    """Read an integer environment variable with a safe fallback."""
    raw_value = os.getenv(name)
    if raw_value is None:
        return default

    try:
        return int(raw_value)
    except ValueError:
        return default


def _get_list_env(name: str, default: list[str]) -> list[str]:
    """Read a list from JSON or comma-separated environment input."""
    raw_value = os.getenv(name)
    if raw_value is None or not raw_value.strip():
        return default

    try:
        parsed_value = json.loads(raw_value)
        if isinstance(parsed_value, list):
            return [str(item).strip() for item in parsed_value if str(item).strip()]
    except json.JSONDecodeError:
        pass

    return [item.strip() for item in raw_value.split(",") if item.strip()]


class Settings:
    """Central configuration object for the Smart AI Matching Service."""

    def __init__(self) -> None:
        # App metadata
        self.APP_NAME = os.getenv("APP_NAME", "Smart AI Matching Service")
        self.APP_VERSION = os.getenv("APP_VERSION", "1.0.0")

        # AI model configuration
        self.MODEL_NAME = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
        self.MODEL_CACHE_DIR = os.getenv("MODEL_CACHE_DIR", "./models")
        self.PRELOAD_MODELS_ON_STARTUP = _get_bool_env(
            "PRELOAD_MODELS_ON_STARTUP",
            True,
        )

        # Server configuration
        self.HOST = os.getenv("HOST", "0.0.0.0")
        self.PORT = _get_int_env("PORT", 8000)
        self.DEBUG = _get_bool_env("DEBUG", False)
        self.LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
        self.FINE_GRAINED_LOG_LEVELS = os.getenv("FINE_GRAINED_LOG_LEVELS", "")

        # Cross-origin settings
        self.CORS_ORIGINS = _get_list_env(
            "CORS_ORIGINS",
            [
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:8080",
            ],
        )
        # Warn if using development origins in production
        if not self.DEBUG and any('localhost' in origin for origin in self.CORS_ORIGINS):
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(
                "CORS_ORIGINS contains localhost URLs in non-debug mode. "
                "Please set CORS_ORIGINS environment variable with production domains."
            )

        # Optional future dependencies
        self.DATABASE_URL = os.getenv(
            "DATABASE_URL",
            "mongodb://localhost:27017/ai_matching_service",
        )
        self.MAX_WORKERS = _get_int_env("MAX_WORKERS", 4)

        # Helpful for debugging local configuration issues
        self.ENV_FILE = str(ENV_FILE)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached settings instance for the current process."""
    return Settings()


def reset_settings_cache() -> None:
    """Clear the cached settings object. Useful in tests."""
    get_settings.cache_clear()
