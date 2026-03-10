import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { SvikiJwtPayload } from "@/lib/api/authService";

export type UserRole = "Client" | "Agent" | "Lawyer" | "Admin" | "Manager";

export const RoleTranslation: Record<string, UserRole> = {
  Клиент: "Client",
  Агент: "Agent",
  Юрист: "Lawyer",
};

export const RoleDisplay: Record<UserRole, string> = {
  Client: "Клиент",
  Agent: "Агент",
  Lawyer: "Юрист",
  Admin: "Администратор",
  Manager: "Менеджер",
};

export const REGISTRATION_ROLES_UI = Object.keys(RoleTranslation);

interface UserState {
  role: UserRole | null;
  isLoggedIn: boolean;
  isAuthChecking: boolean; // Флаг для экрана загрузки при старте приложения

  setRole: (role: UserRole) => void;
  login: (role: UserRole) => void;
  logout: () => void;
  checkAuth: () => Promise<void>; // Метод для проверки сессии через бэкенд
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  isLoggedIn: false,
  isAuthChecking: true,

  setRole: (role) => set({ role }),

  login: (role) => set({ role, isLoggedIn: true }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({ isLoggedIn: false, role: null });
  },

  checkAuth: async () => {
    console.log("[Auth Store] Начало проверки сессии (checkAuth)...");
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("[Auth Store] Токен не найден в localStorage.");
        set({ isLoggedIn: false, role: null, isAuthChecking: false });
        return;
      }

      const decoded = jwtDecode<SvikiJwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        console.warn("[Auth Store] Токен истек. Требуется обновление.");
        // Здесь axios interceptor попытается его обновить при первом запросе,
        // но пока мы считаем пользователя неавторизованным.
        set({ isLoggedIn: false, role: null, isAuthChecking: false });
        return;
      }

      const rawRole =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const userRole = (
        Array.isArray(rawRole) ? rawRole[0] : rawRole
      ) as UserRole;

      console.log(
        `[Auth Store] Токен валиден. Роль: ${userRole}. Сессия восстановлена.`,
      );
      set({ isLoggedIn: true, role: userRole, isAuthChecking: false });
    } catch (error) {
      console.error("[Auth Store] Ошибка при проверке токена:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      set({ isLoggedIn: false, role: null, isAuthChecking: false });
    }
  },
}));
