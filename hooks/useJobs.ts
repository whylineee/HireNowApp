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
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  const fetchJobs = useCallback(async (searchParams: JobSearchParams) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await searchJobs(searchParams);
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }
      setJobs(data);
    } catch (e) {
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }
      setError(e instanceof Error ? e.message : 'Помилка завантаження');
      setJobs([]);
    } finally {
      if (isMountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
      }
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
    return () => {
      isMountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, []); // тільки при монтуванні

  return { jobs, loading, error, search, refetch };
}
