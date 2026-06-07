"""
AI Matching Request/Response Schemas

Pydantic models for resume-to-job matching API.
Core schemas with minimal, focused design for maximum clarity.
"""

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class MatchRequest(BaseModel):
    """
    Request payload for matching a resume to a job posting.
    
    This is the Data Transfer Object (DTO) that defines the contract
    between client and server. Changes here require API versioning.
    
    Attributes:
        resumeText: Raw resume text/content
                   - Minimum 10 characters (realistic resume snippet)
                   - Maximum 50,000 characters (prevents abuse)
        jobDescription: Job posting text/description
                       - Minimum 10 characters (realistic job posting)
                       - Maximum 50,000 characters (prevents abuse)
    
    Example:
        {
            "resumeText": "Senior Python developer with 5 years of Django/FastAPI experience",
            "jobDescription": "Looking for Python backend engineer with REST API expertise"
        }
    
    Validation:
        - Both fields are required (no defaults)
        - Both must be strings
        - Both have length constraints enforced by Pydantic
        - Invalid requests return HTTP 422 with detailed error messages
    """
    
    resumeText: str = Field(
        ...,
        min_length=10,
        max_length=50000,
        description="Resume content (raw text, minimum 10 characters)"
    )
    
    jobDescription: str = Field(
        ...,
        min_length=10,
        max_length=50000,
        description="Job posting description (raw text, minimum 10 characters)"
    )

    @field_validator("resumeText", "jobDescription", mode="before")
    @classmethod
    def validate_text_content(cls, value: object) -> object:
        """Reject empty or whitespace-only text and normalize outer whitespace."""
        if not isinstance(value, str):
            return value

        cleaned_value = value.strip()

        if not cleaned_value:
            raise ValueError("Text input cannot be empty or whitespace only")

        if len(cleaned_value) < 10:
            raise ValueError("Text input must be at least 10 characters after trimming")

        return cleaned_value
    
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "resumeText": "Senior Python developer with 5 years Django experience, REST APIs, PostgreSQL",
                "jobDescription": "Seeking Python/Django backend engineer. Requirements: Django, REST APIs, SQL",
            }
        },
    )


class MatchResponse(BaseModel):
    """
    Response payload from resume-to-job matching.
    
    This is the Data Transfer Object (DTO) that represents the matching result.
    Clients depend on this structure being stable.
    
    Attributes:
        similarityScore: Match quality score as percentage
                        - Range: 0.0 to 100.0
                        - 0.0 = No match
                        - 50.0 = Moderate match
                        - 100.0 = Perfect match
                        - Always rounded to 2 decimal places
    
    Example Response:
        {
            "similarityScore": 82.41
        }
    
    Design Notes:
        - Single focused field (similarity percentage)
        - Range restricted to 0.0-100.0 (percentage scale)
        - Always returns 2 decimal places for precision
        - Computed using scikit-learn cosine similarity on embeddings
        - Future enhancements (confidence, skills) should be additive
        - API versioning required if field changes/removed
    """
    
    similarityScore: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Match score as percentage (0.0 = no match, 100.0 = perfect match)"
    )
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "similarityScore": 82.41,
            }
        }
    )


class ErrorDetail(BaseModel):
    """Single readable error detail item."""

    field: str = Field(..., description="Field or component related to the error")
    message: str = Field(..., description="Human-readable error detail")


class ErrorResponse(BaseModel):
    """Standard JSON error response returned by the API."""

    error: str = Field(..., description="Stable error code")
    message: str = Field(..., description="Short human-readable summary")
    details: Optional[list[ErrorDetail]] = Field(
        default=None,
        description="Optional per-field or per-component error details",
    )
