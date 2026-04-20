# API Documentation

## Overview

HireNow now uses the local Django backend as the source of truth for vacancies. The frontend reads from and writes to the backend API, and the Django admin operates on the same records.

## Services

### Jobs Service (`/services/jobs.ts`)

The jobs service handles all vacancy operations through Django API endpoints.

#### Functions

##### `searchJobs(params: JobSearchParams): Promise<Job[]>`

Searches for jobs based on provided parameters via `GET /api/jobs/`.

**Parameters:**
- `params` (JobSearchParams): Search criteria
  - `query?: string` - Search term for title, company, or description
  - `location?: string` - Filter by location
  - `type?: JobType` - Filter by job type

**Returns:** Promise<Job[]> - Array of matching jobs from Django

**Example:**
```typescript
const jobs = await searchJobs({
  query: 'React Developer',
  location: 'Київ',
  type: 'remote'
});
```

##### `getJobById(id: string): Promise<Job | null>`

Retrieves a specific job by its ID via `GET /api/jobs/:id/`.

**Parameters:**
- `id` (string): Unique job identifier

**Returns:** Promise<Job | null> - Job object or null if not found

**Example:**
```typescript
const job = await getJobById('1');
if (job) {
  console.log(job.title);
}
```

##### `createEmployerJob(input: Omit<Job, 'id' | 'postedAt'> & { postedAt?: string }): Promise<Job>`

Creates a new job posting in Django via `POST /api/jobs/`.

**Parameters:**
- `input`: Job data without id and postedAt (optional)
  - `title: string`
  - `company: string`
  - `location: string`
  - `salary?: string`
  - `type: JobType`
  - `description: string`
  - `requirements: string[]`
  - `logo?: string`
  - `postedAt?: string` (defaults to 'щойно')

**Returns:** Promise<Job> - Created job returned by backend

**Example:**
```typescript
const newJob = await createEmployerJob({
  title: 'Senior React Developer',
  company: 'Tech Corp',
  location: 'Київ',
  salary: '₴80 000 – ₴120 000',
  type: 'full-time',
  description: 'Шукаємо досвідченого React розробника...',
  requirements: ['React', 'TypeScript', '5+ років досвіду']
});
```

##### `getEmployerJobs(): Promise<Job[]>`

Retrieves the current backend vacancy list for the employer screen.

**Returns:** Promise<Job[]> - Array of jobs from Django

**Example:**
```typescript
const employerJobs = await getEmployerJobs();
console.log(`Total jobs: ${employerJobs.length}`);
```

## Data Models

### Job Interface

```typescript
interface Job {
  id: string;                    // Unique identifier
  title: string;                 // Job title
  company: string;               // Company name
  location: string;              // Job location
  salary?: string;               // Salary range (optional)
  type: JobType;                 // Employment type
  postedAt: string;              // Posting date (relative)
  description: string;           // Job description
  requirements: string[];        // Required skills/qualifications
  logo?: string;                 // Company logo URL (optional)
}
```

### JobType

```typescript
type JobType = 'full-time' | 'part-time' | 'contract' | 'remote' | 'hybrid';
```

### JobSearchParams

```typescript
interface JobSearchParams {
  query?: string;      // Search term
  location?: string;   // Location filter
  type?: JobType;      // Job type filter
}
```

## Seed Data

The backend migration seeds 6 starter vacancies so the app and Django admin show the same initial data:

1. **Frontend React Developer** - TechFlow Ukraine (Київ)
2. **Node.js Backend Engineer** - DataSoft (Львів, віддалено)
3. **UI/UX Designer** - Creative Studio (Одеса / Гібрид)
4. **Python Developer** - AI Labs (Київ)
5. **React Native Developer** - MobileFirst (Віддалено)
6. **DevOps Engineer** - CloudTech (Харків / Віддалено)

## Backend Endpoints

- `GET /api/jobs/`
  - Query params: `query`, `location`, `type`
- `GET /api/jobs/<id>/`
- `POST /api/jobs/`
  - JSON body: `title`, `company`, `location`, `salary`, `type`, `description`, `requirements`, `logo`

## Error Handling

- Backend validation errors return `400` with `detail`
- Missing job detail returns `null` from `getJobById`
- Non-success HTTP responses throw an error in the frontend service

## Local Development Notes

- Web builds need backend CORS enabled for the local Expo origin
- Native simulators can use the default backend URL fallback
- Real devices should use `EXPO_PUBLIC_API_URL=http://<your-machine-ip>:8000`
- The Django dev server should be started as `python manage.py runserver 0.0.0.0:8000`
- In `DEBUG`, the backend now accepts LAN hosts so Expo on the same network can reach it
