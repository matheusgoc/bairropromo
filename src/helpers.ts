import dayjs from 'dayjs';

import type { TimeOfDay } from '@/types';

export function extractInitials(name?: string) {
  if (!name?.trim()) {
    return '';
  }

  const names = name.split(' ');
  if (name.length === 1) {
    const letters = names[0].split('');
    return letters[0].toUpperCase() + letters[1].toUpperCase();
  }

  return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
}

/** `date` with its time-of-day replaced by `time` (milliseconds zeroed). */
export function withTime(date: Date, { hours, minutes, seconds }: TimeOfDay) {
  return dayjs(date)
    .hour(hours)
    .minute(minutes)
    .second(seconds)
    .millisecond(0)
    .toDate();
}

/** The time-of-day of `date`. */
export function timeOf(date: Date): TimeOfDay {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
}

/**
 * ISO 8601 with the device's offset (e.g. `2026-11-16T18:30:00-03:00`), as
 * the API requires. `undefined` when there is no date.
 */
export function toIsoDateTime(date?: Date | null): string | undefined {
  return date ? dayjs(date).format() : undefined;
}

/** Seconds as `m:ss` for countdowns (e.g. `60` → `1:00`, `9` → `0:09`). */
export function formatCountdown(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}
