"""
Smart AI Matching Service - FastAPI Application Entry Point

This module initializes and configures the FastAPI application.
Handles:
- App instantiation with metadata
- Middleware configuration (CORS, logging)
- Route registration
- Startup/shutdown events
- Health checks and diagnostics

The app stays modular at initialization, while optional model preloading
happens during startup to reduce first-request latency.
"""

import logging
from typing import Dict, Any

from fastapi import FastAPI
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware

from app.core.exception_handlers import register_exception_handlers
from app.core.config import get_settings
from app.core.logging_config import configure_logging
from app.middleware.request_logging import RequestLoggingMiddleware
from app.routes import health, ai_routes
from app.services.matching_service import get_matching_service

# Load configuration from environment
settings = get_settings()

# Configure production-style structured logging
configure_logging(debug=settings.DEBUG)
logger = logging.getLogger(__name__)


def register_middleware(app: FastAPI) -> None:
    """
    Register all middleware in the correct order.
    
    Middleware order matters - later middleware processes requests first.
    Order: Request Logging -> CORS -> Error handling
    
    Args:
        app: FastAPI application instance
    """
    # Request logging middleware (logs all requests/responses with timing)
    app.add_middleware(RequestLoggingMiddleware)
    
    # CORS middleware (allows cross-origin requests)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info("CORS configured with origins: %s", settings.CORS_ORIGINS)


def register_routes(app: FastAPI) -> None:
    """
    Register all API routes/routers.
    
    Routers are registered with version prefixes for backward compatibility.
    New features should be added as separate routers.
    
    Args:
        app: FastAPI application instance
    """
    # Health check routes
    app.include_router(
        health.router,
        prefix="/api/v1",
        tags=["Health"]
    )
    
    # AI Matching routes
    app.include_router(
        ai_routes.router,
        prefix="/api/v1/ai",
        tags=["AI Matching"]
    )
    
    logger.info("Routes registered successfully")


def register_events(app: FastAPI) -> None:
    """
    Register startup and shutdown event handlers.
    
    Useful for:
    - Initializing connections (DB, cache, external services)
    - Cleanup on shutdown
    - Logging lifecycle events
    
    Args:
        app: FastAPI application instance
    """
    @app.on_event("startup")
    async def startup_event():
        """Handle startup events"""
        logger.info(
            "Service startup: %s (v%s)",
            settings.APP_NAME,
            settings.APP_VERSION,
            extra={
                "environment": "debug" if settings.DEBUG else "production",
                "log_level": settings.LOG_LEVEL,
                "model": settings.MODEL_NAME,
            }
        )

        if settings.PRELOAD_MODELS_ON_STARTUP:
            logger.info("Preloading embedding model on startup...")
            try:
                await run_in_threadpool(get_matching_service)
                logger.info("Embedding model preloaded successfully")
            except Exception:
                logger.exception("Failed to preload model on startup")
        else:
            logger.info("Model preload disabled; first match request will initialize the model")
    
    @app.on_event("shutdown")
    async def shutdown_event():
        """Handle shutdown events"""
        logger.info("Service shutdown: %s", settings.APP_NAME)


def create_app() -> FastAPI:
    """
    Application factory function.
    
    Creates and configures the FastAPI application instance.
    This pattern allows for easier testing and multiple app instances.
    
    Returns:
        FastAPI: Configured application instance
    """
    # Create FastAPI app with metadata
    app = FastAPI(
        title=settings.APP_NAME,
        description=(
            "AI-powered matching service for job-resume recommendations. "
            "Provides intelligent candidate-job matching capabilities using "
            "sentence-transformer embeddings."
        ),
        version=settings.APP_VERSION,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json"
    )
    
    # Register components
    register_middleware(app)
    register_exception_handlers(app)
    register_routes(app)
    register_events(app)
    
    # Root diagnostic endpoint
    @app.get("/")
    async def root() -> Dict[str, Any]:
        """
        Root endpoint - service information and diagnostics.
        
        Returns:
            dict: Service metadata and current status
        """
        return {
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "running",
            "environment": "debug" if settings.DEBUG else "production"
        }
    
    logger.info("FastAPI application created and configured")
    return app


# Create the application instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    
    # Run with development settings
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
