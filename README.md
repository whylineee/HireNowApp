# HireNow

Додаток для пошуку роботи. Expo + React Native + TypeScript.

## Структура проекту

```
app/                    # Екрани (Expo Router, file-based)
  _layout.tsx           # Кореневий layout, Stack-навігація
  index.tsx             # Головна — пошук і список вакансій
  job/
    [id].tsx            # Деталі вакансії

components/             # React-компоненти
  ui/                   # Базові UI: Button, Card, Input
  layout/               # Screen, Header
  job/                  # JobCard
  SearchBar.tsx

hooks/                  # Кастомні хуки
  useJobs.ts            # Пошук вакансій, стан
  useDebounce.ts

services/               # API та бізнес-логіка
  jobs.ts               # searchJobs, getJobById (зараз мок)

constants/              # Константи, тема
  theme.ts              # colors, spacing, typography
  job.ts                # лейбли типів зайнятості

types/                  # TypeScript
  job.ts                # Job, JobType, JobSearchParams
```

## Запуск

```bash
npm install
npx expo start
```

## Можливості

- Пошук вакансій за текстом і локацією
- Список вакансій з картками (посада, компанія, локація, тип, ЗП)
- Екран деталей вакансії (опис, вимоги)
- Адаптивна тема (кольори, відступи, типографіка)
