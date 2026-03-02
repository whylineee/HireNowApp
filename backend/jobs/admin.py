from django.contrib import admin

from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "location", "type", "is_active", "posted_at")
    list_filter = ("type", "is_active", "posted_at")
    search_fields = ("title", "company", "location", "description")
    ordering = ("-posted_at", "-created_at")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (
            "General",
            {
                "fields": (
                    "title",
                    "company",
                    "location",
                    "salary",
                    "type",
                    "is_active",
                )
            },
        ),
        (
            "Content",
            {
                "fields": ("description", "requirements", "logo"),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("posted_at", "created_at", "updated_at"),
            },
        ),
    )
