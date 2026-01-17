import type { JobType } from '@/types/job';

/**
 * Лейбли для типів зайнятості
 */
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Повна зайнятість',
  'part-time': 'Часткова',
  contract: 'Контракт',
  remote: 'Віддалено',
  hybrid: 'Гібрид',
};

/**
 * Стилі для бейджів типів зайнятості (опційно для майбутнього)
 */
export const JOB_TYPE_COLORS: Record<JobType, string> = {
  'full-time': '#059669',
  'part-time': '#D97706',
  contract: '#7C3AED',
  remote: '#0EA5E9',
  hybrid: '#EC4899',
};
