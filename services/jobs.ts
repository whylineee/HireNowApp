import { API_BASE_URL } from '@/services/api';
import type { Job, JobSearchParams } from '@/types/job';

type JobPayload = {
  id: string | number;
  title: string;
  company: string;
  location: string;
  salary?: string | null;
  type: Job['type'];
  postedAt: string;
  description: string;
  requirements?: string[] | null;
  logo?: string | null;
};

const REQUEST_TIMEOUT_MS = 12000;

function buildUrl(path: string, params?: Record<string, string | undefined>) {
  const url = new URL(path, `${API_BASE_URL}/`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
}

function createTimeoutController(timeoutMs: number): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const cancel = () => {
    clearTimeout(timer);
  };

  controller.signal.addEventListener('abort', cancel);

  return {
    signal: controller.signal,
    cancel,
  };
}

function normalizeJob(payload: JobPayload): Job {
  return {
    id: String(payload.id),
    title: payload.title,
    company: payload.company,
    location: payload.location,
    salary: payload.salary ?? undefined,
    type: payload.type,
    postedAt: payload.postedAt,
    description: payload.description,
    requirements: payload.requirements ?? [],
    logo: payload.logo ?? undefined,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const timeoutController = init?.signal ? null : createTimeoutController(REQUEST_TIMEOUT_MS);

  const response = await fetch(buildUrl(path), {
    ...init,
    signal: init?.signal ?? timeoutController?.signal,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  }).finally(() => {
    timeoutController?.cancel();
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const payload = (await response.json()) as { detail?: string };
      if (payload.detail) {
        message = payload.detail;
      }
    } catch {
      // Ignore invalid JSON responses and keep HTTP status.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function searchJobs(params: JobSearchParams): Promise<Job[]> {
  const queryPath = buildUrl('/api/jobs/', {
    query: params.query,
    location: params.location,
    type: params.type,
  });

  const payload = await request<JobPayload[]>(queryPath);
  return payload.map(normalizeJob);
}

export async function getJobById(id: string): Promise<Job | null> {
  try {
    const payload = await request<JobPayload>(`/api/jobs/${id}/`);
    return normalizeJob(payload);
  } catch (error) {
    if (error instanceof Error && error.message === 'HTTP 404') {
      return null;
    }
    throw error;
  }
}

export async function createEmployerJob(input: Omit<Job, 'id' | 'postedAt'> & { postedAt?: string }): Promise<Job> {
  const payload = await request<JobPayload>('/api/jobs/', {
    method: 'POST',
    body: JSON.stringify({
      title: input.title,
      company: input.company,
      location: input.location,
      salary: input.salary ?? '',
      type: input.type,
      description: input.description,
      requirements: input.requirements,
      logo: input.logo ?? '',
    }),
  });

  return normalizeJob(payload);
}

export async function getEmployerJobs(): Promise<Job[]> {
  return searchJobs({});
}

export function resetEmployerJobs() {
  // Jobs are now persisted in Django and managed via the admin panel.
}
