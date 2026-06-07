import pytest

from app.core.exceptions import AIInferenceError, InvalidMatchInputError
from app.schemas.matching_schema import MatchRequest
from app.services.embedding_service import get_embedding_service
from app.services.matching_service import get_matching_service


@pytest.mark.asyncio
async def test_matching_service_returns_similarity_score(fake_sentence_transformer):
    service = get_matching_service()

    response = await service.match(
        MatchRequest(
            resumeText="Senior Python backend developer with Django and SQL",
            jobDescription="Python backend engineer with Django API experience",
        )
    )

    assert 0.0 <= response.similarityScore <= 100.0
    assert response.similarityScore > 50.0


def test_embedding_service_reuses_singleton_instance(fake_sentence_transformer):
    service_one = get_embedding_service()
    service_two = get_embedding_service()

    assert service_one is service_two
    assert service_one.model_name == "all-MiniLM-L6-v2"


@pytest.mark.asyncio
async def test_matching_service_rejects_empty_text_after_trimming(fake_sentence_transformer):
    service = get_matching_service()

    with pytest.raises(InvalidMatchInputError):
        await service.match(
            MatchRequest.model_construct(
                resumeText="          ",
                jobDescription="Python backend engineer with Django experience",
            )
        )


@pytest.mark.asyncio
async def test_matching_service_wraps_inference_failures(fake_sentence_transformer, monkeypatch):
    service = get_matching_service()

    def fail_generate_embeddings(texts):
        raise RuntimeError("model failure")

    monkeypatch.setattr(
        service.embedding_service,
        "generate_embeddings",
        fail_generate_embeddings,
    )

    with pytest.raises(AIInferenceError):
        await service.match(
            MatchRequest(
                resumeText="Senior Python backend developer with Django and SQL",
                jobDescription="Python backend engineer with Django API experience",
            )
        )
