import { orderService } from "./order.service";

export const discountService = {
  validateCode: (code: string, _subtotal: number) => orderService.validateDiscount(code),
};
