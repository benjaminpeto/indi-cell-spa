import type { CacheRecord } from '../types/cache';

export const ONE_HOUR_MS = 60 * 60 * 1000; // 1h

export function setCache<T>(key: string, value: T, ttlMs: number = ONE_HOUR_MS) {
  const record: CacheRecord<T> = {
    value,
    expiresAt: Date.now() + ttlMs,
  };
  try {
    localStorage.setItem(key, JSON.stringify(record));
  } catch {
    // ignore storage failures, app should still work without cache
  }
}

export function getCache<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CacheRecord<T>;

    if (!parsed || typeof parsed.expiresAt !== 'number') {
      localStorage.removeItem(key);
      return null;
    }

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return (parsed.value ?? null) as T | null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function removeCache(key: string) {
  localStorage.removeItem(key);
}
