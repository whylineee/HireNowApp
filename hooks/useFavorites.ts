import { getStoredJson, setStoredJson } from '@/utils/storage';
import { useCallback, useEffect, useState } from 'react';

const FAVORITES_STORAGE_KEY = 'favorites';

type FavoritesListener = (favorites: string[]) => void;

let favoritesStore = getStoredJson<string[]>(FAVORITES_STORAGE_KEY, []);
const listeners = new Set<FavoritesListener>();

function emitFavorites() {
  setStoredJson(FAVORITES_STORAGE_KEY, favoritesStore);
  listeners.forEach((listener) => listener([...favoritesStore]));
}

function subscribe(listener: FavoritesListener) {
  listeners.add(listener);
  listener([...favoritesStore]);
  return () => {
    listeners.delete(listener);
  };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(favoritesStore);
  const [loading] = useState(false);

  useEffect(() => subscribe(setFavorites), []);

  const addFavorite = useCallback((jobId: string) => {
    if (favoritesStore.includes(jobId)) return;
    favoritesStore = [...favoritesStore, jobId];
    emitFavorites();
  }, []);

  const removeFavorite = useCallback((jobId: string) => {
    favoritesStore = favoritesStore.filter((id) => id !== jobId);
    emitFavorites();
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
    favoritesStore = [];
    emitFavorites();
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
