import { useState, useEffect, useCallback } from 'react';

// Тимчасове збереження в пам'яті (без AsyncStorage)
// Після встановлення @react-native-async-storage/async-storage можна додати постійне збереження
let memoryStorage: string[] = [];

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(memoryStorage);
  const [loading, setLoading] = useState(false);

  // Завантажити збережені ID при монтуванні
  useEffect(() => {
    setFavorites(memoryStorage);
    setLoading(false);
  }, []);

  const addFavorite = useCallback((jobId: string) => {
    if (!memoryStorage.includes(jobId)) {
      memoryStorage = [...memoryStorage, jobId];
      setFavorites(memoryStorage);
    }
  }, []);

  const removeFavorite = useCallback((jobId: string) => {
    memoryStorage = memoryStorage.filter((id) => id !== jobId);
    setFavorites(memoryStorage);
  }, []);

  const toggleFavorite = useCallback((jobId: string) => {
    if (favorites.includes(jobId)) {
      removeFavorite(jobId);
    } else {
      addFavorite(jobId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((jobId: string) => {
    return favorites.includes(jobId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    memoryStorage = [];
    setFavorites([]);
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
