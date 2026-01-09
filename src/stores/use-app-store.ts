import type { AppStore } from "@/types/app-store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState: AppStore = {
  currency: "USD",
  isFirstSession: true,
};

export const useAppStore = create<AppStore>()(
  persist(() => initialState, { name: "AppStore" }),
);

export function updateCurrency(currency: string) {
  useAppStore.setState({ currency });
}

export function setFirstSession(state: boolean) {
  useAppStore.setState({ isFirstSession: state });
}
