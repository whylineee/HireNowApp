from __future__ import annotations

import os


def _allowed_origins() -> list[str]:
    raw = os.getenv(
        "DJANGO_CORS_ALLOWED_ORIGINS",
        "http://localhost:8081,http://127.0.0.1:8081,http://localhost:19006,http://127.0.0.1:19006",
    )
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


ALLOWED_CORS_ORIGINS = set(_allowed_origins())
ALLOWED_CORS_HEADERS = "Content-Type, Authorization"
ALLOWED_CORS_METHODS = "GET, POST, OPTIONS"


class SimpleCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            response = self._build_preflight_response()
        else:
            response = self.get_response(request)

        origin = request.headers.get("Origin")
        if origin and origin in ALLOWED_CORS_ORIGINS:
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Headers"] = ALLOWED_CORS_HEADERS
            response["Access-Control-Allow-Methods"] = ALLOWED_CORS_METHODS
            response["Access-Control-Allow-Credentials"] = "true"
            response["Vary"] = "Origin"

        return response

    @staticmethod
    def _build_preflight_response():
        from django.http import HttpResponse

        return HttpResponse(status=204)
