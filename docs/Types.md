# TypeScript Types Documentation

## Overview

HireNow uses TypeScript for type safety throughout the application. All types are centralized in the `/types` directory and exported for use across components, hooks, and services.

## Core Types

### Job Interface

The main data structure for job listings.

```typescript
interface Job {
  id: string;                    // Unique identifier
  title: string;                 // Job title/position
  company: string;               // Company name
  location: string;              // Job location (city, remote, etc.)
  salary?: string;               // Salary range (optional)
  type: JobType;                 // Employment type
  postedAt: string;              // Posting date (relative format)
  description: string;           // Job description
  requirements: string[];        // Required skills/qualifications
  logo?: string;                 // Company logo URL (optional)
}
```

**Example:**
```typescript
const job: Job = {
  id: '1',
  title: 'Frontend React Developer',
  company: 'TechFlow Ukraine',
  location: 'Київ, Україна',
  salary: '₴60 000 – ₴90 000',
  type: 'full-time',
  postedAt: '2 дні тому',
  description: 'Шукаємо досвідченого Frontend-розробника...',
  requirements: ['3+ роки досвіду з React', 'TypeScript', 'REST API'],
  logo: 'https://example.com/logo.png'
};
```

### JobType

Enumeration of employment types.

```typescript
type JobType = 'full-time' | 'part-time' | 'contract' | 'remote' | 'hybrid';
```

**Values:**
- `'full-time'` - Повна зайнятість
- `'part-time'` - Часткова зайнятість
- `'contract'` - Контрактна робота
- `'remote'` - Віддалена робота
- `'hybrid'` - Гібридний формат

### JobSearchParams

Parameters for job search functionality.

```typescript
interface JobSearchParams {
  query?: string;      // Search term for title, company, description
  location?: string;   // Location filter
  type?: JobType;      // Employment type filter
}
```

**Usage Examples:**
```typescript
// Search by keyword
const params1: JobSearchParams = {
  query: 'React Developer'
};

// Search by location and type
const params2: JobSearchParams = {
  location: 'Київ',
  type: 'remote'
};

// Combined search
const params3: JobSearchParams = {
  query: 'Senior',
  location: 'Львів',
  type: 'full-time'
};
```

## Component Props Types

### Button Component

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
```

### Card Component

```typescript
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  elevated?: boolean;
}
```

### Input Component

```typescript
interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: object;
}
```

### JobCard Component

```typescript
interface JobCardProps {
  job: Job;
  isFavorite?: boolean;
  isApplied?: boolean;
  onFavoritePress?: () => void;
  showFavorite?: boolean;
}
```

### Header Component

```typescript
interface HeaderProps {
  title: string;
  subtitle?: string;
  showFavoritesButton?: boolean;
  showSettingsButton?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
}
```

### FavoriteButton Component

```typescript
interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
}
```

## Hook Return Types

### useJobs Hook

```typescript
interface UseJobsResult {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  search: (params: JobSearchParams) => Promise<void>;
  refetch: () => Promise<void>;
}
```

### useFavorites Hook

```typescript
interface UseFavoritesResult {
  favorites: string[];
  loading: boolean;
  addFavorite: (jobId: string) => void;
  removeFavorite: (jobId: string) => void;
  toggleFavorite: (jobId: string) => void;
  isFavorite: (jobId: string) => boolean;
  clearFavorites: () => void;
}
```

## Utility Types

### Sort Options

```typescript
type SortOption = 'relevant' | 'recent' | 'salary-high' | 'salary-low';
```

### Navigation Types

```typescript
// For Expo Router
type RootStackParamList = {
  index: undefined;
  favorites: undefined;
  'job/[id]': { id: string };
  profile: undefined;
};
```

## Theme Types

### Color Palette

```typescript
export const colors = {
  // Primary colors
  primary: '#4C6FFF',
  primaryLight: '#7C8CFF',
  primaryDark: '#3246D3',
  accent: '#F97316',
  primaryGradient: ['#4C6FFF', '#7C8CFF'],

  // Neutral colors
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceElevated: '#F8F9FA',
  surfaceHover: '#F1F3F4',
  surfaceMuted: '#F5F5F5',

  // Text colors
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Status colors
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
  info: '#0EA5E9',

  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Additional colors
  coral: '#FF6B6B',
  teal: '#4ECDC4',
  sky: '#45B7D1',
  mint: '#96CEB4',
} as const;
```

### Spacing Scale

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
```

### Border Radius

```typescript
export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
```

### Typography Scale

```typescript
export const typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,

  // Font weights
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;
```

## Constants Types

### Job Type Labels

```typescript
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Повна зайнятість',
  'part-time': 'Часткова',
  'contract': 'Контракт',
  'remote': 'Віддалено',
  'hybrid': 'Гібрид',
};
```

### Job Type Colors

```typescript
export const JOB_TYPE_COLORS: Record<JobType, string> = {
  'full-time': '#059669',
  'part-time': '#D97706',
  'contract': '#7C3AED',
  'remote': '#0EA5E9',
  'hybrid': '#EC4899',
};
```

## Type Guards

### Job Type Guard

```typescript
function isJobType(value: string): value is JobType {
  return ['full-time', 'part-time', 'contract', 'remote', 'hybrid'].includes(value);
}

function isValidJob(job: any): job is Job {
  return (
    typeof job.id === 'string' &&
    typeof job.title === 'string' &&
    typeof job.company === 'string' &&
    typeof job.location === 'string' &&
    isJobType(job.type) &&
    typeof job.postedAt === 'string' &&
    typeof job.description === 'string' &&
    Array.isArray(job.requirements)
  );
}
```

## Generic Types

### API Response Types

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}
```

### Form Types

```typescript
interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}

interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
}
```

## Best Practices

1. **Use Interfaces for Objects**: Prefer `interface` over `type` for object shapes
2. **Make Optional Fields Explicit**: Use `?` for optional properties
3. **Use Union Types**: For enums and limited string values
4. **Type Guards**: Implement type guards for runtime validation
5. **Generic Types**: Use generics for reusable components and utilities
6. **Readonly Types**: Use `readonly` for immutable data
7. **Strict Typing**: Enable strict mode in `tsconfig.json`

## Type Safety Examples

### Safe API Calls

```typescript
async function fetchJob(id: string): Promise<Job | null> {
  try {
    const response = await api.get(`/jobs/${id}`);
    const job = response.data;
    
    if (isValidJob(job)) {
      return job;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch job:', error);
    return null;
  }
}
```

### Component Props Validation

```typescript
interface JobListProps {
  jobs: Job[];
  onJobPress: (job: Job) => void;
  loading?: boolean;
}

export function JobList({ jobs, onJobPress, loading = false }: JobListProps) {
  // TypeScript ensures jobs is Job[] and onJobPress expects Job
  return (
    <FlatList
      data={jobs}
      renderItem={({ item }) => (
        <JobCard job={item} onPress={() => onJobPress(item)} />
      )}
      loading={loading}
    />
  );
}
```

### Hook Type Safety

```typescript
function useJobFilter(initialFilters: JobSearchParams) {
  const [filters, setFilters] = useState<JobSearchParams>(initialFilters);
  
  const updateFilter = useCallback(<K extends keyof JobSearchParams>(
    key: K,
    value: JobSearchParams[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  return { filters, updateFilter };
}
```
