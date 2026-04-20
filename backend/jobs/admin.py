from django.contrib import admin
from django.db.models import Count
from django.utils import timezone
from django.utils.html import format_html

from .models import Job
from .presentation import JOB_TYPE_LABELS

admin.site.site_header = "HireNow Admin"
admin.site.site_title = "HireNow Control Room"
admin.site.index_title = "Керування вакансіями та контентом"


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    change_list_template = "admin/jobs/job/change_list.html"
    list_display = ("title", "company", "location", "type_badge", "status_badge", "posted_humanized")
    list_filter = ("type", "is_active", "posted_at")
    search_fields = ("title", "company", "location", "description")
    search_help_text = "Шукай за назвою вакансії, компанією, локацією або описом."
    ordering = ("-posted_at", "-created_at")
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 15
    empty_value_display = "—"
    fieldsets = (
        (
            "Основне",
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
            "Контент",
            {
                "fields": ("description", "requirements", "logo"),
            },
        ),
        (
            "Час",
            {
                "fields": ("posted_at", "created_at", "updated_at"),
            },
        ),
    )

    @admin.display(description="Тип")
    def type_badge(self, obj: Job) -> str:
        return format_html(
            '<span class="hn-admin-chip hn-admin-chip--type">{}</span>',
            JOB_TYPE_LABELS.get(obj.type, obj.get_type_display()),
        )

    @admin.display(description="Статус")
    def status_badge(self, obj: Job) -> str:
        css_class = "hn-admin-chip hn-admin-chip--live" if obj.is_active else "hn-admin-chip hn-admin-chip--muted"
        label = "Активна" if obj.is_active else "Прихована"
        return format_html('<span class="{}">{}</span>', css_class, label)

    @admin.display(description="Опубліковано", ordering="posted_at")
    def posted_humanized(self, obj: Job) -> str:
        delta = timezone.now() - obj.posted_at
        if delta.days == 0:
            return "Сьогодні"
        if delta.days == 1:
            return "1 день тому"
        return f"{delta.days} днів тому"

    def changelist_view(self, request, extra_context=None):
        now = timezone.now()
        queryset = self.get_queryset(request)
        type_distribution = list(
            queryset.values("type").annotate(total=Count("id")).order_by("-total")
        )
        top_type = type_distribution[0] if type_distribution else None

        extra_context = {
            **(extra_context or {}),
            "job_admin_stats": {
                "total": queryset.count(),
                "active": queryset.filter(is_active=True).count(),
                "fresh": queryset.filter(posted_at__gte=now - timezone.timedelta(days=7)).count(),
                "remote": queryset.filter(type=Job.JobType.REMOTE).count(),
                "top_type_label": JOB_TYPE_LABELS.get(top_type["type"], "—") if top_type else "—",
            },
        }
        return super().changelist_view(request, extra_context=extra_context)
