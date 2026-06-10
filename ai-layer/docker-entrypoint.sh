#!/bin/sh
# Docker entrypoint script for Smart AI Matching Service
# Handles startup configuration and graceful execution

set -e

# Default values
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"
WORKERS="${WORKERS:-1}"
LOG_LEVEL="${LOG_LEVEL:-info}"
RELOAD="${RELOAD:-false}"

# Echo startup information
echo "Starting Smart AI Matching Service..."
echo "  Host: $HOST"
echo "  Port: $PORT"
echo "  Workers: $WORKERS"
echo "  Log Level: $LOG_LEVEL"

# Preload models on startup if enabled
if [ "${PRELOAD_MODELS_ON_STARTUP}" = "true" ]; then
    echo "Preloading ML models..."
    python3 -c "from app.services.matching_service import get_matching_service; service = get_matching_service(); print('Models preloaded successfully')" || true
fi

# Start Uvicorn with configured parameters
if [ "$RELOAD" = "true" ]; then
    exec uvicorn \
        app.main:app \
        --host "$HOST" \
        --port "$PORT" \
        --log-level "$LOG_LEVEL" \
        --reload
fi

exec python -m uvicorn \
    app.main:app \
    --host "$HOST" \
    --port "$PORT" \
    --workers "$WORKERS" \
    --log-level "$LOG_LEVEL"\
    --reload 