import { useCallback, useEffect, useState } from 'react';

export interface Application {
  jobId: string;
  appliedAt: number;
}

let memoryApplications: Application[] = [];

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(memoryApplications);

  useEffect(() => {
    setApplications(memoryApplications);
  }, []);

  const applyToJob = useCallback((jobId: string) => {
    if (memoryApplications.some((item) => item.jobId === jobId)) return;
    memoryApplications = [{ jobId, appliedAt: Date.now() }, ...memoryApplications];
    setApplications(memoryApplications);
  }, []);

  const removeApplication = useCallback((jobId: string) => {
    memoryApplications = memoryApplications.filter((item) => item.jobId !== jobId);
    setApplications(memoryApplications);
  }, []);

  const isApplied = useCallback(
    (jobId: string) => applications.some((item) => item.jobId === jobId),
    [applications]
  );

  const appliedAt = useCallback(
    (jobId: string) => applications.find((item) => item.jobId === jobId)?.appliedAt,
    [applications]
  );

  return { applications, applyToJob, removeApplication, isApplied, appliedAt };
}
