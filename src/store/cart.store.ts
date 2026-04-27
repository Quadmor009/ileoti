import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { effectivePrice } from '../lib/format';

export interface GuestCartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
}

interface CartState {
  // Guest cart (works without login)
  guestItems: GuestCartItem[];
  // Logged-in cart from API
  items: any[];
  itemCount: number;
  total: number;
  isLoggedIn: boolean;
  // Guest cart actions
  addGuestItem: (item: GuestCartItem) => void;
  removeGuestItem: (productId: string) => void;
  updateGuestItem: (productId: string, quantity: number) => void;
  clearGuestCart: () => void;
  // API cart actions
  setCart: (cartData: any) => void;
  clearCart: () => void;
  setLoggedIn: (v: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      guestItems: [],
      items: [],
      itemCount: 0,
      total: 0,
      isLoggedIn: false,

      addGuestItem: (item) => {
        const existing = get().guestItems.find(i => i.productId === item.productId);
        let guestItems: GuestCartItem[];
        if (existing) {
          guestItems = get().guestItems.map(i =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          guestItems = [...get().guestItems, item];
        }
        const itemCount = guestItems.reduce((sum, i) => sum + i.quantity, 0);
        const total = guestItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        set({ guestItems, itemCount, total });
      },

      removeGuestItem: (productId) => {
        const guestItems = get().guestItems.filter(i => i.productId !== productId);
        const itemCount = guestItems.reduce((sum, i) => sum + i.quantity, 0);
        const total = guestItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        set({ guestItems, itemCount, total });
      },

      updateGuestItem: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeGuestItem(productId);
          return;
        }
        const guestItems = get().guestItems.map(i =>
          i.productId === productId ? { ...i, quantity } : i
        );
        const itemCount = guestItems.reduce((sum, i) => sum + i.quantity, 0);
        const total = guestItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        set({ guestItems, itemCount, total });
      },

      clearGuestCart: () => set({ guestItems: [], itemCount: 0, total: 0 }),

      setCart: (cartData: any) => {
        const items = cartData?.items ?? [];
        const itemCount = items.reduce((sum: number, i: any) => sum + (i.quantity ?? 1), 0);
        const total = items.reduce(
          (sum: number, i: any) => sum + effectivePrice(i.product ?? {}) * (i.quantity ?? 1),
          0,
        );
        set({ items, itemCount, total });
      },

      clearCart: () => set({ items: [], guestItems: [], itemCount: 0, total: 0 }),
      setLoggedIn: (v) => set({ isLoggedIn: v }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ guestItems: state.guestItems }),
    }
  )
);
