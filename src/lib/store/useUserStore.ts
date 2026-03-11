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
  isAuthChecking: boolean;

  setRole: (role: UserRole) => void;
  login: (role: UserRole) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
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
    if (
      !useUserStore.getState().isAuthChecking &&
      useUserStore.getState().isLoggedIn
    ) {
      return;
    }

    console.log("[Auth Store] Восстановление сессии из хранилища...");
    try {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!token || !refreshToken) {
        console.log("[Auth Store] Токены отсутствуют.");
        set({ isLoggedIn: false, role: null, isAuthChecking: false });
        return;
      }

      const decoded = jwtDecode<SvikiJwtPayload>(token);

      // Достаем роль
      const rawRole =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const userRole = (
        Array.isArray(rawRole) ? rawRole[0] : rawRole
      ) as UserRole;

      console.log(
        `[Auth Store] Роль восстановлена: ${userRole}. Делегируем проверку свежести токена Axios.`,
      );

      set({ isLoggedIn: true, role: userRole, isAuthChecking: false });
    } catch (error) {
      console.error("[Auth Store] Ошибка при чтении токена:", error);
      useUserStore.getState().logout();
      set({ isAuthChecking: false });
    }
  },
}));
