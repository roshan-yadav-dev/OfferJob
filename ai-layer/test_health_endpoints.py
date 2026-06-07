def test_platform_health_endpoints(client):
    endpoints = [
        "/api/v1/health",
        "/api/v1/health/live",
        "/api/v1/health/ready",
        "/api/v1/health/startup",
    ]

    for endpoint in endpoints:
        response = client.get(endpoint)
        assert response.status_code == 200


def test_readiness_probe_keeps_return_shape(client):
    response = client.get("/api/v1/health/ready")

    assert response.status_code == 200
    payload = response.json()

    assert payload["ready"] is True
    assert "dependencies" in payload
