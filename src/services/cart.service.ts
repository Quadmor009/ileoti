import api from "../lib/api";
import type { Cart } from "../types";

const BASE = "/orderservice/v1.0/rest/api/app/cart";

/** Backend upserts cart lines via PUT (same payload for add and update). */
const upsertCartItem = async (productId: string, quantity: number): Promise<Cart> => {
  const { data } = await api.put<Cart>(`${BASE}/items`, { productId, quantity });
  return data;
};

export const cartService = {
  getCart: (): Promise<Cart> => api.get(BASE).then((r) => r.data),

  addToCart: upsertCartItem,

  updateCartItem: upsertCartItem,

  removeFromCart: (productId: string): Promise<Cart> =>
    api.delete(`${BASE}/items/${productId}`).then((r) => r.data),
};
