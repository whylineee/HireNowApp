/**
 * Модель вакансії
 */
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: JobType;
  postedAt: string;
  description: string;
  requirements: string[];
  logo?: string;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'remote' | 'hybrid';

export interface JobSearchParams {
  query?: string;
  location?: string;
  type?: JobType;
}
