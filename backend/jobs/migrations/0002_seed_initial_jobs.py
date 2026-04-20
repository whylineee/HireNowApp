from __future__ import annotations

from datetime import timedelta

from django.db import migrations
from django.utils import timezone


INITIAL_JOBS = [
    {
        "title": "Frontend React Developer",
        "company": "TechFlow Ukraine",
        "location": "Київ, Україна",
        "salary": "₴60 000 – ₴90 000",
        "type": "full-time",
        "posted_offset_days": 2,
        "description": "Шукаємо досвідченого Frontend-розробника для роботи над продуктами для європейських клієнтів. Стек: React, TypeScript, Next.js.",
        "requirements": ["3+ роки досвіду з React", "TypeScript", "REST API", "Git"],
    },
    {
        "title": "Node.js Backend Engineer",
        "company": "DataSoft",
        "location": "Львів (віддалено)",
        "salary": "₴70 000 – ₴100 000",
        "type": "remote",
        "posted_offset_days": 1,
        "description": "Розробка та підтримка backend-систем на Node.js. Робота з PostgreSQL, Redis, мікросервісна архітектура.",
        "requirements": ["Node.js, Express/NestJS", "PostgreSQL", "Docker", "2+ роки досвіду"],
    },
    {
        "title": "UI/UX Designer",
        "company": "Creative Studio",
        "location": "Одеса / Гібрид",
        "salary": "₴45 000 – ₴65 000",
        "type": "hybrid",
        "posted_offset_days": 3,
        "description": "Проєктування інтерфейсів для веб і мобільних додатків. Близька співпраця з командою розробки.",
        "requirements": ["Figma", "Design systems", "Прототипування", "Портфоліо"],
    },
    {
        "title": "Python Developer",
        "company": "AI Labs",
        "location": "Київ",
        "salary": "₴80 000 – ₴120 000",
        "type": "full-time",
        "posted_offset_days": 5,
        "description": "Розробка ML-пайплайнів та сервісів обробки даних. Python, FastAPI, pandas, scikit-learn.",
        "requirements": ["Python 3+", "FastAPI/Django", "SQL", "Базові знання ML"],
    },
    {
        "title": "React Native Developer",
        "company": "MobileFirst",
        "location": "Віддалено",
        "salary": "₴65 000 – ₴95 000",
        "type": "remote",
        "posted_offset_days": 0,
        "description": "Розробка крос-платформних мобільних додатків на React Native. Участь у повному циклі розробки.",
        "requirements": ["React Native", "Expo", "TypeScript", "1+ рік досвіду"],
    },
    {
        "title": "DevOps Engineer",
        "company": "CloudTech",
        "location": "Харків / Віддалено",
        "salary": "₴90 000 – ₴130 000",
        "type": "hybrid",
        "posted_offset_days": 1,
        "description": "CI/CD, Kubernetes, моніторинг, інфраструктура як код. AWS або GCP.",
        "requirements": ["Kubernetes", "Docker", "Terraform/Ansible", "AWS або GCP"],
    },
]


def seed_jobs(apps, schema_editor):
    Job = apps.get_model("jobs", "Job")
    now = timezone.now()

    for entry in INITIAL_JOBS:
        defaults = {
            "salary": entry["salary"],
            "type": entry["type"],
            "posted_at": now - timedelta(days=entry["posted_offset_days"]),
            "description": entry["description"],
            "requirements": entry["requirements"],
            "is_active": True,
        }
        Job.objects.get_or_create(
            title=entry["title"],
            company=entry["company"],
            location=entry["location"],
            defaults=defaults,
        )


def unseed_jobs(apps, schema_editor):
    Job = apps.get_model("jobs", "Job")
    Job.objects.filter(title__in=[entry["title"] for entry in INITIAL_JOBS]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("jobs", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_jobs, unseed_jobs),
    ]
