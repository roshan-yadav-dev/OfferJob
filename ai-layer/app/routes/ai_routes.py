"""
AI Matching Routes

API endpoints for AI-powered resume-to-job matching.
Routes stay thin and delegate business logic to the service layer.
"""

import logging

from fastapi import APIRouter, Depends, status

from app.core.config import get_settings
from app.schemas.matching_schema import ErrorResponse, MatchRequest, MatchResponse
from app.services.matching_service import (
    MatchingService,
    get_matching_service,
    get_matching_service_status,
    is_matching_service_loaded,
)


logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()


@router.post(
    "/match",
    response_model=MatchResponse,
    status_code=status.HTTP_200_OK,
    tags=["AI Matching"],
    summary="Match Resume to Job",
    description="Find similarity score between a resume and job description",
    responses={
        400: {"model": ErrorResponse, "description": "Invalid input for matching"},
        422: {"model": ErrorResponse, "description": "Request payload validation failed"},
        503: {"model": ErrorResponse, "description": "AI inference is temporarily unavailable"},
        500: {"model": ErrorResponse, "description": "Unexpected server error"},
    },
)
async def match_resume_to_job(
    request: MatchRequest,
    service: MatchingService = Depends(get_matching_service),
) -> MatchResponse:
    """Match a resume to a job description using shared sentence embeddings."""
    response = await service.match(request)
    logger.info("Match computed: score=%s", response.similarityScore)
    return response


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    tags=["AI Matching"],
    summary="AI Service Health",
    description="Check AI matching service health",
)
async def ai_service_health() -> dict:
    """Report whether the matching stack is loaded and ready to serve traffic."""
    status_payload = get_matching_service_status()

    return {
        "status": status_payload["status"],
        "service": settings.APP_NAME,
        "models_loaded": status_payload["models_loaded"],
        "ready_for_matching": status_payload["ready_for_matching"],
        "preload_on_startup": settings.PRELOAD_MODELS_ON_STARTUP,
        "service_info": status_payload.get("service_info"),
        "message": (
            "Sentence-transformer model loaded and ready"
            if status_payload["ready_for_matching"]
            else "Sentence-transformer model has not been loaded yet"
        ),
    }


@router.get(
    "/models",
    status_code=status.HTTP_200_OK,
    tags=["AI Matching"],
    summary="Get Available Models",
    description="List the configured AI model for matching",
)
async def get_available_models() -> dict:
    """Return configured model metadata for diagnostics and debugging."""
    if is_matching_service_loaded():
        service = get_matching_service()
        service_info = service.get_service_info()
        model_info = service_info["model"]
        matcher = service_info["matcher"]
        status_name = "loaded"
    else:
        model_info = {
            "name": settings.MODEL_NAME,
            "library": "sentence-transformers",
            "embedding_dimension": None,
            "cache_dir": settings.MODEL_CACHE_DIR,
            "status": "configured",
        }
        matcher = "semantic_similarity"
        status_name = "configured"

    return {
        "models": [
            {
                **model_info,
                "matcher": matcher,
                "status": status_name,
                "intended_use": "resume_to_job_semantic_matching",
            }
        ],
        "message": "Using a lightweight sentence-transformer model for MVP matching",
    }
