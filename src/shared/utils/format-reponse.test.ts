import { describe, expect, it } from 'vitest';

import { formatMaybeArray, formatWeight } from './format-reponse';

describe('formatMaybeArray()', () => {
  it('returns null for nullish and empty-string-like values', () => {
    expect(formatMaybeArray(undefined)).toBeNull();
    expect(formatMaybeArray(null)).toBeNull();
    expect(formatMaybeArray('')).toBeNull();
    expect(formatMaybeArray('   ')).toBeNull();
  });

  it('trims and returns a non-array value as string', () => {
    expect(formatMaybeArray('  Hello  ')).toBe('Hello');
    expect(formatMaybeArray(123)).toBe('123');
  });

  it('joins cleaned array values with commas', () => {
    expect(formatMaybeArray([' 13 MP ', '', ' autofocus ', '   '])).toBe('13 MP, autofocus');
  });

  it('returns null for arrays that become empty after cleaning', () => {
    expect(formatMaybeArray(['', '   ', '\n'])).toBeNull();
  });
});

describe('formatWeight()', () => {
  it('returns null for undefined and blank strings', () => {
    expect(formatWeight(undefined)).toBeNull();
    expect(formatWeight('')).toBeNull();
    expect(formatWeight('   ')).toBeNull();
  });

  it('adds "g" suffix for numeric values', () => {
    expect(formatWeight('260')).toBe('260 g');
    expect(formatWeight(' 260.5 ')).toBe('260.5 g');
  });

  it('returns trimmed non-numeric values unchanged', () => {
    expect(formatWeight(' 260 g ')).toBe('260 g');
    expect(formatWeight('approx 260')).toBe('approx 260');
  });
});
