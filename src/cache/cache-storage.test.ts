import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCache, ONE_HOUR_MS, removeCache, setCache } from './cache-storage';

type Example = { a: number };

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('cache-storage', () => {
  it('setCache stores a record with value and expiresAt', () => {
    setCache<Example>('k', { a: 1 });

    const raw = localStorage.getItem('k');
    expect(raw).toBeTruthy();

    const parsed = JSON.parse(raw as string) as { value: Example; expiresAt: number };
    expect(parsed.value).toEqual({ a: 1 });
    expect(typeof parsed.expiresAt).toBe('number');
  });

  it('getCache returns cached value when not expired', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-05T00:00:00Z'));

    setCache<Example>('k', { a: 1 }, ONE_HOUR_MS);

    vi.setSystemTime(new Date('2026-02-05T00:30:00Z'));
    expect(getCache<Example>('k')).toEqual({ a: 1 });
  });

  it('getCache returns null and removes entry when expired', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-05T00:00:00Z'));

    setCache<Example>('k', { a: 1 }, 1000);

    vi.setSystemTime(new Date('2026-02-05T00:00:02Z'));
    expect(getCache<Example>('k')).toBeNull();
    expect(localStorage.getItem('k')).toBeNull();
  });

  it('getCache returns null and removes entry when JSON is invalid', () => {
    localStorage.setItem('k', '{not-json');

    expect(getCache<Example>('k')).toBeNull();
    expect(localStorage.getItem('k')).toBeNull();
  });

  it('getCache returns null and removes entry when expiresAt is missing/invalid', () => {
    localStorage.setItem('k', JSON.stringify({ value: { a: 1 } }));

    expect(getCache<Example>('k')).toBeNull();
    expect(localStorage.getItem('k')).toBeNull();
  });

  it('removeCache deletes the key', () => {
    setCache<Example>('k', { a: 1 });

    removeCache('k');
    expect(localStorage.getItem('k')).toBeNull();
  });
});
