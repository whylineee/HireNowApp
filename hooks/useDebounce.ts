import { useState, useEffect, useCallback } from 'react';

/**
 * Хук для debounce значення (корисно для пошуку)
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * Хук для debounce callback-функції
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number
): T {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFn = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutId) clearTimeout(timeoutId);
      const id = setTimeout(() => fn(...args), delayMs);
      setTimeoutId(id);
    }) as T,
    [fn, delayMs, timeoutId]
  );

  useEffect(() => {
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [timeoutId]);

  return debouncedFn;
}
