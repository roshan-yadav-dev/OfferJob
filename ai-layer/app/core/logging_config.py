"""
Structured Logging Configuration

Provides production-ready logging for the Smart AI Matching Service.

Features:
- Structured JSON format for cloud/Docker environments
- Request tracing with unique request IDs
- Separate log levels by module for fine-grained control
- Both stdout (for Docker) and file-based logging
- Clean, readable format for local development

Philosophy:
- Simple is better than complex for MVP
- Focus on actionable logs (failures, performance, requests)
- Prepare for cloud logging solutions (ELK, CloudWatch, etc.)
- Include context (request IDs, timestamps, service name)
"""

import json
import logging
import logging.handlers
import sys
import uuid
from contextvars import ContextVar, Token
from datetime import datetime
from pathlib import Path

from app.core.config import get_settings


_STANDARD_LOG_RECORD_KEYS = {
    "args",
    "asctime",
    "created",
    "exc_info",
    "exc_text",
    "filename",
    "funcName",
    "levelname",
    "levelno",
    "lineno",
    "message",
    "module",
    "msecs",
    "msg",
    "name",
    "pathname",
    "process",
    "processName",
    "relativeCreated",
    "stack_info",
    "thread",
    "threadName",
    "taskName",
    "request_id",
}

_request_id_context: ContextVar[str] = ContextVar("request_id", default="no-request")


class _RequestContextFilter(logging.Filter):
    """Add request ID to all log records for tracing."""

    def filter(self, record: logging.LogRecord) -> bool:
        """Add request_id to log record."""
        record.request_id = _request_id_context.get()
        return True


# Global instance for middleware to access
_context_filter = _RequestContextFilter()


def set_request_id(request_id: str) -> Token[str]:
    """Set the current request ID for log context (called from middleware)."""
    return _request_id_context.set(request_id)


def reset_request_id(token: Token[str]) -> None:
    """Restore the previous request ID after a request completes."""
    _request_id_context.reset(token)


def generate_request_id() -> str:
    """Generate a unique request ID for tracing."""
    return uuid.uuid4().hex[:8]


def _extract_extra_fields(record: logging.LogRecord) -> dict:
    """Return non-standard logging fields attached via `extra=`."""
    return {
        key: value
        for key, value in record.__dict__.items()
        if key not in _STANDARD_LOG_RECORD_KEYS and not key.startswith("_")
    }


class _StructuredFormatter(logging.Formatter):
    """
    Format logs as structured JSON for cloud environments.
    
    Output example:
    {
        "timestamp": "2026-05-28T14:32:45.123Z",
        "level": "INFO",
        "logger": "app.services.matching_service",
        "message": "Match computed",
        "request_id": "a1b2c3d4",
        "service": "Smart AI Matching Service",
        "extra": {"similarityScore": 82.41}
    }
    """
    
    def __init__(self, service_name: str):
        self.service_name = service_name
        super().__init__()
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record as JSON."""
        # Build structured log object
        log_dict = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": getattr(record, "request_id", "no-request"),
            "service": self.service_name,
        }
        
        # Include exception info if present
        if record.exc_info:
            log_dict["exception"] = self.formatException(record.exc_info)

        extra_fields = _extract_extra_fields(record)
        if extra_fields:
            log_dict["extra"] = extra_fields
        
        return json.dumps(log_dict, default=str)


class _ReadableFormatter(logging.Formatter):
    """
    Human-readable format for local development.
    
    Example output:
    [2026-05-28 14:32:45] INFO [a1b2c3d4] app.services.matching_service
      Match computed: score=82.41
    """
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record as readable text."""
        timestamp = self.formatTime(record, "%Y-%m-%d %H:%M:%S")
        request_id = getattr(record, "request_id", "no-req")[:8]
        
        # Base message
        message = f"[{timestamp}] {record.levelname:8} [{request_id}] {record.name}"
        message += f"\n  {record.getMessage()}"
        
        # Include exception if present
        if record.exc_info:
            message += f"\n  {self.formatException(record.exc_info)}"
        
        return message


def configure_logging(debug: bool = False) -> None:
    """
    Configure application-wide logging.
    
    Sets up:
    - Root logger at INFO level (or DEBUG if specified)
    - Structured JSON output to stdout (for Docker/cloud)
    - Readable text output to file (for local investigation)
    - Request context injection via filter
    
    Args:
        debug: If True, use DEBUG level and verbose output
    """
    settings = get_settings()
    log_level_name = settings.LOG_LEVEL.upper() if not debug else "DEBUG"
    log_level = getattr(logging, log_level_name, logging.INFO)
    
    # Get root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    
    # Remove any existing handlers to avoid duplicates
    root_logger.handlers.clear()
    
    # --- STDOUT Handler (JSON for Docker/Cloud) ---
    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setLevel(log_level)
    json_formatter = _StructuredFormatter(settings.APP_NAME)
    stdout_handler.setFormatter(json_formatter)
    stdout_handler.addFilter(_context_filter)
    root_logger.addHandler(stdout_handler)
    
    # --- FILE Handler (Readable format for investigation) ---
    # Create logs directory if it doesn't exist
    log_dir = Path("./logs")
    log_dir.mkdir(exist_ok=True)
    
    log_file = log_dir / "app.log"
    file_handler = logging.handlers.RotatingFileHandler(
        log_file,
        maxBytes=10 * 1024 * 1024,  # 10MB per file
        backupCount=5,  # Keep 5 backup files
    )
    file_handler.setLevel(log_level)
    readable_formatter = _ReadableFormatter()
    file_handler.setFormatter(readable_formatter)
    file_handler.addFilter(_context_filter)
    root_logger.addHandler(file_handler)
    
    # --- Module-specific log level overrides (optional) ---
    # These can be configured via environment if needed
    # Example: FINE_GRAINED_LOG_LEVELS="app.services.embedding_service:DEBUG"
    fine_grained = settings.FINE_GRAINED_LOG_LEVELS
    if fine_grained:
        for module_config in fine_grained.split(","):
            module_config = module_config.strip()
            if ":" in module_config:
                module_name, level_name = module_config.split(":", 1)
                module_logger = logging.getLogger(module_name.strip())
                module_logger.setLevel(getattr(logging, level_name.upper(), logging.INFO))
    
    # Log startup info
    logger = logging.getLogger(__name__)
    logger.info(
        "Logging configured: level=%s, json_stdout=yes, file=%s",
        log_level_name,
        log_file,
    )
