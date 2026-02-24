const memoryStore = new Map<string, string>();

function hasLocalStorage(): boolean {
  return typeof globalThis !== 'undefined' && 'localStorage' in globalThis;
}

export function setStoredValue(key: string, value: string): void {
  if (hasLocalStorage()) {
    try {
      globalThis.localStorage.setItem(key, value);
      return;
    } catch {
      // Fall back to in-memory storage on storage access issues.
    }
  }

  memoryStore.set(key, value);
}

export function getStoredValue(key: string): string | null {
  if (hasLocalStorage()) {
    try {
      return globalThis.localStorage.getItem(key);
    } catch {
      // Fall back to in-memory storage on storage access issues.
    }
  }

  return memoryStore.get(key) ?? null;
}

export function setStoredJson<T>(key: string, value: T): void {
  setStoredValue(key, JSON.stringify(value));
}

export function getStoredJson<T>(key: string, fallback: T): T {
  const raw = getStoredValue(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
