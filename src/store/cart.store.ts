import { create } from "zustand";
import type { Cart, CartItem } from "../types";

interface CartState {
  itemCount: number;
  items: any[];
  total: number;
  setCart: (cartData: any) => void;
  clearCart: () => void;
}

function computeTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const discountedPrice = Number(item.product?.discountedPrice ?? 0);
    const regularPrice = Number(item.product?.price ?? 0);
    const price = discountedPrice > 0 ? discountedPrice : regularPrice;
    return sum + price * item.quantity;
  }, 0);
}

function extractItems(cartData: any): CartItem[] {
  if (Array.isArray(cartData?.items)) {
    return cartData.items as CartItem[];
  }
  return [];
}

function extractTotal(cartData: any, items: CartItem[]): number {
  if (typeof cartData?.total === "number") {
    return cartData.total;
  }
  return computeTotal(items);
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  itemCount: 0,
  setCart: (cartData: Cart | any) => {
    const items = extractItems(cartData);
    const itemCount = items.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
    const total = extractTotal(cartData, items);
    set({ items, itemCount, total });
  },
  clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
}));
