"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string, color: string, size: string) => void;
  updateQty: (productId: string, color: string, size: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = get().items;
        const idx = items.findIndex(
          (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
        );
        if (idx >= 0) {
          const next = [...items];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          set({ items: next });
        } else {
          set({ items: [...items, { ...item, qty }] });
        }
      },
      remove: (productId, color, size) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.color === color && i.size === size)
          ),
        }),
      updateQty: (productId, color, size, qty) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.color === color && i.size === size
              ? { ...i, qty: Math.max(1, qty) }
              : i
          ),
        }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
      total: () => get().items.reduce((s, i) => s + i.qty * i.price, 0),
    }),
    { name: "mod-cart" }
  )
);
