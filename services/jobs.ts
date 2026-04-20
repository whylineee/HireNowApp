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
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
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
  const response = await fetch(
    buildUrl('/api/jobs/', {
      query: params.query,
      location: params.location,
      type: params.type,
    })
  );
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return ((await response.json()) as JobPayload[]).map(normalizeJob);
}

export async function getJobById(id: string): Promise<Job | null> {
  const response = await fetch(buildUrl(`/api/jobs/${id}/`));
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return normalizeJob((await response.json()) as JobPayload);
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
