"""
Matching Service Layer

Implements resume-to-job matching using reusable sentence embeddings.
"""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import Optional

from fastapi.concurrency import run_in_threadpool
from sklearn.metrics.pairwise import cosine_similarity

from app.core.exceptions import AIInferenceError, InvalidMatchInputError
from app.schemas.matching_schema import MatchRequest, MatchResponse
from app.services.embedding_service import (
    EmbeddingService,
    get_embedding_service,
    is_embedding_service_loaded,
)


logger = logging.getLogger(__name__)


class MatchingService:
    """
    Service class for resume-to-job matching.

    Responsibilities:
    - Validate and preprocess matching inputs
    - Request embeddings from the shared embedding service
    - Compute similarity scores for API responses
    """

    def __init__(self, embedding_service: Optional[EmbeddingService] = None):
        self.embedding_service = embedding_service or get_embedding_service()
        self.model_name = self.embedding_service.model_name
        self.embedding_dimension = self.embedding_service.embedding_dimension

        logger.info(
            "MatchingService initialized with model '%s' (%s dimensions)",
            self.model_name,
            self.embedding_dimension,
        )

    async def match(self, request: MatchRequest) -> MatchResponse:
        """Match a resume to a job description and return a similarity score as percentage."""
        # Validate inputs with detailed error logging
        try:
            self._validate_inputs(request.resumeText, request.jobDescription)
        except InvalidMatchInputError as exc:
            logger.warning(
                "Input validation failed: %s",
                str(exc),
                extra={
                    "resume_length": len(request.resumeText),
                    "job_length": len(request.jobDescription),
                    "error_code": "VALIDATION_ERROR",
                },
            )
            raise

        # Preprocess texts (normalize whitespace, etc.)
        resume_processed = self._preprocess_text(request.resumeText)
        job_processed = self._preprocess_text(request.jobDescription)

        logger.debug(
            "Processing match request",
            extra={
                "resume_original_length": len(request.resumeText),
                "resume_processed_length": len(resume_processed),
                "job_original_length": len(request.jobDescription),
                "job_processed_length": len(job_processed),
            },
        )

        # Compute similarity with error handling
        try:
            similarity_score = await self._calculate_similarity(
                resume_processed,
                job_processed,
            )
        except InvalidMatchInputError as exc:
            logger.warning(
                "Invalid input during similarity computation: %s",
                str(exc),
                extra={"error_code": "INVALID_INPUT"},
            )
            raise
        except AIInferenceError as exc:
            logger.error(
                "AI inference failed: %s",
                str(exc),
                exc_info=True,
                extra={"error_code": "INFERENCE_ERROR"},
            )
            raise
        except Exception as exc:  # pragma: no cover - safety net
            logger.error(
                "Unexpected error during matching: %s",
                type(exc).__name__,
                exc_info=True,
                extra={"error_code": "UNEXPECTED_ERROR"},
            )
            raise AIInferenceError(
                "The AI matching service could not process this request right now."
            ) from exc

        # Convert 0.0-1.0 score to 0-100 percentage
        similarity_percentage = round(
            max(0.0, min(100.0, similarity_score)),
            4,
        )

        logger.info(
            "Match completed successfully: %.2f%%",
            similarity_percentage*100,
            extra={
                "score": similarity_percentage,
                "model": self.model_name,
            },
        )
        return MatchResponse(similarityScore=similarity_percentage)

    async def _calculate_similarity(self, resume_text: str, job_text: str) -> float:
        """
        Compute semantic similarity between resume and job text using cosine similarity.

        Uses scikit-learn's cosine_similarity on sentence embeddings.
        Embeddings are generated in a threadpool to avoid blocking the FastAPI event loop.
        
        Args:
            resume_text: Preprocessed resume text
            job_text: Preprocessed job description text
        
        Returns:
            float: Cosine similarity score in range 0.0-1.0
                   (caller converts to percentage 0-100)
        
        Algorithm:
            1. Generate embedding for resume (384-dimensional vector)
            2. Generate embedding for job description (384-dimensional vector)
            3. Both embeddings are normalized (L2 norm = 1.0)
            4. Compute cosine similarity = dot product of normalized vectors
            5. Result is guaranteed to be in 0.0-1.0 range
        
        Performance:
            - Model inference: ~5-10ms per text (in threadpool)
            - Cosine similarity: <1ms (CPU-only computation)
            - Total: ~10-15ms per match (acceptable for MVP)
        """
        try:
            embeddings = await run_in_threadpool(
                self.embedding_service.generate_embeddings,
                [resume_text, job_text],
            )
            resume_embedding, job_embedding = embeddings

            similarity_matrix = cosine_similarity(
                [resume_embedding],
                [job_embedding]
            )
            similarity = float(similarity_matrix[0][0])

            logger.debug(
                "Computed cosine similarity between resume and job: %.4f",
                similarity
            )

            return similarity
        except ValueError as exc:
            raise InvalidMatchInputError(str(exc)) from exc
        except Exception as exc:
            logger.exception("Embedding or similarity computation failed")
            raise AIInferenceError(
                "AI inference failed while computing the match score. Please retry shortly."
            ) from exc

    def get_service_info(self) -> dict:
        """Return matching-service metadata for health and diagnostics endpoints."""
        return {
            "status": "ready",
            "matcher": "semantic_similarity",
            "model": self.embedding_service.get_model_info(),
        }

    def _preprocess_text(self, text: str) -> str:
        """Normalize whitespace while keeping the preprocessing beginner-friendly."""
        return " ".join(text.strip().split())

    def _validate_inputs(self, resume: str, job: str) -> None:
        """
        Validate inputs before processing.
        
        Checks:
        - Both texts are non-empty and at least 10 characters
        - Neither text exceeds 50,000 characters
        
        Raises:
            InvalidMatchInputError: If validation fails (with detailed message)
        
        """
        # Validate resume
        if not resume or len(resume.strip()) < 10:
            logger.debug(
                "Resume validation failed: text too short",
                extra={"resume_length": len(resume) if resume else 0},
            )
            raise InvalidMatchInputError("Resume text must be at least 10 characters")

        # Validate job description
        if not job or len(job.strip()) < 10:
            logger.debug(
                "Job description validation failed: text too short",
                extra={"job_length": len(job) if job else 0},
            )
            raise InvalidMatchInputError("Job description must be at least 10 characters")

        # Check maximum length
        if len(resume) > 50000:
            logger.debug(
                "Resume validation failed: text too long",
                extra={"resume_length": len(resume), "max_length": 50000},
            )
            raise InvalidMatchInputError("Resume text exceeds maximum length (50,000 characters)")
        
        if len(job) > 50000:
            logger.debug(
                "Job description validation failed: text too long",
                extra={"job_length": len(job), "max_length": 50000},
            )
            raise InvalidMatchInputError("Job description exceeds maximum length (50,000 characters)")


@lru_cache(maxsize=1)
def get_matching_service() -> MatchingService:
    """Return the singleton matching service instance for this process."""
    try:
        return MatchingService()
    except AIInferenceError:
        raise
    except Exception as exc:
        logger.exception("Failed to initialize matching service")
        raise AIInferenceError(
            "The AI model is currently unavailable. Please try again later."
        ) from exc


def is_matching_service_loaded() -> bool:
    """Check whether the singleton matching service has been initialized."""
    return get_matching_service.cache_info().currsize > 0


def reset_matching_service() -> None:
    """Clear the cached singleton. Useful for tests."""
    get_matching_service.cache_clear()


def get_matching_service_status() -> dict:
    """Return non-invasive status information about the matching stack."""
    if not is_matching_service_loaded():
        return {
            "status": "not_loaded",
            "models_loaded": False,
            "ready_for_matching": False,
        }

    service = get_matching_service()
    return {
        "status": "healthy",
        "models_loaded": is_embedding_service_loaded(),
        "ready_for_matching": True,
        "service_info": service.get_service_info(),
    }
