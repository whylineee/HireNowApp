import { getStoredJson, setStoredJson } from '@/utils/storage';
import { useCallback, useEffect, useState } from 'react';

export interface Application {
  jobId: string;
  appliedAt: number;
}

const APPLICATIONS_STORAGE_KEY = 'applications';

type ApplicationsListener = (applications: Application[]) => void;

let applicationsStore = getStoredJson<Application[]>(APPLICATIONS_STORAGE_KEY, []);
const listeners = new Set<ApplicationsListener>();

function emitApplications() {
  setStoredJson(APPLICATIONS_STORAGE_KEY, applicationsStore);
  listeners.forEach((listener) => listener([...applicationsStore]));
}

function subscribe(listener: ApplicationsListener) {
  listeners.add(listener);
  listener([...applicationsStore]);
  return () => {
    listeners.delete(listener);
  };
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(applicationsStore);

  useEffect(() => subscribe(setApplications), []);

  const applyToJob = useCallback((jobId: string) => {
    if (applicationsStore.some((item) => item.jobId === jobId)) return;
    applicationsStore = [{ jobId, appliedAt: Date.now() }, ...applicationsStore];
    emitApplications();
  }, []);

  const removeApplication = useCallback((jobId: string) => {
    applicationsStore = applicationsStore.filter((item) => item.jobId !== jobId);
    emitApplications();
  }, []);

  const clearApplications = useCallback(() => {
    applicationsStore = [];
    emitApplications();
  }, []);

  const isApplied = useCallback(
    (jobId: string) => applications.some((item) => item.jobId === jobId),
    [applications]
  );

  const appliedAt = useCallback(
    (jobId: string) => applications.find((item) => item.jobId === jobId)?.appliedAt,
    [applications]
  );

  return { applications, applyToJob, removeApplication, clearApplications, isApplied, appliedAt };
}
