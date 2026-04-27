// NOTE: After Google login, the backend redirects to FRONTEND_URL with ?token=
// Make sure FRONTEND_URL is set to http://localhost:5173 on Railway for local dev
// and to the production frontend URL when deployed
//
// Backend currently uses ?accessToken= — AuthCallback accepts both `token` and `accessToken`.

import Cookies from "js-cookie";
import api from "../lib/api";
import { getApiErrorMessage } from "../lib/api-error";
import { savePathForOAuthReturn } from "../lib/post-login-redirect";
import type { AuthUser } from "../store/auth.store";
import { useAuthStore } from "../store/auth.store";

const LAST_EMAIL_COOKIE = "ileoti_last_email";

const BASE = "/authservice/v1.0/rest/api/app";

function mapProfileToUser(data: Record<string, unknown>): AuthUser {
  return {
    id: String(data.id),
    email: String(data.email),
    firstName: (data.firstName as string | null) ?? null,
    lastName: (data.lastName as string | null) ?? null,
    customerType: String(data.customerType),
    membershipStatus: String(data.membershipStatus),
    isAgeVerified: Boolean(data.isAgeVerified),
    phone: (data.phone as string | null) ?? null,
  };
}

export interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface AddressPayload {
  type: "SHIPPING" | "BILLING";
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip?: string | null;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export const authService = {
  getProfile: () =>
    api.get(`${BASE}/profile`).then((r) => r.data),

  updateProfile: (data: ProfileUpdatePayload) =>
    api.put(`${BASE}/profile`, data).then((r) => r.data),

  getAddresses: () =>
    api.get(`${BASE}/profile/addresses`).then((r) => r.data),

  updateAddress: (id: string, data: Partial<AddressPayload>) =>
    api.put(`${BASE}/profile/addresses/${id}`, data).then((r) => r.data),
  logout,
};

export function getRememberedEmail(): string | undefined {
  return Cookies.get(LAST_EMAIL_COOKIE);
}

export async function sendOtp(email: string): Promise<void> {
  try {
    await api.post(`${BASE}/auth/otp/send`, {
      email,
    });
    Cookies.set(LAST_EMAIL_COOKIE, email, {
      expires: 30,
      sameSite: "lax",
    });
  } catch (e) {
    throw new Error(getApiErrorMessage(e));
  }
}

export async function verifyOtp(email: string, otp: string): Promise<void> {
  try {
    const { data } = await api.post<{
      accessToken: string;
      user: AuthUser;
    }>(`${BASE}/auth/otp/verify`, {
      email,
      otp,
    });
    useAuthStore.getState().setAuth(data.accessToken, data.user);
    // Auto-verify age on login - user confirmed age via the frontend modal
    await api.put('/authservice/v1.0/rest/api/app/profile', {
      dateOfBirth: '1990-01-01',
    });
  } catch (e) {
    throw new Error(getApiErrorMessage(e));
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post(
      `${BASE}/auth/logout`,
      {},
      { withCredentials: true },
    );
    Cookies.remove(LAST_EMAIL_COOKIE);
    useAuthStore.getState().clearAuth();
  } catch (e) {
    throw new Error(getApiErrorMessage(e));
  }
}

export function initiateGoogleLogin(): void {
  savePathForOAuthReturn();
  const raw = import.meta.env.VITE_BASE_URL;
  if (!raw) {
    throw new Error("VITE_BASE_URL is not set");
  }
  const base = raw.replace(/\/$/, "");
  window.location.href = `${base}/authservice/v1.0/rest/api/app/auth/google`;
}

/** Load profile after OAuth (token only in URL). */
export async function fetchProfile(): Promise<AuthUser> {
  try {
    const { data } = await api.get<Record<string, unknown>>(
      `${BASE}/profile`,
    );
    return mapProfileToUser(data);
  } catch (e) {
    throw new Error(getApiErrorMessage(e));
  }
}
