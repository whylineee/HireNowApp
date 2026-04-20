from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("jobs", "0002_seed_initial_jobs"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="job",
            index=models.Index(
                fields=["is_active", "-posted_at", "-created_at"],
                name="jobs_active_posted_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="job",
            index=models.Index(
                fields=["type", "is_active"],
                name="jobs_type_active_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="job",
            index=models.Index(
                fields=["location"],
                name="jobs_location_idx",
            ),
        ),
    ]
