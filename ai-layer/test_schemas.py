import pytest
from pydantic import ValidationError

from app.schemas.matching_schema import ErrorResponse, MatchRequest, MatchResponse


def test_match_request_accepts_valid_payload():
    request = MatchRequest(
        resumeText="Python developer with 5 years of backend experience",
        jobDescription="Looking for a Python API engineer",
    )

    assert request.resumeText.startswith("Python developer")


def test_match_request_rejects_short_text():
    with pytest.raises(ValidationError):
        MatchRequest(
            resumeText="short",
            jobDescription="also short",
        )


def test_match_request_rejects_whitespace_only_text():
    with pytest.raises(ValidationError):
        MatchRequest(
            resumeText="Senior Python backend developer",
            jobDescription="          ",
        )


def test_match_response_rejects_out_of_range_score():
    with pytest.raises(ValidationError):
        MatchResponse(similarityScore=101.5)


def test_error_response_accepts_readable_details():
    response = ErrorResponse(
        error="validation_error",
        message="Request payload validation failed",
        details=[
            {
                "field": "body.resumeText",
                "message": "Field required",
            }
        ],
    )

    assert response.error == "validation_error"
