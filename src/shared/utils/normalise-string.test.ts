import { describe, expect, it } from 'vitest';

import { normaliseString } from './normalise-string';

describe('normaliseString', () => {
  it('trims whitespace', () => {
    expect(normaliseString('  Hello  ')).toBe('hello');
  });

  it('lowercases', () => {
    expect(normaliseString('HeLLo')).toBe('hello');
  });

  it('collapses multiple whitespace into single spaces', () => {
    expect(normaliseString('Hello     world   again')).toBe('hello world again');
  });

  it('handles tabs and newlines', () => {
    expect(normaliseString('Hello\tworld\nagain')).toBe('hello world again');
  });

  it('returns empty string when input is only whitespace', () => {
    expect(normaliseString('   \n\t  ')).toBe('');
  });
});
