def test_match_endpoint_returns_similarity_score(client):
    response = client.post(
        "/api/v1/ai/match",
        json={
            "resumeText": "Senior Python backend developer with Django and FastAPI experience",
            "jobDescription": "Looking for a Python backend engineer with API and Django skills",
        },
    )

    assert response.status_code == 200
    payload = response.json()

    assert "similarityScore" in payload
    assert 0.0 <= payload["similarityScore"] <= 100.0
    assert payload["similarityScore"] > 50.0


def test_match_endpoint_rejects_invalid_payload(client):
    response = client.post(
        "/api/v1/ai/match",
        json={"resumeText": "short"},
    )

    assert response.status_code == 422
    payload = response.json()
    assert payload["error"] == "validation_error"
    assert payload["message"] == "Request payload validation failed"
    assert "details" in payload


def test_match_endpoint_rejects_whitespace_only_text(client):
    response = client.post(
        "/api/v1/ai/match",
        json={
            "resumeText": "Senior Python backend developer",
            "jobDescription": "          ",
        },
    )

    assert response.status_code == 422
    payload = response.json()
    assert payload["error"] == "validation_error"
    assert any(
        detail["field"] == "body.jobDescription"
        for detail in payload["details"]
    )


def test_match_endpoint_returns_503_on_ai_inference_failure(client, monkeypatch):
    from app.services.matching_service import get_matching_service

    service = get_matching_service()

    def fail_generate_embeddings(texts):
        raise RuntimeError("model backend unavailable")

    monkeypatch.setattr(
        service.embedding_service,
        "generate_embeddings",
        fail_generate_embeddings,
    )

    response = client.post(
        "/api/v1/ai/match",
        json={
            "resumeText": "Senior Python backend developer with Django and FastAPI experience",
            "jobDescription": "Looking for a Python backend engineer with API and Django skills",
        },
    )

    assert response.status_code == 503
    payload = response.json()
    assert payload["error"] == "ai_inference_failed"
    assert "retry" in payload["message"].lower()


def test_ai_health_endpoint_reports_loaded_model(client):
    response = client.get("/api/v1/ai/health")

    assert response.status_code == 200
    payload = response.json()

    assert payload["status"] == "healthy"
    assert payload["models_loaded"] is True
    assert payload["ready_for_matching"] is True


def test_models_endpoint_returns_sentence_transformer_details(client):
    response = client.get("/api/v1/ai/models")

    assert response.status_code == 200
    payload = response.json()

    assert len(payload["models"]) == 1
    model = payload["models"][0]
    assert model["name"] == "all-MiniLM-L6-v2"
    assert model["library"] == "sentence-transformers"
