from fastapi.testclient import TestClient

import app.services.embedding_service as embedding_service
import app.services.matching_service as matching_service


def test_model_is_loaded_only_once_across_requests(monkeypatch):
    load_count = {"value": 0}

    class LocalFakeSentenceTransformer:
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
            import numpy as np

            def encode_one(text: str):
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

            if isinstance(texts, str):
                return encode_one(texts)

            return np.asarray([encode_one(text) for text in texts], dtype=np.float32)

        def get_sentence_embedding_dimension(self) -> int:
            return len(self._keywords)

    class CountingSentenceTransformer:
        def __init__(self, model_name: str, cache_folder: str | None = None):
            load_count["value"] += 1
            self.model_name = model_name
            self.cache_folder = cache_folder
            self._delegate = LocalFakeSentenceTransformer(model_name, cache_folder)

        def encode(
            self,
            texts,
            convert_to_numpy: bool = True,
            normalize_embeddings: bool = False,
        ):
            return self._delegate.encode(
                texts,
                convert_to_numpy=convert_to_numpy,
                normalize_embeddings=normalize_embeddings,
            )

        def get_sentence_embedding_dimension(self) -> int:
            return self._delegate.get_sentence_embedding_dimension()

    monkeypatch.setattr(
        embedding_service,
        "SentenceTransformer",
        CountingSentenceTransformer,
    )
    monkeypatch.setattr(
        embedding_service,
        "_sentence_transformers_import_error",
        None,
    )

    from app.main import create_app

    with TestClient(create_app()) as client:
        for _ in range(3):
            response = client.post(
                "/api/v1/ai/match",
                json={
                    "resumeText": "Python backend engineer with Django experience",
                    "jobDescription": "Python API developer with backend skills",
                },
            )
            assert response.status_code == 200

    assert load_count["value"] == 1
    assert matching_service.is_matching_service_loaded() is True
    assert embedding_service.is_embedding_service_loaded() is True
