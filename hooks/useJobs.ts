import { useState, useEffect, useCallback, useRef } from 'react';
import { searchJobs } from '@/services/jobs';
import type { Job, JobSearchParams } from '@/types/job';

interface UseJobsResult {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  search: (params: JobSearchParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useJobs(initialParams?: JobSearchParams): UseJobsResult {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<JobSearchParams>(initialParams ?? {});
  const paramsRef = useRef<JobSearchParams>(initialParams ?? {});

  const fetchJobs = useCallback(async (searchParams: JobSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchJobs(searchParams);
      setJobs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Помилка завантаження');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(
    async (newParams: JobSearchParams) => {
      const merged = { ...paramsRef.current, ...newParams };
      paramsRef.current = merged;
      setParams(merged);
      await fetchJobs(merged);
    },
    [fetchJobs]
  );

  const refetch = useCallback(() => fetchJobs(paramsRef.current), [fetchJobs]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    fetchJobs(paramsRef.current);
  }, []); // тільки при монтуванні

  return { jobs, loading, error, search, refetch };
}
