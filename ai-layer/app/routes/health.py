"""
Health Check Routes

Provides health and readiness endpoints for:
- Liveness probes (is the service running?)
- Readiness probes (is the service ready for traffic?)
- Load balancer health checks
- Container orchestration (Docker, Kubernetes)

Health endpoint patterns:
- GET /health: Liveness probe (process is alive)
- GET /health/ready: Readiness probe (ready to handle requests)
- GET /health/live: Alternative liveness probe (K8s standard)
"""

from typing import Dict, Any
from fastapi import APIRouter, status

from app.core.config import get_settings

router = APIRouter()
settings = get_settings()


# ============================================================================
# Health Check Endpoints
# ============================================================================

@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    tags=["Health"],
    summary="Liveness Probe",
    description="Check if the service is running (alive)"
)
async def health_check() -> Dict[str, Any]:
    """
    Liveness probe endpoint.
    
    Used by:
    - Container orchestrators (Docker, Kubernetes) to detect if process is alive
    - Load balancers to check basic connectivity
    
    Returns:
        dict: Service health status with metadata
        
    Response Example:
        {
            "status": "OK",
            "service": "Smart AI Matching Service",
            "version": "1.0.0",
            "timestamp": "2024-12-19T10:30:45Z"
        }
    """
    return {
        "status": "OK",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@router.get(
    "/health/live",
    status_code=status.HTTP_200_OK,
    tags=["Health"],
    summary="Liveness Probe (Kubernetes Standard)",
    description="Kubernetes-standard liveness endpoint"
)
async def liveness_probe() -> Dict[str, str]:
    """
    Kubernetes-standard liveness probe.
    
    Kubernetes uses this to determine if the pod should be restarted.
    - Returns 200: Pod is alive, keep running
    - Returns 5xx: Pod is dead, restart it
    
    Returns:
        dict: Liveness status
        
    Response Example:
        {"status": "alive"}
    """
    return {"status": "alive"}


@router.get(
    "/health/ready",
    status_code=status.HTTP_200_OK,
    tags=["Health"],
    summary="Readiness Probe",
    description="Check if the service is ready to accept traffic"
)
async def readiness_probe() -> Dict[str, Any]:
    """
    Readiness probe endpoint.
    
    Used by:
    - Container orchestrators to determine if service should receive traffic
    - Service meshes to route traffic conditionally
    - Load balancers for intelligent health checking
    
    When NOT ready, returns 503 Service Unavailable.
    This prevents requests to uninitialized services.
    
    Returns:
        dict: Readiness status with dependency info
        
    Response Example:
        {
            "ready": true,
            "status": "Service ready to accept requests",
            "dependencies": {
                "database": "ok",
                "cache": "ok"
            }
        }
    """
    # In production, check actual dependencies here:
    # - Database connection pool
    # - Cache connectivity
    # - External service availability
    # For now, service is immediately ready (no dependencies)
    
    return {
        "ready": True,
        "status": "Service ready to accept requests",
        "dependencies": {
            "database": "not_configured",
            "cache": "not_configured"
        }
    }


@router.get(
    "/health/startup",
    status_code=status.HTTP_200_OK,
    tags=["Health"],
    summary="Startup Probe",
    description="Check if the service has completed startup"
)
async def startup_probe() -> Dict[str, str]:
    """
    Startup probe endpoint (Kubernetes 1.16+).
    
    Used by Kubernetes to know when the application has started.
    Useful for slow-starting applications.
    
    Returns:
        dict: Startup status
        
    Response Example:
        {"status": "startup_complete"}
    """
    # In production, check if all initialization complete
    # - Load configuration
    # - Initialize connections
    # - Warm up caches
    
    return {"status": "startup_complete"}
