"""
Dependencies Module - FastAPI dependency injection utilities

Defines reusable dependencies for route handlers.
"""

from app.core.config import Settings, get_settings as get_cached_settings


def get_settings() -> Settings:
    """
    Dependency to inject application settings
    
    Returns:
        Settings: Application configuration object
    """
    return get_cached_settings()
