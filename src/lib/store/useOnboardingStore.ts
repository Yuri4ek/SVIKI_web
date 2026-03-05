import { create } from "zustand";
import { UserRole } from "./useUserStore";

interface OnboardingState {
  regData: { phone: string; password: string; role: UserRole } | null;
  setRegData: (data: {
    phone: string;
    password: string;
    role: UserRole;
  }) => void;
  clear: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  regData: null,
  setRegData: (data) => set({ regData: data }),
  clear: () => set({ regData: null }),
}));
