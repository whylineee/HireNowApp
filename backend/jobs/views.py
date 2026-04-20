from __future__ import annotations

import json
from datetime import timedelta

from django.http import HttpRequest, HttpResponseNotAllowed, JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import Job


def _parse_non_negative_int(value: str, default: int) -> int:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return default
    return max(parsed, 0)


def _parse_limit(value: str, default: int = 50, max_limit: int = 200) -> int:
    limit = _parse_non_negative_int(value, default)
    if limit == 0:
        return default
    return min(limit, max_limit)


def _pluralize_days(days: int) -> str:
    if days % 10 == 1 and days % 100 != 11:
        return "день"
    if days % 10 in {2, 3, 4} and days % 100 not in {12, 13, 14}:
        return "дні"
    return "днів"


def _humanize_posted_at(value):
    now = timezone.localtime(timezone.now())
    posted_at = timezone.localtime(value)
    delta = now - posted_at

    if delta < timedelta(hours=1):
        return "щойно"

    if posted_at.date() == now.date():
        return "Сьогодні"

    days = delta.days
    return f"{days} {_pluralize_days(days)} тому"


def _serialize_job(job: Job) -> dict[str, object]:
    return {
        "id": str(job.id),
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "salary": job.salary or None,
        "type": job.type,
        "postedAt": _humanize_posted_at(job.posted_at),
        "description": job.description,
        "requirements": job.requirements or [],
        "logo": job.logo or None,
    }


def _filter_jobs(request: HttpRequest):
    jobs = Job.objects.filter(is_active=True)

    query = request.GET.get("query", "").strip()
    location = request.GET.get("location", "").strip()
    job_type = request.GET.get("type", "").strip()

    if query:
        jobs = jobs.filter(
            Q(title__icontains=query)
            | Q(company__icontains=query)
            | Q(description__icontains=query)
        )

    if location:
        jobs = jobs.filter(location__icontains=location)

    if job_type:
        jobs = jobs.filter(type=job_type)

    return jobs.only(
        "id",
        "title",
        "company",
        "location",
        "salary",
        "type",
        "posted_at",
        "description",
        "requirements",
        "logo",
    ).order_by("-posted_at", "-created_at")


def jobs_list(request: HttpRequest) -> JsonResponse:
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET", "OPTIONS"])

    limit = _parse_limit(request.GET.get("limit", "50"))
    offset = _parse_non_negative_int(request.GET.get("offset", "0"), 0)

    queryset = _filter_jobs(request)
    results = [_serialize_job(job) for job in queryset[offset : offset + limit]]
    return JsonResponse(results, safe=False)


def job_detail(request: HttpRequest, job_id: int) -> JsonResponse:
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET", "OPTIONS"])

    job = get_object_or_404(Job, pk=job_id, is_active=True)
    return JsonResponse(_serialize_job(job))


@csrf_exempt
def jobs_collection(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        return jobs_list(request)

    if request.method != "POST":
        return HttpResponseNotAllowed(["GET", "POST", "OPTIONS"])

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON body."}, status=400)

    required_fields = ("title", "company", "location", "type", "description")
    missing = [field for field in required_fields if not str(payload.get(field, "")).strip()]
    if missing:
        return JsonResponse({"detail": f"Missing fields: {', '.join(missing)}"}, status=400)

    if payload["type"] not in Job.JobType.values:
        return JsonResponse({"detail": "Invalid job type."}, status=400)

    requirements = payload.get("requirements") or []
    if not isinstance(requirements, list):
        return JsonResponse({"detail": "Requirements must be a list of strings."}, status=400)

    job = Job.objects.create(
        title=str(payload["title"]).strip(),
        company=str(payload["company"]).strip(),
        location=str(payload["location"]).strip(),
        salary=str(payload.get("salary", "")).strip(),
        type=str(payload["type"]).strip(),
        description=str(payload["description"]).strip(),
        requirements=[str(item).strip() for item in requirements if str(item).strip()],
        logo=str(payload.get("logo", "")).strip(),
    )
    return JsonResponse(_serialize_job(job), status=201)
