import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "./api-url";

const API_URL_Auth = API_URL + "/auth";

const api = axios.create({
  baseURL: API_URL_Auth,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface LoginResponse {
  token: string;
  tokenExpired: number;
  refreshToken: string;
  role: string;
}

export interface SvikiJwtPayload {
  userid: string;
  unique_name?: string;
  phone?: string;
  role: string;
  exp: number;
  iss?: string;
  aud?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export const authService = {
  login: async (phoneEmail: string, password: string) => {
    const response = await api.post<LoginResponse>("/login", {
      phoneEmail: phoneEmail,
      password: password,
      remember: true,
    });

    const { token, refreshToken, tokenExpired } = response.data;
    const decoded = jwtDecode<SvikiJwtPayload>(token);

    const rawRole =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const userRole = Array.isArray(rawRole) ? rawRole[0] : rawRole;

    // Web: localStorage вместо SecureStore
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    return {
      token,
      refreshToken,
      tokenExpired,
      role: userRole,
    };
  },

  register: async (phone: number, password: string, role: string) => {
    const response = await api.post("/register", {
      phone: phone,
      password: password,
      role: role,
      confirmPassword: password,
      checktTerms: null,
      referralCode: null,
    });
    return response.data;
  },

  confirmCode: async (userId: number, code: string) => {
    const response = await api.post("/confirm-code", {
      userId,
      code,
    });
    return response.data;
  },

  refreshToken: async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      const response = await axios.get(
        `${API_URL}/auth/login-by-refresh-token`,
        {
          params: { refreshToken },
        },
      );

      const { token: newToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return newToken;
    } catch (error) {
      console.error("Manual token refresh failed:", error);
      return null;
    }
  },
};
