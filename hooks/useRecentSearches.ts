import { getStoredJson, setStoredJson } from '@/utils/storage';
import { useCallback, useEffect, useState } from 'react';

export interface RecentSearch {
  query?: string;
  location?: string;
  createdAt: number;
}

const RECENT_SEARCHES_STORAGE_KEY = 'recentSearches';

type RecentSearchesListener = (recentSearches: RecentSearch[]) => void;

let recentSearchesStore = getStoredJson<RecentSearch[]>(RECENT_SEARCHES_STORAGE_KEY, []);
const listeners = new Set<RecentSearchesListener>();

function sameSearch(a: RecentSearch, b: RecentSearch) {
  return (a.query ?? '') === (b.query ?? '') && (a.location ?? '') === (b.location ?? '');
}

function emitRecentSearches() {
  setStoredJson(RECENT_SEARCHES_STORAGE_KEY, recentSearchesStore);
  listeners.forEach((listener) => listener([...recentSearchesStore]));
}

function subscribe(listener: RecentSearchesListener) {
  listeners.add(listener);
  listener([...recentSearchesStore]);
  return () => {
    listeners.delete(listener);
  };
}

export function useRecentSearches(limit = 6) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(recentSearchesStore);

  useEffect(() => subscribe(setRecentSearches), []);

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

      const withoutDuplicate = recentSearchesStore.filter((item) => !sameSearch(item, nextEntry));
      recentSearchesStore = [nextEntry, ...withoutDuplicate].slice(0, limit);
      emitRecentSearches();
    },
    [limit]
  );

  const clearSearches = useCallback(() => {
    recentSearchesStore = [];
    emitRecentSearches();
  }, []);

  return { recentSearches, addSearch, clearSearches };
}
