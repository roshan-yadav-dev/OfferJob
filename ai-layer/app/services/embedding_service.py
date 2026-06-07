"""
Embedding Service

Owns the sentence-transformer model lifecycle and exposes reusable
embedding generation helpers for the rest of the application.
"""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import Sequence

import numpy as np

from app.core.config import get_settings

try:
    from sentence_transformers import SentenceTransformer
except ImportError as exc:  # pragma: no cover - depends on runtime env
    SentenceTransformer = None  # type: ignore[assignment]
    _sentence_transformers_import_error = exc
else:
    _sentence_transformers_import_error = None


logger = logging.getLogger(__name__)


class EmbeddingService:
    """Load a sentence-transformer once and reuse it across requests."""

    def __init__(self, model_name: str | None = None):
        settings = get_settings()

        self.model_name = model_name or settings.MODEL_NAME
        self.cache_dir = settings.MODEL_CACHE_DIR
        self._model = self._load_model()
        self.embedding_dimension = self._resolve_embedding_dimension()

    def _load_model(self) -> "SentenceTransformer":
        """Instantiate the configured sentence-transformer model."""
        if SentenceTransformer is None:
            logger.error(
                "Sentence-transformers library not available",
                extra={
                    "error_code": "IMPORT_ERROR",
                    "library": "sentence-transformers",
                },
            )
            raise RuntimeError(
                "sentence-transformers is not installed. "
                "Install dependencies from requirements.txt before starting the service."
            ) from _sentence_transformers_import_error

        logger.info(
            "Loading sentence-transformer model",
            extra={
                "model": self.model_name,
                "cache_dir": self.cache_dir,
            },
        )
        
        try:
            model = SentenceTransformer(
                self.model_name,
                cache_folder=self.cache_dir,
            )
            logger.info(
                "Sentence-transformer model loaded successfully",
                extra={
                    "model": self.model_name,
                    "library": "sentence-transformers",
                },
            )
            return model
        except Exception as exc:
            logger.error(
                "Failed to load sentence-transformer model: %s",
                type(exc).__name__,
                exc_info=True,
                extra={
                    "model": self.model_name,
                    "error_code": "MODEL_LOAD_FAILED",
                },
            )
            raise

    def _resolve_embedding_dimension(self) -> int:
        """Read embedding dimension from the loaded model."""
        dimension = self._model.get_sentence_embedding_dimension()
        if dimension is None:
            raise RuntimeError(
                f"Could not determine embedding dimension for model '{self.model_name}'"
            )
        return int(dimension)

    def generate_embedding(self, text: str) -> np.ndarray:
        """Generate one normalized embedding vector for a text string."""
        cleaned_text = text.strip()
        if not cleaned_text:
            logger.debug("Empty text provided for embedding generation")
            raise ValueError("Text cannot be empty when generating embeddings")

        try:
            embedding = self._model.encode(
                cleaned_text,
                convert_to_numpy=True,
                normalize_embeddings=True,
            )
            logger.debug(
                "Embedding generated for text",
                extra={
                    "text_length": len(cleaned_text),
                    "embedding_shape": embedding.shape,
                },
            )
            return np.asarray(embedding, dtype=np.float32)
        except Exception as exc:
            logger.error(
                "Failed to generate embedding: %s",
                type(exc).__name__,
                exc_info=True,
                extra={
                    "text_length": len(cleaned_text),
                    "error_code": "EMBEDDING_GENERATION_FAILED",
                },
            )
            raise

    def generate_embeddings(self, texts: Sequence[str]) -> np.ndarray:
        """Generate normalized embeddings for a batch of texts."""
        cleaned_texts = [text.strip() for text in texts]
        if not cleaned_texts:
            logger.debug("Empty batch provided for embedding generation")
            raise ValueError("At least one text is required to generate embeddings")
        if any(not text for text in cleaned_texts):
            logger.debug("Empty text found in batch")
            raise ValueError("Texts cannot be empty when generating embeddings")

        try:
            embeddings = self._model.encode(
                cleaned_texts,
                convert_to_numpy=True,
                normalize_embeddings=True,
            )
            logger.debug(
                "Batch embeddings generated",
                extra={
                    "batch_size": len(cleaned_texts),
                    "embeddings_shape": embeddings.shape,
                    "average_text_length": sum(len(t) for t in cleaned_texts) // len(cleaned_texts),
                },
            )
            return np.asarray(embeddings, dtype=np.float32)
        except Exception as exc:
            logger.error(
                "Failed to generate batch embeddings: %s",
                type(exc).__name__,
                exc_info=True,
                extra={
                    "batch_size": len(cleaned_texts),
                    "error_code": "BATCH_EMBEDDING_GENERATION_FAILED",
                },
            )
            raise

    def get_model_info(self) -> dict:
        """Return lightweight metadata for diagnostics endpoints."""
        return {
            "name": self.model_name,
            "library": "sentence-transformers",
            "embedding_dimension": self.embedding_dimension,
            "cache_dir": self.cache_dir,
            "status": "loaded",
        }


@lru_cache(maxsize=1)
def get_embedding_service() -> EmbeddingService:
    """Return the singleton embedding service instance for this process."""
    return EmbeddingService()


def is_embedding_service_loaded() -> bool:
    """Check whether the singleton embedding service has been initialized."""
    return get_embedding_service.cache_info().currsize > 0


def reset_embedding_service() -> None:
    """Clear the cached singleton. Useful for tests."""
    get_embedding_service.cache_clear()
