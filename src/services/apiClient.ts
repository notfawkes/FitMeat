export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const ACCESS_TOKEN_KEY = 'fitmeat_access_token';

async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const result = await parseResponse(response);
  if (!response.ok) {
    const error = (result as ApiErrorResponse).error || response.statusText || 'Request failed';
    throw new Error(error as string);
  }

  return result as T;
}

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    return apiFetch<T>(path, { method: 'GET' });
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    return apiFetch<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    return apiFetch<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async delete<T>(path: string): Promise<T> {
    return apiFetch<T>(path, { method: 'DELETE' });
  },
};
