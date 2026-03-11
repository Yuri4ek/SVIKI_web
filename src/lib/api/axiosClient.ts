import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { API_URL } from "./api-url";
import { useUserStore } from "@/lib/store";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  useUserStore.getState().logout();
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return false;
    const currentTime = Date.now();
    const expirationTime = decoded.exp * 1000;
    return expirationTime < currentTime + 10000;
  } catch {
    return true;
  }
};

const performTokenRefresh = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (
    !refreshToken ||
    refreshToken === "undefined" ||
    refreshToken === "null"
  ) {
    handleLogout();
    throw new Error("No refresh token available.");
  }

  const response = await axios.get(`${API_URL}/auth/login-by-refresh-token`, {
    params: {
      refreshToken,
      _t: Date.now(),
    },
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  const { token: newToken, refreshToken: newRefreshToken } = response.data;

  if (newToken && newRefreshToken) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return newToken;
  } else {
    handleLogout();
    throw new Error("Server did not return new tokens.");
  }
};

api.interceptors.request.use(
  async (config) => {
    // Web: Синхронное получение из localStorage
    let token = localStorage.getItem("token");

    if (token) {
      if (isTokenExpired(token)) {
        if (isRefreshing) {
          try {
            token = await new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
          } catch (error) {
            return Promise.reject(error);
          }
        } else {
          isRefreshing = true;
          try {
            token = await performTokenRefresh();
            processQueue(null, token);
          } catch (refreshError) {
            processQueue(refreshError, null);
            handleLogout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("login-by-refresh-token")) {
      console.error(
        "[Axios] Refresh token также невалиден или протух. Выход из аккаунта.",
      );
      handleLogout();
      return Promise.reject(error);
    }

    console.error(
      `[Axios] Ошибка ${error.response?.status} при запросе к ${originalRequest?.url}`,
    );

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn(
        "[Axios] Получен 401 Unauthorized. Попытка обновления токена...",
      );

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await performTokenRefresh();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
