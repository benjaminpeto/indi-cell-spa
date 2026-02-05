import { describe, expect, test, vi } from 'vitest';

import { getCache, removeCache, setCache } from './cache-storage';

describe('storage-cache', () => {
  test('returns null when missing', () => {
    removeCache('x');
    expect(getCache('x')).toBeNull();
  });

  test('returns value when not expired', () => {
    setCache('a', { ok: true }, 10_000);
    expect(getCache<{ ok: boolean }>('a')).toEqual({ ok: true });
  });

  test('returns null when expired', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2020-01-01T00:00:00Z'));

    setCache('b', 'value', 1000);

    vi.setSystemTime(new Date('2020-01-01T00:00:02Z'));
    expect(getCache<string>('b')).toBeNull();

    vi.useRealTimers();
  });
});
