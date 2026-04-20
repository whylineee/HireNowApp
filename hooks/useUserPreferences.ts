import { createPersistentStore } from '@/utils/persistentStore';
import { useCallback, useEffect, useState } from 'react';

export interface UserPreferences {
  notificationsEnabled: boolean;
  compactMode: boolean;
  openToWork: boolean;
  remoteOnlySearch: boolean;
  hideAppliedJobs: boolean;
  pinImportantChats: boolean;
}

const USER_PREFERENCES_STORAGE_KEY = 'userPreferences';

const defaultPreferences: UserPreferences = {
  notificationsEnabled: true,
  compactMode: false,
  openToWork: true,
  remoteOnlySearch: false,
  hideAppliedJobs: false,
  pinImportantChats: true,
};

const preferencesStore = createPersistentStore<UserPreferences>({
  key: USER_PREFERENCES_STORAGE_KEY,
  initialState: defaultPreferences,
  mergeHydratedState: (current, persisted) => ({
    ...current,
    ...persisted,
  }),
});

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(preferencesStore.getSnapshot());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = preferencesStore.subscribe((state) => setPreferences({ ...state }));

    let active = true;
    void preferencesStore.hydrate().finally(() => {
      if (active) {
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const setPreference = useCallback(<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    void preferencesStore.updateState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }, []);

  return { preferences, loading, setPreference };
}
