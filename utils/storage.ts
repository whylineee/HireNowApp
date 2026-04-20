import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const memoryStore = new Map<string, string>();

function getWebStorage(): Storage | null {
  if (Platform.OS !== 'web') {
    return null;
  }

  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null;
  }

  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export async function setStoredValue(key: string, value: string): Promise<void> {
  memoryStore.set(key, value);

  const webStorage = getWebStorage();
  if (webStorage) {
    try {
      webStorage.setItem(key, value);
      return;
    } catch {
      // Fall back to in-memory storage on storage access issues.
    }
  }

  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // Async storage may fail in tests or restricted runtimes.
  }
}

export async function getStoredValue(key: string): Promise<string | null> {
  const webStorage = getWebStorage();
  if (webStorage) {
    try {
      const value = webStorage.getItem(key);
      if (value !== null) {
        memoryStore.set(key, value);
      }
      return value;
    } catch {
      // Fall back to in-memory storage on storage access issues.
    }
  }

  try {
    const asyncValue = await AsyncStorage.getItem(key);
    if (asyncValue !== null) {
      memoryStore.set(key, asyncValue);
      return asyncValue;
    }
  } catch {
    // Async storage may fail in tests or restricted runtimes.
  }

  return memoryStore.get(key) ?? null;
}

export async function removeStoredValue(key: string): Promise<void> {
  memoryStore.delete(key);

  const webStorage = getWebStorage();
  if (webStorage) {
    try {
      webStorage.removeItem(key);
      return;
    } catch {
      // Fall back to in-memory storage on storage access issues.
    }
  }

  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Async storage may fail in tests or restricted runtimes.
  }
}

export async function setStoredJson<T>(key: string, value: T): Promise<void> {
  await setStoredValue(key, JSON.stringify(value));
}

export async function getStoredJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await getStoredValue(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
