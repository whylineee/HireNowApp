import { createPersistentStore } from '@/utils/persistentStore';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface RecentSearch {
  query?: string;
  location?: string;
  createdAt: number;
}

const RECENT_SEARCHES_STORAGE_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 20;

const recentSearchesStore = createPersistentStore<RecentSearch[]>({
  key: RECENT_SEARCHES_STORAGE_KEY,
  initialState: [],
});

function sameSearch(a: RecentSearch, b: RecentSearch) {
  return (a.query ?? '') === (b.query ?? '') && (a.location ?? '') === (b.location ?? '');
}

export function clearRecentSearchesStore() {
  return recentSearchesStore.resetState();
}

export function useRecentSearches(limit = 6) {
  const [allRecentSearches, setAllRecentSearches] = useState<RecentSearch[]>(recentSearchesStore.getSnapshot());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = recentSearchesStore.subscribe((state) => setAllRecentSearches([...state]));

    let active = true;
    void recentSearchesStore.hydrate().finally(() => {
      if (active) {
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
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

      void recentSearchesStore.updateState((prevState) => {
        const withoutDuplicate = prevState.filter((item) => !sameSearch(item, nextEntry));
        return [nextEntry, ...withoutDuplicate].slice(0, MAX_RECENT_SEARCHES);
      });
    },
    []
  );

  const clearSearches = useCallback(() => {
    void clearRecentSearchesStore();
  }, []);

  const recentSearches = useMemo(() => allRecentSearches.slice(0, limit), [allRecentSearches, limit]);

  return { recentSearches, loading, addSearch, clearSearches };
}
