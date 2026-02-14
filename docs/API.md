# API Documentation

## Overview

The HireNow app uses a mock API service for demonstration purposes. All API functions are asynchronous and simulate network delays to provide realistic user experience.

## Services

### Jobs Service (`/services/jobs.ts`)

The jobs service handles all operations related to job listings, including search, retrieval, and creation.

#### Functions

##### `searchJobs(params: JobSearchParams): Promise<Job[]>`

Searches for jobs based on provided parameters.

**Parameters:**
- `params` (JobSearchParams): Search criteria
  - `query?: string` - Search term for title, company, or description
  - `location?: string` - Filter by location
  - `type?: JobType` - Filter by job type

**Returns:** Promise<Job[]> - Array of matching jobs

**Example:**
```typescript
const jobs = await searchJobs({
  query: 'React Developer',
  location: 'Київ',
  type: 'remote'
});
```

##### `getJobById(id: string): Promise<Job | null>`

Retrieves a specific job by its ID.

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

Creates a new job posting (employer functionality).

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

**Returns:** Promise<Job> - Created job with generated ID

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

Retrieves all jobs created by employers in the current session.

**Returns:** Promise<Job[]> - Array of employer-created jobs

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

## Mock Data

The service includes 6 pre-defined mock jobs for demonstration:

1. **Frontend React Developer** - TechFlow Ukraine (Київ)
2. **Node.js Backend Engineer** - DataSoft (Львів, віддалено)
3. **UI/UX Designer** - Creative Studio (Одеса / Гібрид)
4. **Python Developer** - AI Labs (Київ)
5. **React Native Developer** - MobileFirst (Віддалено)
6. **DevOps Engineer** - CloudTech (Харків / Віддалено)

## Error Handling

All functions include basic error handling:

- Network delays are simulated (200-400ms)
- Errors are caught and re-thrown with descriptive messages
- Empty results return empty arrays
- Invalid IDs return null for `getJobById`

## Future Implementation

For production, replace mock implementation with real API calls:

```typescript
// Example: Integration with real API
export async function searchJobs(params: JobSearchParams): Promise<Job[]> {
  const queryParams = new URLSearchParams();
  if (params.query) queryParams.append('q', params.query);
  if (params.location) queryParams.append('location', params.location);
  if (params.type) queryParams.append('type', params.type);
  
  const response = await fetch(`/api/jobs?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch jobs');
  return response.json();
}
```

## Storage Notes

- Mock jobs are hardcoded in the service
- Employer jobs are stored in memory (lost on app restart)
- For production, consider implementing:
  - Persistent storage (AsyncStorage)
  - API integration
  - Caching strategies
  - Offline support
