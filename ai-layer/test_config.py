import app.core.config as config_module


def test_settings_read_environment_variables(monkeypatch):
    monkeypatch.setenv("APP_NAME", "Custom Matching Service")
    monkeypatch.setenv("APP_VERSION", "2.1.0")
    monkeypatch.setenv("MODEL_NAME", "test-model")

    config_module.reset_settings_cache()
    settings = config_module.get_settings()

    assert settings.APP_NAME == "Custom Matching Service"
    assert settings.APP_VERSION == "2.1.0"
    assert settings.MODEL_NAME == "test-model"

    config_module.reset_settings_cache()


def test_settings_parse_cors_origins_from_json(monkeypatch):
    monkeypatch.setenv(
        "CORS_ORIGINS",
        '["http://localhost:3000", "http://localhost:5173"]',
    )

    config_module.reset_settings_cache()
    settings = config_module.get_settings()

    assert settings.CORS_ORIGINS == [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    config_module.reset_settings_cache()
