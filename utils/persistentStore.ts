import { getStoredJson, setStoredJson } from '@/utils/storage';

type StoreListener<T> = (state: T) => void;

interface PersistentStoreOptions<T> {
  key: string;
  initialState: T;
  mergeHydratedState?: (current: T, persisted: T) => T;
}

export interface PersistentStore<T> {
  getSnapshot: () => T;
  subscribe: (listener: StoreListener<T>) => () => void;
  setState: (nextState: T) => Promise<void>;
  updateState: (updater: (prevState: T) => T) => Promise<void>;
  resetState: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export function createPersistentStore<T>({
  key,
  initialState,
  mergeHydratedState,
}: PersistentStoreOptions<T>): PersistentStore<T> {
  let state = initialState;
  let hydrated = false;
  let hydratePromise: Promise<void> | null = null;
  const listeners = new Set<StoreListener<T>>();

  const emit = () => {
    listeners.forEach((listener) => listener(state));
  };

  const persist = async () => {
    await setStoredJson(key, state);
  };

  const hydrate = async () => {
    if (hydrated) {
      return;
    }

    if (hydratePromise) {
      await hydratePromise;
      return;
    }

    hydratePromise = (async () => {
      const persisted = await getStoredJson<T>(key, state);
      state = mergeHydratedState ? mergeHydratedState(state, persisted) : persisted;
      hydrated = true;
      emit();
    })();

    try {
      await hydratePromise;
    } finally {
      hydratePromise = null;
    }
  };

  const setState = async (nextState: T) => {
    state = nextState;
    emit();
    await persist();
  };

  const updateState = async (updater: (prevState: T) => T) => {
    state = updater(state);
    emit();
    await persist();
  };

  const resetState = async () => {
    state = initialState;
    emit();
    await persist();
  };

  const subscribe = (listener: StoreListener<T>) => {
    listeners.add(listener);
    listener(state);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    getSnapshot: () => state,
    subscribe,
    setState,
    updateState,
    resetState,
    hydrate,
  };
}
