from __future__ import annotations

import json
from datetime import timedelta

from django.test import Client, TestCase
from django.utils import timezone

from .models import Job


class JobsApiTests(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.active_job = Job.objects.create(
            title="React Native Engineer",
            company="HireNow",
            location="Kyiv",
            salary="1000",
            type=Job.JobType.FULL_TIME,
            description="Mobile app development",
            requirements=["React Native", "TypeScript"],
            is_active=True,
        )
        Job.objects.create(
            title="Hidden Job",
            company="Secret Inc",
            location="Lviv",
            salary="500",
            type=Job.JobType.CONTRACT,
            description="Should not be visible",
            requirements=[],
            is_active=False,
        )

    def test_jobs_list_returns_only_active_jobs(self) -> None:
        response = self.client.get("/api/jobs/")
        self.assertEqual(response.status_code, 200)

        payload = response.json()
        self.assertEqual(len(payload), 1)
        self.assertEqual(payload[0]["id"], str(self.active_job.id))

    def test_jobs_list_filters_by_query_location_and_type(self) -> None:
        response = self.client.get(
            "/api/jobs/",
            {
                "query": "React",
                "location": "Ky",
                "type": Job.JobType.FULL_TIME,
            },
        )
        self.assertEqual(response.status_code, 200)

        payload = response.json()
        self.assertEqual(len(payload), 1)
        self.assertEqual(payload[0]["title"], "React Native Engineer")

    def test_job_detail_returns_404_for_inactive_job(self) -> None:
        inactive_job = Job.objects.get(title="Hidden Job")
        response = self.client.get(f"/api/jobs/{inactive_job.id}/")
        self.assertEqual(response.status_code, 404)

    def test_jobs_collection_post_creates_job(self) -> None:
        response = self.client.post(
            "/api/jobs/",
            data=json.dumps(
                {
                    "title": "Python Engineer",
                    "company": "Data Co",
                    "location": "Remote",
                    "salary": "",
                    "type": Job.JobType.REMOTE,
                    "description": "Build APIs",
                    "requirements": ["Python", "Django"],
                    "logo": "",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Job.objects.filter(title="Python Engineer").count(), 1)

    def test_jobs_collection_post_requires_mandatory_fields(self) -> None:
        response = self.client.post(
            "/api/jobs/",
            data=json.dumps(
                {
                    "title": "",
                    "company": "Data Co",
                    "location": "Remote",
                    "type": Job.JobType.REMOTE,
                    "description": "Build APIs",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("Missing fields", response.json()["detail"])

    def test_jobs_collection_post_rejects_invalid_type(self) -> None:
        response = self.client.post(
            "/api/jobs/",
            data=json.dumps(
                {
                    "title": "Backend Engineer",
                    "company": "Data Co",
                    "location": "Remote",
                    "type": "wrong-type",
                    "description": "Build APIs",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "Invalid job type.")

    def test_jobs_collection_post_rejects_non_list_requirements(self) -> None:
        response = self.client.post(
            "/api/jobs/",
            data=json.dumps(
                {
                    "title": "Backend Engineer",
                    "company": "Data Co",
                    "location": "Remote",
                    "type": Job.JobType.REMOTE,
                    "description": "Build APIs",
                    "requirements": "not-a-list",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "Requirements must be a list of strings.")

    def test_jobs_collection_disallows_unknown_methods(self) -> None:
        response = self.client.put("/api/jobs/")
        self.assertEqual(response.status_code, 405)

    def test_job_serialization_handles_optional_fields(self) -> None:
        job = Job.objects.create(
            title="No Optional Fields",
            company="Plain Co",
            location="Dnipro",
            salary="",
            type=Job.JobType.PART_TIME,
            description="No optional fields in payload",
            requirements=[],
            logo="",
            is_active=True,
        )

        response = self.client.get(f"/api/jobs/{job.id}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()

        self.assertIsNone(payload["salary"])
        self.assertEqual(payload["requirements"], [])
        self.assertIsNone(payload["logo"])
        self.assertIsInstance(payload["postedAt"], str)
        self.assertTrue(payload["postedAt"])

    def test_jobs_list_supports_limit_and_offset(self) -> None:
        for idx in range(3):
            Job.objects.create(
                title=f"Extra Job {idx}",
                company="Paged Co",
                location="Remote",
                salary="1000",
                type=Job.JobType.REMOTE,
                description="Pagination test",
                requirements=[],
                is_active=True,
                posted_at=timezone.now() - timedelta(minutes=idx + 1),
            )

        response = self.client.get("/api/jobs/", {"limit": "2", "offset": "1"})
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(len(payload), 2)

    def test_jobs_list_falls_back_for_invalid_limit_and_offset(self) -> None:
        response = self.client.get("/api/jobs/", {"limit": "abc", "offset": "-5"})
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertGreaterEqual(len(payload), 1)

