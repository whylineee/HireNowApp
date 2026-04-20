from __future__ import annotations

from .models import Job

JOB_TYPE_LABELS = {
    Job.JobType.FULL_TIME: "Повна зайнятість",
    Job.JobType.PART_TIME: "Часткова",
    Job.JobType.CONTRACT: "Контракт",
    Job.JobType.REMOTE: "Віддалено",
    Job.JobType.HYBRID: "Гібрид",
}
