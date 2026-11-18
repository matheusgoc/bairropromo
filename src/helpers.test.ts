import { describe, expect, it } from '@jest/globals';

import { END_OF_DAY, START_OF_DAY } from './constants';
import { timeOf, toIsoDateTime, withTime } from './helpers';

// 18/11/2026 14:37:12.345, local time.
const DATE = new Date(2026, 10, 18, 14, 37, 12, 345);

describe('withTime', () => {
  it('applies the start of the day', () => {
    expect(withTime(DATE, START_OF_DAY)).toEqual(new Date(2026, 10, 18));
  });

  it('applies the end of the day', () => {
    expect(withTime(DATE, END_OF_DAY)).toEqual(
      new Date(2026, 10, 18, 23, 59, 59, 0),
    );
  });

  it('applies a picked time with milliseconds zeroed', () => {
    expect(withTime(DATE, { hours: 9, minutes: 5, seconds: 0 })).toEqual(
      new Date(2026, 10, 18, 9, 5, 0, 0),
    );
  });

  it('does not mutate the given date', () => {
    withTime(DATE, START_OF_DAY);
    expect(DATE).toEqual(new Date(2026, 10, 18, 14, 37, 12, 345));
  });
});

describe('timeOf', () => {
  it('returns the local time-of-day', () => {
    expect(timeOf(DATE)).toEqual({ hours: 14, minutes: 37, seconds: 12 });
  });
});

describe('toIsoDateTime', () => {
  it('is undefined without a date', () => {
    expect(toIsoDateTime(null)).toBeUndefined();
    expect(toIsoDateTime(undefined)).toBeUndefined();
  });

  it('formats local time with the device offset', () => {
    const iso = toIsoDateTime(withTime(DATE, END_OF_DAY));
    expect(iso).toMatch(/^2026-11-18T23:59:59[+-]\d{2}:\d{2}$/);
    expect(new Date(iso!).getTime()).toBe(
      new Date(2026, 10, 18, 23, 59, 59).getTime(),
    );
  });
});
