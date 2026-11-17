import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

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

/** Raw value stored by a `DATETIME_MASK` input (the mask keeps only digits). */
const MASKED_DATETIME_FORMAT = 'DDMMYYYYHHmm';

/**
 * `DATETIME_MASK` input value → ISO 8601 with the device's offset
 * (e.g. `2026-11-16T18:30:00-03:00`), as the API requires.
 * `undefined` when empty, incomplete or not a real date (e.g. 31/02).
 */
export function maskedToIsoDateTime(value?: string): string | undefined {
  if (!value) return undefined;
  const date = dayjs(value, MASKED_DATETIME_FORMAT, true);
  return date.isValid() ? date.format() : undefined;
}

/** ISO 8601 date-time → `DATETIME_MASK` input value (local time). */
export function isoToMaskedDateTime(iso?: string): string {
  return iso ? dayjs(iso).format(MASKED_DATETIME_FORMAT) : '';
}
