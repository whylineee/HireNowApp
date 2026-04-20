from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

from jobs.views import job_detail, jobs_collection


def health(_: object) -> JsonResponse:
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health),
    path("api/jobs/", jobs_collection),
    path("api/jobs/<int:job_id>/", job_detail),
]
