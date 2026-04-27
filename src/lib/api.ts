import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth.store";

const baseURL = import.meta.env.VITE_BASE_URL ?? "";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<{ accessToken: string }>(
        "/authservice/v1.0/rest/api/app/auth/refresh",
        {},
      )
      .then((res) => res.data.accessToken)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    if (status !== 401) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";
    if (url.includes("/auth/refresh")) {
      useAuthStore.getState().clearAuth();
      window.location.assign("/");
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      useAuthStore.getState().clearAuth();
      window.location.assign("/");
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await refreshAccessToken();
      const { user, setAuth } = useAuthStore.getState();
      setAuth(newToken, user);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch {
      useAuthStore.getState().clearAuth();
      window.location.assign("/");
      return Promise.reject(error);
    }
  },
);

export default api;
