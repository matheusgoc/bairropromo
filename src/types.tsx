import { DARK_THEME, LIGHT_THEME } from '@/theme';

export type DefaultTheme = typeof DARK_THEME | typeof LIGHT_THEME;

/** A wall-clock time, applied to a date with `withTime`. */
export interface TimeOfDay {
  hours: number;
  minutes: number;
  seconds: number;
}
