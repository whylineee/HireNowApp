# Custom Hooks Documentation

## Overview

HireNow uses custom React hooks to encapsulate complex state logic and provide reusable functionality across components. All hooks are TypeScript-typed and follow React best practices.

## Available Hooks

### useJobs

Hook for managing job search functionality with loading states and error handling.

**Import:**
```typescript
import { useJobs } from '@/hooks/useJobs';
```

**Signature:**
```typescript
function useJobs(initialParams?: JobSearchParams): UseJobsResult
```

**Parameters:**
- `initialParams?: JobSearchParams` - Optional initial search parameters

**Returns:**
```typescript
interface UseJobsResult {
  jobs: Job[];                    // Array of jobs
  loading: boolean;               // Loading state
  error: string | null;          // Error message
  search: (params: JobSearchParams) => Promise<void>;  // Search function
  refetch: () => Promise<void>;   // Refetch current results
}
```

**Usage:**
```typescript
function JobSearch() {
  const { jobs, loading, error, search } = useJobs({
    type: 'remote',
    location: 'Київ'
  });

  const handleSearch = (query: string) => {
    search({ query });
  };

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <FlatList
      data={jobs}
      renderItem={({ item }) => <JobCard job={item} />}
    />
  );
}
```

**Features:**
- Automatic initial fetch on mount
- Debounced search to prevent excessive API calls
- Error handling with user-friendly messages
- Loading states for better UX
- Refetch capability for manual refresh

### useFavorites

Hook for managing favorite jobs with in-memory storage.

**Import:**
```typescript
import { useFavorites } from '@/hooks/useFavorites';
```

**Signature:**
```typescript
function useFavorites(): UseFavoritesResult
```

**Returns:**
```typescript
interface UseFavoritesResult {
  favorites: string[];           // Array of favorite job IDs
  loading: boolean;               // Loading state
  addFavorite: (jobId: string) => void;     // Add to favorites
  removeFavorite: (jobId: string) => void;  // Remove from favorites
  toggleFavorite: (jobId: string) => void;  // Toggle favorite status
  isFavorite: (jobId: string) => boolean;   // Check if favorite
  clearFavorites: () => void;     // Clear all favorites
}
```

**Usage:**
```typescript
function JobCard({ job }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <Card>
      <Text>{job.title}</Text>
      <FavoriteButton
        isFavorite={isFavorite(job.id)}
        onPress={() => toggleFavorite(job.id)}
      />
    </Card>
  );
}

function FavoritesScreen() {
  const { favorites, clearFavorites } = useFavorites();
  
  return (
    <View>
      <Button title="Clear All" onPress={clearFavorites} />
      <Text>Total favorites: {favorites.length}</Text>
    </View>
  );
}
```

**Features:**
- In-memory storage (lost on app restart)
- Optimized updates to prevent unnecessary re-renders
- Comprehensive CRUD operations
- Loading state for initial data fetch
- Type-safe operations with TypeScript

**Future Enhancement:**
For production, integrate with AsyncStorage:

```typescript
// Enhanced version with AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@hirenow_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then(stored => setFavorites(JSON.parse(stored || '[]')));
  }, []);

  const saveFavorites = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }, []);

  const addFavorite = useCallback((jobId: string) => {
    saveFavorites([...favorites, jobId]);
  }, [favorites, saveFavorites]);

  // ... other methods
}
```

### useDebounce

Hook for debouncing values and callbacks to optimize performance.

**Import:**
```typescript
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce';
```

#### useDebounce (Value)

Debounces a value with specified delay.

**Signature:**
```typescript
function useDebounce<T>(value: T, delayMs: number): T
```

**Parameters:**
- `value: T` - Value to debounce
- `delayMs: number` - Delay in milliseconds

**Returns:**
- `T` - Debounced value

**Usage:**
```typescript
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchJobs(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <Input
      value={searchTerm}
      onChangeText={setSearchTerm}
      placeholder="Search..."
    />
  );
}
```

#### useDebouncedCallback (Function)

Debounces a callback function.

**Signature:**
```typescript
function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number
): T
```

**Parameters:**
- `fn: T` - Function to debounce
- `delayMs: number` - Delay in milliseconds

**Returns:**
- `T` - Debounced function

**Usage:**
```typescript
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useDebouncedCallback((query: string) => {
    searchJobs(query);
  }, 300);

  const handleChange = (text: string) => {
    setSearchTerm(text);
    debouncedSearch(text);
  };

  return (
    <Input
      value={searchTerm}
      onChangeText={handleChange}
      placeholder="Search..."
    />
  );
}
```

**Features:**
- Generic TypeScript support for any value type
- Proper cleanup to prevent memory leaks
- Optimized with useCallback for performance
- Two variants for different use cases

## Hook Patterns

### Error Handling Pattern

```typescript
const [error, setError] = useState<string | null>(null);

const fetchData = useCallback(async () => {
  try {
    setError(null);
    const result = await apiCall();
    setData(result);
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Unknown error');
  }
}, []);
```

### Loading State Pattern

```typescript
const [loading, setLoading] = useState(false);

const operation = useCallback(async () => {
  setLoading(true);
  try {
    await performOperation();
  } finally {
    setLoading(false);
  }
}, []);
```

### Cleanup Pattern

```typescript
useEffect(() => {
  const subscription = createSubscription();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## Best Practices

1. **TypeScript**: Always type your hooks and their return values
2. **useCallback**: Wrap functions in useCallback to prevent unnecessary re-renders
3. **useEffect**: Properly cleanup effects to prevent memory leaks
4. **Error Boundaries**: Handle errors gracefully with user-friendly messages
5. **Performance**: Use debouncing for expensive operations like search
6. **Separation of Concerns**: Each hook should have a single responsibility

## Creating Custom Hooks

When creating new hooks, follow this template:

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseCustomHookResult {
  value: any;
  loading: boolean;
  error: string | null;
  action: () => void;
}

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
      setError(e instanceof Error ? e.message : 'Error occurred');
    } finally {
      setLoading(false);
    }
  }, [param]);

  useEffect(() => {
    // Initial setup
    action();
  }, [action]);

  return { value, loading, error, action };
}
```

## Testing Hooks

Use React's testing utilities to test hooks:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useJobs } from '@/hooks/useJobs';

describe('useJobs', () => {
  it('should fetch jobs on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useJobs());
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.jobs).toBeDefined();
  });

  it('should handle search', async () => {
    const { result } = renderHook(() => useJobs());
    
    await act(async () => {
      await result.current.search({ query: 'React' });
    });
    
    expect(result.current.jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: expect.stringContaining('React') })
      ])
    );
  });
});
```
