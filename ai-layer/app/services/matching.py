"""
Legacy matching service compatibility layer.

This module preserves the older import path while delegating all matching work
to the sentence-transformer based `MatchingService`.
"""

from __future__ import annotations

from functools import lru_cache

from app.schemas.matching import MatchingRequest, MatchingResponse
from app.schemas.matching_schema import MatchRequest
from app.services.matching_service import (
    MatchingService,
    get_matching_service as get_v2_matching_service,
)


class AIMatchingService:
    """Backward-compatible wrapper around the current matching service."""

    def __init__(self, matching_service: MatchingService | None = None):
        self._matching_service = matching_service or get_v2_matching_service()

    async def match_resume_to_job(self, request: MatchingRequest) -> MatchingResponse:
        modern_request = MatchRequest(
            resumeText=request.resumeText,
            jobDescription=request.jobDescription,
        )
        modern_response = await self._matching_service.match(modern_request)

        return MatchingResponse(
            similarityScore=modern_response.similarityScore,
            confidence=None,
            matchedSkills=None,
            missingSkills=None,
        )


@lru_cache(maxsize=1)
def get_matching_service() -> AIMatchingService:
    """Return the legacy service wrapper as a cached singleton."""
    return AIMatchingService()
