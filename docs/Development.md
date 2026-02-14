# Development Guidelines

## Overview

This document provides comprehensive guidelines for developing and maintaining the HireNow mobile application. Following these standards ensures code quality, consistency, and maintainability.

## Project Structure

```
HireNowApp/
├── docs/                   # Documentation files
├── app/                    # Expo Router screens
├── components/             # Reusable React components
│   ├── job/               # Job-specific components
│   ├── layout/            # Layout components
│   └── ui/                # Generic UI components
├── constants/             # App constants and theme
├── hooks/                 # Custom React hooks
├── services/              # API and data services
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── locales/               # Internationalization
```

## Code Standards

### TypeScript Configuration

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Naming Conventions

**Files and Folders:**
- **Components**: PascalCase (`JobCard.tsx`, `Header.tsx`)
- **Hooks**: camelCase with `use` prefix (`useJobs.ts`, `useFavorites.ts`)
- **Utilities**: camelCase (`salary.ts`, `api.ts`)
- **Constants**: camelCase (`theme.ts`, `job.ts`)
- **Types**: camelCase (`job.ts`, `user.ts`)

**Variables and Functions:**
```typescript
// ✅ Good
const jobList = [];
const isLoading = false;
const handleSearchPress = () => {};

// ❌ Bad
const JobList = [];
const is_loading = false;
const HandleSearchPress = () => {};
```

**Components:**
```typescript
// ✅ Good
export function JobCard({ job, onFavoritePress }: JobCardProps) {
  // Component logic
}

// ❌ Bad
export const jobCard = (props) => {
  // Component logic
};
```

**Interfaces and Types:**
```typescript
// ✅ Good
interface JobCardProps {
  job: Job;
  onFavoritePress?: () => void;
}

type JobType = 'full-time' | 'part-time' | 'contract';

// ❌ Bad
interface jobcardprops {
  job: job;
  onFavoritePress?: Function;
}
```

## Component Guidelines

### Component Structure

```typescript
// 1. Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import type { Job } from '@/types/job';

// 2. Interface definition
interface JobCardProps {
  job: Job;
  onPress?: () => void;
}

// 3. Component implementation
export function JobCard({ job, onPress }: JobCardProps) {
  const handlePress = () => {
    onPress?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
    </View>
  );
}

// 4. Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
```

### Component Best Practices

1. **Use TypeScript interfaces for all props**
2. **Make optional props explicit with `?`**
3. **Use default values for optional props**
4. **Keep components focused and single-purpose**
5. **Use React.memo for performance optimization**
6. **Extract complex logic into custom hooks**

```typescript
// ✅ Optimized component
export const JobCard = React.memo<JobCardProps>(({ job, onPress }) => {
  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <TouchableOpacity onPress={handlePress}>
      {/* Component content */}
    </TouchableOpacity>
  );
});
```

## Hook Guidelines

### Custom Hook Structure

```typescript
import { useState, useEffect, useCallback } from 'react';

// 1. Interface for return type
interface UseCustomHookResult {
  value: any;
  loading: boolean;
  error: string | null;
  action: () => void;
}

// 2. Hook implementation
export function useCustomHook(param: string): UseCustomHookResult {
  const [value, setValue] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const action = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await performAction(param);
      setValue(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [param]);

  useEffect(() => {
    action();
  }, [action]);

  return { value, loading, error, action };
}
```

### Hook Best Practices

1. **Always type your hooks and return values**
2. **Use useCallback for functions returned from hooks**
3. **Properly cleanup effects to prevent memory leaks**
4. **Handle errors gracefully**
5. **Provide loading states for async operations**

## Styling Guidelines

### Theme Usage

Always use the centralized theme system:

```typescript
// ✅ Good
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.text,
  },
});

// ❌ Bad
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
```

### Responsive Design

```typescript
import { useWindowDimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  content: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
});

export function ResponsiveComponent() {
  const { width } = useWindowDimensions();
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.content,
        width > 768 && { paddingHorizontal: spacing.xl }
      ]}>
        {/* Content */}
      </View>
    </View>
  );
}
```

## Error Handling

### Error Boundaries

```typescript
import React, { Component } from 'react';
import { View, Text } from 'react-native';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error: Error }) {
  return (
    <View style={{ padding: spacing.md }}>
      <Text>Something went wrong:</Text>
      <Text>{error.message}</Text>
    </View>
  );
}
```

### Async Error Handling

```typescript
// ✅ Good error handling
const fetchJobs = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const jobs = await searchJobs(params);
    setJobs(jobs);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    setError(message);
    console.error('Failed to fetch jobs:', error);
  } finally {
    setLoading(false);
  }
}, [params]);
```

## Performance Optimization

### List Optimization

```typescript
import { FlatList, ListRenderItem } from 'react-native';

const JobList = React.memo<{ jobs: Job[] }>(({ jobs }) => {
  const renderItem = useCallback<ListRenderItem<Job>>(
    ({ item }) => <JobCard job={item} />,
    []
  );

  const keyExtractor = useCallback((item: Job) => item.id, []);

  return (
    <FlatList
      data={jobs}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
});
```

### Image Optimization

```typescript
import { Image } from 'expo-image';

export function JobLogo({ source, size = 48 }: { source: string; size?: number }) {
  return (
    <Image
      source={source}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      placeholder="https://via.placeholder.com/48"
      contentFit="cover"
      transition={200}
    />
  );
}
```

## Testing Guidelines

### Component Testing

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { JobCard } from '@/components/job/JobCard';

describe('JobCard', () => {
  const mockJob: Job = {
    id: '1',
    title: 'React Developer',
    company: 'Tech Corp',
    location: 'Київ',
    type: 'full-time',
    postedAt: '2 дні тому',
    description: 'Test description',
    requirements: ['React', 'TypeScript'],
  };

  it('renders job information correctly', () => {
    const { getByText } = render(<JobCard job={mockJob} />);
    
    expect(getByText('React Developer')).toBeTruthy();
    expect(getByText('Tech Corp')).toBeTruthy();
    expect(getByText('Київ')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <JobCard job={mockJob} onPress={mockOnPress} />
    );
    
    fireEvent.press(getByTestId('job-card'));
    expect(mockOnPress).toHaveBeenCalledWith(mockJob);
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useJobs } from '@/hooks/useJobs';

describe('useJobs', () => {
  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useJobs());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.jobs).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should search jobs with parameters', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useJobs());
    
    await act(async () => {
      await result.current.search({ query: 'React' });
    });
    
    expect(result.current.jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.stringContaining('React')
        })
      ])
    );
  });
});
```

## Git Workflow

### Branch Naming

```
feature/job-search-filters
bugfix/favorite-button-crash
hotfix/critical-api-error
refactor/component-optimization
docs/api-documentation
```

### Commit Messages

```
feat: add job type filters
fix: resolve favorite button crash
docs: update API documentation
refactor: optimize job list performance
test: add unit tests for JobCard
chore: update dependencies
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Accessibility tested

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## Security Guidelines

### Data Handling

```typescript
// ✅ Secure API calls
const apiCall = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getSecureToken()}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
```

### Input Validation

```typescript
// ✅ Input validation
const validateJobInput = (input: Partial<Job>): string[] => {
  const errors: string[] = [];
  
  if (!input.title?.trim()) {
    errors.push('Job title is required');
  }
  
  if (!input.company?.trim()) {
    errors.push('Company name is required');
  }
  
  if (input.title && input.title.length > 100) {
    errors.push('Job title must be less than 100 characters');
  }
  
  return errors;
};
```

## Deployment Guidelines

### Environment Configuration

```typescript
// config/environment.ts
export const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
    ENABLE_LOGGING: true,
  },
  staging: {
    API_BASE_URL: 'https://staging-api.hirenow.com/api',
    ENABLE_LOGGING: true,
  },
  production: {
    API_BASE_URL: 'https://api.hirenow.com/api',
    ENABLE_LOGGING: false,
  },
}[process.env.NODE_ENV || 'development'];
```

### Build Optimization

```json
// package.json scripts
{
  "scripts": {
    "start": "expo start",
    "build:android": "expo build:android --release-channel production",
    "build:ios": "expo build:ios --release-channel production",
    "build:web": "expo build:web",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix"
  }
}
```

## Code Review Checklist

### Before Submitting PR

- [ ] Code follows TypeScript and React Native best practices
- [ ] Components are properly typed with interfaces
- [ ] Error handling is implemented
- [ ] Loading states are provided
- [ ] Accessibility features are included
- [ ] Performance optimizations are considered
- [ ] Tests are written for new functionality
- [ ] Documentation is updated
- [ ] No hardcoded values (use theme constants)
- [ ] No console.log statements in production code

### During Code Review

- [ ] Logic is correct and efficient
- [ ] Component props are properly typed
- [ ] State management is appropriate
- [ ] No memory leaks or performance issues
- [ ] UI/UX follows design system
- [ ] Error messages are user-friendly
- [ ] Security best practices are followed
