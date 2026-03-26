import { clearApplicationsStore } from '@/hooks/useApplications';
import { resetConversationsStore } from '@/hooks/useConversations';
import { clearFavoritesStore } from '@/hooks/useFavorites';
import { clearRecentSearchesStore } from '@/hooks/useRecentSearches';
import { resetEmployerJobs } from '@/services/jobs';
import type { User, UserRole } from '@/types/user';
import { getStoredJson, removeStoredValue, setStoredJson } from '@/utils/storage';
import { useCallback, useEffect, useState } from 'react';

const AUTH_STORAGE_KEY = 'authUser';

type AuthListener = (user: User | null) => void;

let authUserStore = getStoredJson<User | null>(AUTH_STORAGE_KEY, null);
const listeners = new Set<AuthListener>();

function emitAuth() {
  if (authUserStore) {
    setStoredJson(AUTH_STORAGE_KEY, authUserStore);
  } else {
    removeStoredValue(AUTH_STORAGE_KEY);
  }

  listeners.forEach((listener) => listener(authUserStore ? { ...authUserStore } : null));
}

function subscribe(listener: AuthListener) {
  listeners.add(listener);
  listener(authUserStore ? { ...authUserStore } : null);

  return () => {
    listeners.delete(listener);
  };
}

function clearSessionData() {
  clearFavoritesStore();
  clearApplicationsStore();
  clearRecentSearchesStore();
  resetConversationsStore();
  resetEmployerJobs();
}

interface UseAuthResult {
  user: User | null;
  register: (params: { name: string; role: UserRole }) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => void;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(authUserStore);

  useEffect(() => subscribe(setUser), []);

  const register = useCallback((params: { name: string; role: UserRole }) => {
    const next: User = {
      id: String(Date.now()),
      name: params.name.trim() || 'user',
      role: params.role,
    };

    authUserStore = next;
    emitAuth();
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    if (!authUserStore) return;

    authUserStore = { ...authUserStore, ...patch };
    emitAuth();
  }, []);

  const logout = useCallback(() => {
    authUserStore = null;
    emitAuth();
    clearSessionData();
  }, []);

  return { user, register, updateUser, logout };
}
