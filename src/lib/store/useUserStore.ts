import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  role: UserRole;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      role: "Client",
      isLoggedIn: false,

      setRole: (role) => set({ role }),

      login: (role) => set({ role, isLoggedIn: true }),

      logout: () => set({ isLoggedIn: false, role: "Client" }),
    }),
    {
      name: "sviki-user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
