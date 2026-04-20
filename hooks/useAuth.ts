import { clearApplicationsStore } from '@/hooks/useApplications';
import { resetConversationsStore } from '@/hooks/useConversations';
import { clearFavoritesStore } from '@/hooks/useFavorites';
import { clearRecentSearchesStore } from '@/hooks/useRecentSearches';
import { resetEmployerJobs } from '@/services/jobs';
import type { User, UserRole } from '@/types/user';
import { createPersistentStore } from '@/utils/persistentStore';
import { useCallback, useEffect, useState } from 'react';

const AUTH_STORAGE_KEY = 'authUser';

const authStore = createPersistentStore<User | null>({
  key: AUTH_STORAGE_KEY,
  initialState: null,
});

function clearSessionData() {
  void clearFavoritesStore();
  void clearApplicationsStore();
  void clearRecentSearchesStore();
  void resetConversationsStore();
  resetEmployerJobs();
}

interface UseAuthResult {
  user: User | null;
  register: (params: { name: string; role: UserRole }) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => void;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(authStore.getSnapshot());

  useEffect(() => {
    const unsubscribe = authStore.subscribe((state) => setUser(state ? { ...state } : null));
    void authStore.hydrate();
    return unsubscribe;
  }, []);

  const register = useCallback((params: { name: string; role: UserRole }) => {
    const next: User = {
      id: String(Date.now()),
      name: params.name.trim() || 'user',
      role: params.role,
    };

    void authStore.setState(next);
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    const currentUser = authStore.getSnapshot();
    if (!currentUser) return;
    void authStore.setState({ ...currentUser, ...patch });
  }, []);

  const logout = useCallback(() => {
    void authStore.setState(null);
    clearSessionData();
  }, []);

  return { user, register, updateUser, logout };
}
