from django.db import models
from django.utils import timezone


class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = "full-time", "Full time"
        PART_TIME = "part-time", "Part time"
        CONTRACT = "contract", "Contract"
        REMOTE = "remote", "Remote"
        HYBRID = "hybrid", "Hybrid"

    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    salary = models.CharField(max_length=128, blank=True)
    type = models.CharField(
        max_length=32,
        choices=JobType.choices,
        default=JobType.FULL_TIME,
    )
    posted_at = models.DateTimeField(default=timezone.now)
    description = models.TextField()
    requirements = models.JSONField(default=list, blank=True)
    logo = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-posted_at", "-created_at"]

    def __str__(self) -> str:
        return f"{self.title} @ {self.company}"
