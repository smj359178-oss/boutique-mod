"use client";

import { create } from "zustand";

export type Route =
  | { name: "home" }
  | { name: "shop"; category?: string; search?: string }
  | { name: "product"; slug: string }
  | { name: "cart" }
  | { name: "about" }
  | { name: "contact" }
  | { name: "admin" };

interface NavState {
  route: Route;
  history: Route[];
  go: (route: Route) => void;
  back: () => void;
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
}

export const useNav = create<NavState>((set, get) => ({
  route: { name: "home" },
  history: [],
  go: (route) => {
    const cur = get().route;
    set({ route, history: [...get().history, cur], mobileMenuOpen: false, cartOpen: false });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  back: () => {
    const hist = get().history;
    if (hist.length > 0) {
      const prev = hist[hist.length - 1];
      set({ route: prev, history: hist.slice(0, -1) });
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      set({ route: { name: "home" } });
    }
  },
  isAdmin: false,
  setAdmin: (v) => set({ isAdmin: v }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
}));
