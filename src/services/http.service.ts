import { getAuthToken } from '@/stores/auth.store';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  /** `code` attribute of the error payload, when the API sends one. */
  get code(): string | undefined {
    const code = (this.body as { code?: unknown } | null | undefined)?.code;
    return typeof code === 'string' ? code : undefined;
  }
}

/**
 * React Query `retry` option: retries network/5xx failures up to 3 times,
 * but never 4xx (404, 403...), since those won't change on retry.
 */
export const retryUnlessClientError = (failureCount: number, error: Error) =>
  !(error instanceof HttpError && error.status < 500) && failureCount < 3;

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Action endpoints (e.g. publish) may answer 204 / an empty body.
  const text = await res.text();

  if (!res.ok) {
    let body: unknown = text || undefined;
    try {
      body = text ? JSON.parse(text) : undefined;
    } catch {
      // Non-JSON error payload: keep the raw text.
    }
    throw new HttpError(res.status, `HTTP ${res.status}`, body);
  }

  return (text ? JSON.parse(text) : undefined) as T;
}

const HttpService = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

export default HttpService;
