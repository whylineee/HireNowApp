import { getStoredJson, setStoredJson } from '@/utils/storage';
import { useCallback, useEffect, useState } from 'react';

export interface UserPreferences {
  notificationsEnabled: boolean;
  compactMode: boolean;
  openToWork: boolean;
}

const USER_PREFERENCES_STORAGE_KEY = 'userPreferences';

const defaultPreferences: UserPreferences = {
  notificationsEnabled: true,
  compactMode: false,
  openToWork: true,
};

type PreferencesListener = (preferences: UserPreferences) => void;

let preferencesStore = getStoredJson<UserPreferences>(USER_PREFERENCES_STORAGE_KEY, defaultPreferences);
const listeners = new Set<PreferencesListener>();

function emitPreferences() {
  setStoredJson(USER_PREFERENCES_STORAGE_KEY, preferencesStore);
  listeners.forEach((listener) => listener({ ...preferencesStore }));
}

function subscribe(listener: PreferencesListener) {
  listeners.add(listener);
  listener({ ...preferencesStore });
  return () => {
    listeners.delete(listener);
  };
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(preferencesStore);

  useEffect(() => subscribe(setPreferences), []);

  const setPreference = useCallback(<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    preferencesStore = {
      ...preferencesStore,
      [key]: value,
    };
    emitPreferences();
  }, []);

  return { preferences, setPreference };
}
