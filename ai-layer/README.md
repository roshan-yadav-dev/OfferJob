# Smart AI Matching Service

FastAPI microservice for resume-to-job semantic matching using `sentence-transformers`.

## What Changed

- Uses `sentence-transformers` with the lightweight `all-MiniLM-L6-v2` model
- Loads the embedding model once per process and reuses it across requests
- Separates embedding generation from matching logic for cleaner reuse
- Preloads the model at startup by default for lower first-request latency
- Loads environment configuration from `.env` using `python-dotenv`

## Architecture

```text
ai-layer/
├── app/
│   ├── core/
│   │   ├── config.py
│   │   └── dependencies.py
│   ├── routes/
│   │   ├── ai_routes.py
│   │   └── health.py
│   ├── schemas/
│   │   └── matching_schema.py
│   └── services/
│       ├── embedding_service.py
│       ├── matching_service.py
│       └── matching.py
├── conftest.py
└── test_*.py
```

## Core Flow

1. FastAPI starts and optionally preloads the model.
2. `EmbeddingService` owns the singleton `SentenceTransformer`.
3. `MatchingService` asks for embeddings and computes cosine-style similarity.
4. Routes stay thin and only handle HTTP concerns.

## Why Singleton Model Loading Matters

- Loading `all-MiniLM-L6-v2` on every request would add repeated startup latency.
- Reusing one in-memory model avoids duplicate RAM usage inside the same process.
- A single shared loader keeps behavior predictable and easier to monitor.

## Why a Lightweight Model Fits an MVP

- `all-MiniLM-L6-v2` is small enough to start quickly and run on modest infrastructure.
- It gives strong semantic-search quality without the cost of a larger transformer.
- It keeps deployment, debugging, and scaling simpler while the product is still proving demand.

## Memory And Performance Notes

- Model memory is mostly a one-time process cost; repeated requests mainly add small embedding arrays.
- Embedding generation is CPU-bound, so the service pushes it into a threadpool to avoid blocking the FastAPI event loop.
- Preloading reduces first-hit latency, while lazy singleton reuse keeps ongoing request cost lower.

## Error Handling

- Invalid JSON or missing fields return `422 Unprocessable Entity`
- Empty or whitespace-only text is rejected with a readable validation response
- Service-level bad input returns `400 Bad Request`
- AI inference failures return `503 Service Unavailable`
- Unexpected failures return `500 Internal Server Error`

## Endpoints

- `POST /api/v1/ai/match`
- `GET /api/v1/ai/health`
- `GET /api/v1/ai/models`
- `GET /api/v1/health`
- `GET /api/v1/health/ready`

## Configuration

The service reads configuration from `.env` through `app/core/config.py`. Copy `.env.example` when setting up a new environment.

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_NAME` | `Smart AI Matching Service` | Application name used in API metadata and health responses |
| `APP_VERSION` | `1.0.0` | Application version shown by the API |
| `MODEL_NAME` | `all-MiniLM-L6-v2` | Sentence-transformer model name |
| `MODEL_CACHE_DIR` | `./models` | Local cache for downloaded model files |
| `PRELOAD_MODELS_ON_STARTUP` | `True` | Warm the model during app startup |
| `HOST` | `0.0.0.0` | FastAPI host |
| `PORT` | `8000` | FastAPI port |

## Running

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Testing

The tests mock `SentenceTransformer`, so they validate service structure and singleton behavior without downloading a real model.
