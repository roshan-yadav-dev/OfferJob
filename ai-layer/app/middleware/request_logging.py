"""
Request Logging Middleware

Logs incoming requests and outgoing responses for visibility and debugging.

Features:
- Unique request ID generation
- Request path, method, and payload logging
- Response status and timing
- Context injection for tracing
"""

import logging
import time
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging_config import generate_request_id, reset_request_id, set_request_id


logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log HTTP requests and responses.
    
    Logs include:
    - Unique request ID (for tracing across logs)
    - Request method, path, and query parameters
    - Response status code
    - Response time (duration)
    - Request size (for large payloads)
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request, measure execution time, log details.
        
        Args:
            request: Incoming HTTP request
            call_next: Next middleware/route handler
        
        Returns:
            HTTP response
        """
        # Generate unique request ID for tracing
        request_id = generate_request_id()
        request_token = set_request_id(request_id)
        
        # Log incoming request
        method = request.method
        path = request.url.path
        query = request.url.query
        
        logger.info(
            "Incoming request: %s %s",
            method,
            path,
            extra={
                "request_id": request_id,
                "query": query if query else None,
                "client": request.client.host if request.client else None,
            },
        )
        
        # Time the request processing
        start_time = time.perf_counter()
        
        try:
            response = await call_next(request)
            duration_ms = (time.perf_counter() - start_time) * 1000
            
            logger.info(
                "Response sent: %s %s -> %d (%0.1fms)",
                method,
                path,
                response.status_code,
                duration_ms,
                extra={
                    "request_id": request_id,
                    "status": response.status_code,
                    "duration_ms": duration_ms,
                },
            )
            
            return response
            
        except Exception as exc:
            duration_ms = (time.perf_counter() - start_time) * 1000
            logger.error(
                "Request failed: %s %s after %0.1fms",
                method,
                path,
                duration_ms,
                exc_info=True,
                extra={
                    "request_id": request_id,
                    "error": str(exc),
                    "duration_ms": duration_ms,
                },
            )
            raise
        finally:
            reset_request_id(request_token)
