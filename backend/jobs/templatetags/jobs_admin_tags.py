from __future__ import annotations

from datetime import timedelta

from django import template
from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils import timezone

from jobs.models import Job
from jobs.presentation import JOB_TYPE_LABELS

register = template.Library()


def _percent(value: int, total: int) -> int:
    if total <= 0:
        return 0
    return round((value / total) * 100)


@register.simple_tag
def jobs_dashboard_overview() -> dict[str, object]:
    now = timezone.now()
    total_jobs = Job.objects.count()
    active_jobs = Job.objects.filter(is_active=True).count()
    hidden_jobs = max(total_jobs - active_jobs, 0)
    fresh_jobs = Job.objects.filter(posted_at__gte=now - timedelta(days=7)).count()
    remote_jobs = Job.objects.filter(type=Job.JobType.REMOTE).count()
    top_company = (
        Job.objects.values("company")
        .annotate(total=Count("id"))
        .order_by("-total", "company")
        .first()
    )
    latest_job = Job.objects.order_by("-posted_at", "-created_at").first()

    User = get_user_model()
    staff_users = User.objects.filter(is_staff=True).count()
    superusers = User.objects.filter(is_superuser=True).count()

    return {
        "total_jobs": total_jobs,
        "active_jobs": active_jobs,
        "hidden_jobs": hidden_jobs,
        "fresh_jobs": fresh_jobs,
        "remote_jobs": remote_jobs,
        "remote_share": _percent(remote_jobs, total_jobs),
        "active_share": _percent(active_jobs, total_jobs),
        "top_company": top_company["company"] if top_company else "—",
        "top_company_total": top_company["total"] if top_company else 0,
        "latest_job": latest_job,
        "staff_users": staff_users,
        "superusers": superusers,
    }


@register.simple_tag
def jobs_type_mix() -> list[dict[str, object]]:
    total_jobs = Job.objects.count()
    raw = (
        Job.objects.values("type")
        .annotate(total=Count("id"))
        .order_by("-total", "type")
    )
    return [
        {
            "key": item["type"],
            "label": JOB_TYPE_LABELS.get(item["type"], item["type"]),
            "total": item["total"],
            "percent": _percent(item["total"], total_jobs),
        }
        for item in raw
    ]


@register.simple_tag
def jobs_top_companies(limit: int = 4) -> list[dict[str, object]]:
    total_jobs = Job.objects.count()
    companies = (
        Job.objects.values("company")
        .annotate(total=Count("id"))
        .order_by("-total", "company")[:limit]
    )
    return [
        {
            "company": item["company"],
            "total": item["total"],
            "percent": _percent(item["total"], total_jobs),
        }
        for item in companies
    ]


@register.simple_tag
def jobs_recent_activity(limit: int = 5) -> list[Job]:
    return list(Job.objects.order_by("-updated_at", "-posted_at")[:limit])
