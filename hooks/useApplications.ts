import { createPersistentStore } from '@/utils/persistentStore';
import { useCallback, useEffect, useState } from 'react';

export interface Application {
  jobId: string;
  appliedAt: number;
}

const APPLICATIONS_STORAGE_KEY = 'applications';

const applicationsStore = createPersistentStore<Application[]>({
  key: APPLICATIONS_STORAGE_KEY,
  initialState: [],
});

export function clearApplicationsStore() {
  return applicationsStore.resetState();
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(applicationsStore.getSnapshot());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = applicationsStore.subscribe((state) => setApplications([...state]));

    let active = true;
    void applicationsStore.hydrate().finally(() => {
      if (active) {
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const applyToJob = useCallback((jobId: string) => {
    if (applicationsStore.getSnapshot().some((item) => item.jobId === jobId)) return;
    void applicationsStore.updateState((prevState) => [{ jobId, appliedAt: Date.now() }, ...prevState]);
  }, []);

  const removeApplication = useCallback((jobId: string) => {
    void applicationsStore.updateState((prevState) => prevState.filter((item) => item.jobId !== jobId));
  }, []);

  const clearApplications = useCallback(() => {
    void clearApplicationsStore();
  }, []);

  const isApplied = useCallback(
    (jobId: string) => applications.some((item) => item.jobId === jobId),
    [applications]
  );

  const appliedAt = useCallback(
    (jobId: string) => applications.find((item) => item.jobId === jobId)?.appliedAt,
    [applications]
  );

  return { applications, loading, applyToJob, removeApplication, clearApplications, isApplied, appliedAt };
}
