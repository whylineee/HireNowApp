import type { Job, JobSearchParams } from '@/types/job';

/**
 * Мок-дані вакансій для демонстрації.
 * У production замінити на виклики API (наприклад, jobs.github.com, Adzuna тощо).
 */
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Frontend React Developer',
    company: 'TechFlow Ukraine',
    location: 'Київ, Україна',
    salary: '₴60 000 – ₴90 000',
    type: 'full-time',
    postedAt: '2 дні тому',
    description: 'Шукаємо досвідченого Frontend-розробника для роботи над продуктами для європейських клієнтів. Стек: React, TypeScript, Next.js.',
    requirements: ['3+ роки досвіду з React', 'TypeScript', 'REST API', 'Git'],
  },
  {
    id: '2',
    title: 'Node.js Backend Engineer',
    company: 'DataSoft',
    location: 'Львів (віддалено)',
    salary: '₴70 000 – ₴100 000',
    type: 'remote',
    postedAt: '1 день тому',
    description: 'Розробка та підтримка backend-систем на Node.js. Робота з PostgreSQL, Redis, мікросервісна архітектура.',
    requirements: ['Node.js, Express/NestJS', 'PostgreSQL', 'Docker', '2+ роки досвіду'],
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Одеса / Гібрид',
    salary: '₴45 000 – ₴65 000',
    type: 'hybrid',
    postedAt: '3 дні тому',
    description: 'Проєктування інтерфейсів для веб і мобільних додатків. Близька співпраця з командою розробки.',
    requirements: ['Figma', 'Design systems', 'Прототипування', 'Портфоліо'],
  },
  {
    id: '4',
    title: 'Python Developer',
    company: 'AI Labs',
    location: 'Київ',
    salary: '₴80 000 – ₴120 000',
    type: 'full-time',
    postedAt: '5 днів тому',
    description: 'Розробка ML-пайплайнів та сервісів обробки даних. Python, FastAPI, pandas, scikit-learn.',
    requirements: ['Python 3+', 'FastAPI/Django', 'SQL', 'Базові знання ML'],
  },
  {
    id: '5',
    title: 'React Native Developer',
    company: 'MobileFirst',
    location: 'Віддалено',
    salary: '₴65 000 – ₴95 000',
    type: 'remote',
    postedAt: 'Сьогодні',
    description: 'Розробка крос-платформних мобільних додатків на React Native. Участь у повному циклі розробки.',
    requirements: ['React Native', 'Expo', 'TypeScript', '1+ рік досвіду'],
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Харків / Віддалено',
    salary: '₴90 000 – ₴130 000',
    type: 'hybrid',
    postedAt: '1 день тому',
    description: 'CI/CD, Kubernetes, моніторинг, інфраструктура як код. AWS або GCP.',
    requirements: ['Kubernetes', 'Docker', 'Terraform/Ansible', 'AWS або GCP'],
  },
];

/**
 * Імітація затримки мережі
 */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Нормалізація рядка для пошуку (нижній регістр, без зайвих пробілів)
 */
function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Пошук вакансій за параметрами
 */
export async function searchJobs(params: JobSearchParams): Promise<Job[]> {
  await delay(400); // імітація API

  let results = [...MOCK_JOBS];

  if (params.query) {
    const q = normalize(params.query);
    results = results.filter(
      (j) =>
        normalize(j.title).includes(q) ||
        normalize(j.company).includes(q) ||
        normalize(j.description).includes(q)
    );
  }

  if (params.location) {
    const loc = normalize(params.location);
    results = results.filter((j) => normalize(j.location).includes(loc));
  }

  if (params.type) {
    results = results.filter((j) => j.type === params.type);
  }

  return results;
}

/**
 * Отримання вакансії за ID
 */
export async function getJobById(id: string): Promise<Job | null> {
  await delay(200);
  return MOCK_JOBS.find((j) => j.id === id) ?? null;
}
