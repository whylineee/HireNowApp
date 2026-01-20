import { useCallback, useEffect, useState } from 'react';

export interface RecentSearch {
  query?: string;
  location?: string;
  createdAt: number;
}

let memorySearches: RecentSearch[] = [];

function sameSearch(a: RecentSearch, b: RecentSearch) {
  return (a.query ?? '') === (b.query ?? '') && (a.location ?? '') === (b.location ?? '');
}

export function useRecentSearches(limit = 6) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(memorySearches);

  useEffect(() => {
    setRecentSearches(memorySearches);
  }, []);

  const addSearch = useCallback(
    (entry: Omit<RecentSearch, 'createdAt'>) => {
      const trimmedQuery = entry.query?.trim() || '';
      const trimmedLocation = entry.location?.trim() || '';
      if (!trimmedQuery && !trimmedLocation) return;

      const nextEntry: RecentSearch = {
        query: trimmedQuery || undefined,
        location: trimmedLocation || undefined,
        createdAt: Date.now(),
      };

      const withoutDuplicate = memorySearches.filter((item) => !sameSearch(item, nextEntry));
      memorySearches = [nextEntry, ...withoutDuplicate].slice(0, limit);
      setRecentSearches(memorySearches);
    },
    [limit]
  );

  const clearSearches = useCallback(() => {
    memorySearches = [];
    setRecentSearches([]);
  }, []);

  return { recentSearches, addSearch, clearSearches };
}
