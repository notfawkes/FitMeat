import { apiFetch } from './apiClient';

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  address: string;
  phoneNumber: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ProfileData {
  id: string;
  email: string;
  name: string;
  address: string;
  phone_number: string;
}

export interface OrderData {
  id: string;
  user_id: string;
  order_date: string;
  total_amount: number;
  items: unknown;
  status: string;
}

export interface MeResponse {
  user: { id: string; email: string };
  profile: ProfileData | null;
  orders: OrderData[];
}

export async function signup(payload: SignupPayload): Promise<void> {
  await apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload): Promise<TokensResponse> {
  return apiFetch<TokensResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function refresh(refreshToken: string): Promise<{ accessToken: string }> {
  return apiFetch<{ accessToken: string }>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getMe(accessToken: string): Promise<MeResponse> {
  return apiFetch<MeResponse>('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function createOrder(accessToken: string, items: unknown, totalAmount: number) {
  return apiFetch('/api/auth/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ items, totalAmount }),
  });
}
