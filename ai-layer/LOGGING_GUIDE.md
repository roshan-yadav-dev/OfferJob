"""
Production Logging System for Smart AI Matching Service

This guide explains the logging architecture, best practices, and how to
use logs for debugging and monitoring the AI service.
"""

# =============================================================================

# 1. STRUCTURED LOGGING OVERVIEW

# =============================================================================

## What is Structured Logging?

Structured logging captures log entries as **machine-readable data** (JSON) instead of
plain text. This enables:

- **Searchability**: Parse logs programmatically in cloud platforms
- **Traceability**: Follow requests across services using request IDs
- **Analysis**: Aggregate errors, performance metrics, trends
- **Alerting**: Trigger automations on log patterns

### Example Log Entry

**Readable format (local development):**

```
[2026-05-28 14:32:45] INFO [a1b2c3d4] app.services.matching_service
  Match completed successfully: 82.41%
```

**Structured JSON format (Docker/cloud):**

```json
{
    "timestamp": "2026-05-28T14:32:45.123Z",
    "level": "INFO",
    "logger": "app.services.matching_service",
    "message": "Match completed successfully: 82.41%",
    "request_id": "a1b2c3d4",
    "service": "Smart AI Matching Service",
    "extra": {
        "score": 82.41,
        "model": "all-MiniLM-L6-v2"
    }
}
```

# =============================================================================

# 2. LOGGING BEST PRACTICES (MVP-FRIENDLY)

# =============================================================================

## Log Levels

- **DEBUG**: Development-only details (model loading, embeddings generated)
- **INFO**: Normal operation events (requests processed, matches computed)
- **WARNING**: Unexpected but recoverable issues (validation errors, retries)
- **ERROR**: Failures requiring attention (inference errors, exceptions)
- **CRITICAL**: System-level failures (not used in MVP)

## What to Log

### ✅ DO Log:

- Request arrival (method, path, client IP)
- Processing stages (validation, inference, response)
- Completion with outcome (success, timing, score)
- Failures with error codes and context
- Service startup/shutdown

### ❌ DON'T Log:

- Every function call (creates noise)
- Sensitive data (API keys, personal info)
- Raw embeddings (vectors are too verbose)
- Successful health checks (poll spam)

## Log Line Examples

**Good: Contextual, actionable**

```python
logger.info(
    "Match completed successfully: %.2f%%",
    similarity_percentage,
    extra={
        "score": similarity_percentage,
        "model": self.model_name,
    },
)
```

**Bad: Too verbose, no context**

```python
logger.info("Starting embedding generation...")
logger.info("Encoding text...")
logger.info("Computing similarity...")
```

## Request Tracing

Every HTTP request gets a unique 8-character ID:

```
Request A1B2C3D4:
  10:15:00 - Incoming POST /api/v1/ai/match
  10:15:01 - Input validation passed
  10:15:02 - Embeddings generated
  10:15:02 - Response sent: 82.41%
```

All logs from the same request include the same ID, allowing you to trace
the entire request flow through the system.

# =============================================================================

# 3. LOGGING OUTPUT TARGETS (DOCKER-READY)

# =============================================================================

## Local Development

**Two output files:**

1. **Console (JSON)**
    - Real-time structured format
    - Piped by container orchestrators to cloud logging
    - Useful for watching live logs: `docker logs -f container-name`

2. **File (./logs/app.log - Readable text)**
    - Rotates at 10MB (keeps 5 backups)
    - Human-readable format for debugging
    - Only exists locally; not committed to git

## Docker Deployment

**Console output only (JSON)**

- Container logs captured automatically
- Sent to: CloudWatch, ELK, Datadog, etc.
- Parsed by log aggregators using JSON structure

**No file output in container**

- Ephemeral containers (logs disappear on restart)
- Use centralized logging instead (more reliable)

# =============================================================================

# 4. CONFIGURATION

# =============================================================================

## Environment Variables

```bash
# Global log level (DEBUG, INFO, WARNING, ERROR)
LOG_LEVEL=INFO

# Debug mode enables verbose logging
DEBUG=False
```

## Enabling Debug Logging

**Development:**

```bash
# Terminal or .env
DEBUG=True  # or LOG_LEVEL=DEBUG
```

**Docker:**

```yaml
# docker-compose.yml
environment:
    DEBUG: 'true'
    LOG_LEVEL: 'DEBUG'
```

## Module-Level Override (Future)

Fine-grained control for specific modules:

```python
# Configure embedding service to DEBUG while rest stays INFO
FINE_GRAINED_LOG_LEVELS="app.services.embedding_service:DEBUG"
```

# =============================================================================

# 5. MONITORING FAILURES

# =============================================================================

## Common Error Codes in Logs

- **VALIDATION_ERROR**: Input validation failed (text too short/long)
- **INVALID_INPUT**: Malformed data during processing
- **INFERENCE_ERROR**: Model inference failed
- **MODEL_LOAD_FAILED**: Could not load sentence-transformer model
- **EMBEDDING_GENERATION_FAILED**: Text encoding error
- **BATCH_EMBEDDING_GENERATION_FAILED**: Batch processing error
- **UNEXPECTED_ERROR**: Unhandled exception

## Searching for Errors

**Local development:**

```bash
# Find errors in past 24 hours
grep ERROR logs/app.log | tail -20

# Count errors by type
grep ERROR logs/app.log | grep -o '"error_code":"[^"]*"' | sort | uniq -c
```

**Cloud (ELK, CloudWatch, etc.):**

```json
# Search for all inference failures
{"level": "ERROR", "error_code": "INFERENCE_ERROR"}

# Failed matches in last hour
{"logger": "app.services.matching_service", "level": "ERROR",
 "timestamp": {"$gte": "2026-05-28T13:00:00Z"}}
```

# =============================================================================

# 6. PERFORMANCE MONITORING

# =============================================================================

## Request Timing

The RequestLoggingMiddleware logs response times:

```json
{
    "message": "Response sent: POST /api/v1/ai/match -> 200 (45.3ms)",
    "duration_ms": 45.3,
    "status": 200
}
```

**Performance targets:**

- Healthy: <50ms per request
- Acceptable: 50-100ms
- Degraded: >100ms (investigate model or infrastructure)

## Analyzing Performance

**Local:**

```bash
# Average response time for matches
grep "Response sent.*ai/match" logs/app.log | \
  awk -F'[()]' '{sum+=$2; count++} END {print sum/count " ms"}'
```

**Cloud:**

```sql
# Datadog
avg:api.request_duration{path:"/api/v1/ai/match"} by {status}

# CloudWatch Insights
fields @timestamp, @duration | filter @message like /Response sent/
```

# =============================================================================

# 7. TROUBLESHOOTING WITH LOGS

# =============================================================================

## Service Won't Start

1. Check logs for model load error:

    ```bash
    grep MODEL_LOAD_FAILED logs/app.log
    ```

2. Verify HuggingFace connectivity:
    ```bash
    grep "Loading sentence-transformer" logs/app.log
    ```

## Match Requests Failing

1. Find request ID from API response headers
2. Search logs for that request ID:

    ```bash
    grep "a1b2c3d4" logs/app.log
    ```

3. Trace the request:
    - Look for "Incoming request"
    - Check validation output
    - Find error or "Response sent"

## High Latency

1. Check response times in logs:

    ```bash
    grep "Response sent" logs/app.log | tail -10
    ```

2. Analyze model inference times (DEBUG logging):
    ```bash
    LOG_LEVEL=DEBUG python -m uvicorn app.main:app
    grep "Computed cosine similarity" logs/app.log
    ```

## Memory Issues

1. Monitor log file growth:

    ```bash
    du -h logs/
    # Should stay <50MB with rotation
    ```

2. Check for infinite loops (repeated log spam):
    ```bash
    tail -f logs/app.log | sort | uniq -c | sort -rn
    ```

# =============================================================================

# 8. INTEGRATION WITH CLOUD LOGGING

# =============================================================================

## Docker Compose Example

```yaml
version: '3.8'
services:
    ai-service:
        image: ai-matching:latest
        environment:
            LOG_LEVEL: INFO
            DEBUG: 'false'
        # Logs automatically sent to stdout in JSON format
        # Docker handles forwarding to syslog, cloud provider, etc.

    # Optional: Local ELK stack for development
    elasticsearch:
        image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
        environment:
            discovery.type: single-node

    logstash:
        image: docker.elastic.co/logstash/logstash:8.0.0
        volumes:
            - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
        ports:
            - '5000:5000'

    kibana:
        image: docker.elastic.co/kibana/kibana:8.0.0
        ports:
            - '5601:5601'
```

## Logstash Configuration (logstash.conf)

```
input {
  http {
    port => 5000
  }
}

filter {
  json {
    source => "message"
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "ai-service-%{+YYYY.MM.dd}"
  }
}
```

# =============================================================================

# 9. MVP LOGGING CHECKLIST

# =============================================================================

- [x] Structured logging (JSON to stdout, readable to file)
- [x] Request ID tracing
- [x] Request/response logging middleware
- [x] Error context and codes
- [x] Service startup/shutdown events
- [x] Model loading diagnostics
- [x] Embedding generation errors
- [x] Match processing steps
- [x] Performance timing
- [x] Log rotation (local file)
- [ ] Cloud logging integration (future)
- [ ] Real-time alerting (future)
- [ ] Dashboard/visualization (future)

# =============================================================================

# 10. NEXT STEPS FOR PRODUCTION

# =============================================================================

1. **Add log shipping to cloud**
    - CloudWatch (AWS)
    - Cloud Logging (GCP)
    - Azure Monitor

2. **Set up alerting**
    - High error rate (>5% of requests)
    - Slow requests (>200ms consistently)
    - Model load failures

3. **Create dashboards**
    - Request volume and latency
    - Error rates by type
    - Model performance metrics

4. **Retention policy**
    - Keep 30 days of logs (cloud)
    - Local logs delete automatically (rotation)
