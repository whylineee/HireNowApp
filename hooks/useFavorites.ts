import { createPersistentStore } from '@/utils/persistentStore';
import { useCallback, useEffect, useState } from 'react';

const FAVORITES_STORAGE_KEY = 'favorites';

const favoritesStore = createPersistentStore<string[]>({
  key: FAVORITES_STORAGE_KEY,
  initialState: [],
});

export function clearFavoritesStore() {
  return favoritesStore.resetState();
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(favoritesStore.getSnapshot());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = favoritesStore.subscribe((state) => setFavorites([...state]));

    let active = true;
    void favoritesStore.hydrate().finally(() => {
      if (active) {
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const addFavorite = useCallback((jobId: string) => {
    if (favoritesStore.getSnapshot().includes(jobId)) return;
    void favoritesStore.updateState((prevState) => [...prevState, jobId]);
  }, []);

  const removeFavorite = useCallback((jobId: string) => {
    void favoritesStore.updateState((prevState) => prevState.filter((id) => id !== jobId));
  }, []);

  const toggleFavorite = useCallback((jobId: string) => {
    if (favoritesStore.includes(jobId)) {
      removeFavorite(jobId);
      return;
    }
    addFavorite(jobId);
  }, [addFavorite, removeFavorite]);

  const isFavorite = useCallback((jobId: string) => favorites.includes(jobId), [favorites]);

  const clearFavorites = useCallback(() => {
    void clearFavoritesStore();
  }, []);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
