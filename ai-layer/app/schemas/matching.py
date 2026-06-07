"""
AI Matching Request/Response Schemas

Pydantic models for data validation and API documentation.
"""

from pydantic import BaseModel, Field
from typing import Optional


class MatchingRequest(BaseModel):
    """
    Request payload for resume-to-job matching.
    
    Attributes:
        resumeText: Raw resume text or resume content
        jobDescription: Job posting text or description
        userId: (Optional) User ID for tracking/logging
        jobId: (Optional) Job posting ID for tracking
    
    Example:
        {
            "resumeText": "Python developer with 5 years Django experience",
            "jobDescription": "Seeking Python/Django backend engineer",
            "userId": "user_123",
            "jobId": "job_456"
        }
    """
    resumeText: str = Field(
        ...,
        min_length=10,
        max_length=50000,
        description="Resume content (raw text)"
    )
    jobDescription: str = Field(
        ...,
        min_length=10,
        max_length=50000,
        description="Job posting description"
    )
    userId: Optional[str] = Field(
        None,
        description="User ID for tracking (optional)"
    )
    jobId: Optional[str] = Field(
        None,
        description="Job ID for tracking (optional)"
    )


class MatchingResponse(BaseModel):
    """
    Response payload for resume-to-job matching.
    
    Attributes:
        similarityScore: Score between 0.0-1.0 indicating match quality
        confidence: (Future) Confidence level in the score
        matchedSkills: (Future) List of skills matched
        missingSkills: (Future) List of required skills not found
    
    Example:
        {
            "similarityScore": 0.78,
            "confidence": 0.85,
            "matchedSkills": ["Python", "Django", "REST API"],
            "missingSkills": ["AWS", "Docker"]
        }
    """
    similarityScore: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Match score between 0.0 (no match) and 1.0 (perfect match)"
    )
    confidence: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Confidence in the score (0.0-1.0)"
    )
    matchedSkills: Optional[list] = Field(
        None,
        description="List of matched skills (future feature)"
    )
    missingSkills: Optional[list] = Field(
        None,
        description="List of required but missing skills (future feature)"
    )


class HealthCheckResponse(BaseModel):
    """Response for health check endpoints"""
    status: str
    message: Optional[str] = None


class ErrorResponse(BaseModel):
    """
    Standard error response format.
    
    Used for validation errors, service errors, etc.
    """
    error: str = Field(..., description="Error type/code")
    message: str = Field(..., description="Detailed error message")
    details: Optional[dict] = Field(None, description="Additional error details")
