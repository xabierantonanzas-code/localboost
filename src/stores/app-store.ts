import { create } from "zustand";
import type { Business } from "@/types";

interface AppStore {
  activeBusiness: Business | null;
  setActiveBusiness: (b: Business | null) => void;
  onboardingStep: number;
  setOnboardingStep: (n: number) => void;
  completedSteps: number[];
  completeStep: (n: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeBusiness: null,
  setActiveBusiness: (b) => set({ activeBusiness: b }),
  onboardingStep: 1,
  setOnboardingStep: (n) => set({ onboardingStep: n }),
  completedSteps: [],
  completeStep: (n) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(n)
        ? state.completedSteps
        : [...state.completedSteps, n],
    })),
}));
