import numpy as np
import pytest
from fastapi.testclient import TestClient

import app.services.embedding_service as embedding_service
import app.services.matching_service as matching_service


class FakeSentenceTransformer:
    """Small in-memory fake used to test matching behavior without a real model."""

    _keywords = (
        "python",
        "django",
        "fastapi",
        "backend",
        "api",
        "react",
        "javascript",
        "design",
        "figma",
        "sql",
        "node",
    )

    def __init__(self, model_name: str, cache_folder: str | None = None):
        self.model_name = model_name
        self.cache_folder = cache_folder

    def encode(
        self,
        texts,
        convert_to_numpy: bool = True,
        normalize_embeddings: bool = False,
    ):
        if isinstance(texts, str):
            return self._encode_one(texts, normalize_embeddings)

        embeddings = [self._encode_one(text, normalize_embeddings) for text in texts]
        return np.asarray(embeddings, dtype=np.float32)

    def get_sentence_embedding_dimension(self) -> int:
        return len(self._keywords)

    def _encode_one(self, text: str, normalize_embeddings: bool) -> np.ndarray:
        lowered = text.lower()
        vector = np.array(
            [1.0 if keyword in lowered else 0.0 for keyword in self._keywords],
            dtype=np.float32,
        )

        if not vector.any():
            vector[0] = 1.0

        if normalize_embeddings:
            norm = float(np.linalg.norm(vector))
            if norm > 0:
                vector = vector / norm

        return vector


@pytest.fixture(autouse=True)
def reset_singletons():
    matching_service.reset_matching_service()
    embedding_service.reset_embedding_service()
    yield
    matching_service.reset_matching_service()
    embedding_service.reset_embedding_service()


@pytest.fixture
def fake_sentence_transformer(monkeypatch):
    monkeypatch.setattr(
        embedding_service,
        "SentenceTransformer",
        FakeSentenceTransformer,
    )
    monkeypatch.setattr(
        embedding_service,
        "_sentence_transformers_import_error",
        None,
    )
    return FakeSentenceTransformer


@pytest.fixture
def client(fake_sentence_transformer):
    from app.main import create_app

    with TestClient(create_app()) as test_client:
        yield test_client
