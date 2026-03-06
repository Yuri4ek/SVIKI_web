import { create } from "zustand";

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
  isAuthChecking: true, // При старте всегда true, пока не спросим бэкенд

  setRole: (role) => set({ role }),

  login: (role) => set({ role, isLoggedIn: true }),

  logout: () => {
    // Здесь также должен быть вызов API для инвалидации куки на бэкенде
    // await api.post('/auth/logout');
    set({ isLoggedIn: false, role: null });
  },

  checkAuth: async () => {
    try {
      // 1. Делаем запрос к .NET бэкенду (например, GET /api/auth/me)
      // Бэкенд сам прочитает HttpOnly куку и вернет данные, если кука валидна

      // Пример:
      // const response = await api.get('/auth/me');
      // set({ isLoggedIn: true, role: response.data.role, isAuthChecking: false });

      // Временная заглушка, пока API не прикручено:
      set({ isAuthChecking: false });
    } catch (error) {
      // Если куки нет или она протухла, бэкенд вернет 401
      console.log(error)
      set({ isLoggedIn: false, role: null, isAuthChecking: false });
    }
  },
}));
