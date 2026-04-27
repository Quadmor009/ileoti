import { Popover } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import { useCartStore } from "../../../store/cart.store";
import { useAuthStore } from "../../../store/auth.store";
import { useLoginModalStore } from "../../../store/login-modal.store";
import { formatNGN, primaryImage } from "../../../lib/format";
import { routes } from "../../../shared/routes/routes";
import { cartService } from "../../../services/cart.service";
import { getApiErrorMessage } from "../../../lib/api-error";
import { message } from "antd";

const CartDropDown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isLoggedIn = useAuthStore((s) => Boolean(s.accessToken));
  const requestLogin = useLoginModalStore((s) => s.requestLogin);
  const setCart = useCartStore((s) => s.setCart);
  const guestItems = useCartStore((s) => s.guestItems);
  const removeGuestItem = useCartStore((s) => s.removeGuestItem);
  const apiItems = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.itemCount);
  const total = useCartStore((s) => s.total);

  const displayItems = isLoggedIn ? apiItems : guestItems;

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (isLoggedIn) {
        return cartService.removeFromCart(productId);
      }
      removeGuestItem(productId);
      return null;
    },
    onSuccess: (cart) => {
      if (cart) {
        setCart(cart);
      }
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e) => void message.error(getApiErrorMessage(e)),
  });

  const handleCheckout = () => {
    setOpen(false);
    if (!isLoggedIn) {
      requestLogin();
      return;
    }
    navigate(routes.checkout);
  };

  const handleViewCart = () => {
    setOpen(false);
    navigate(routes.cart);
  };

  return (
    <Popover
      content={
        <div className="w-96 max-w-[92vw] bg-white border border-[#D9D9D9] lato rounded-3xl overflow-hidden shadow-sm">
          <div className="flex px-6 pt-6 items-center justify-between">
            <p className="text-xl font-bold">Cart ({itemCount})</p>
            <button type="button" onClick={() => setOpen(false)} className="p-1" aria-label="Close">
              <img src={ImagesAndIcons.xIcon} alt="" />
            </button>
          </div>
          <div className="flex px-6 flex-col gap-3 mt-4 max-h-64 overflow-y-auto">
            {displayItems.length === 0 ? (
              <p className="text-[#585858] text-sm py-4 text-center">Your cart is empty</p>
            ) : (
              displayItems.map((item: any) => {
                const productId = item.productId ?? item.product?.id;
                const name = item.name ?? item.product?.name ?? "Product";
                const price = item.price ?? Number(item.product?.price ?? 0);
                const qty = item.quantity ?? 1;
                const image =
                  item.image ??
                  primaryImage(item.product?.images, ImagesAndIcons.furasgnBottle);
                return (
                  <div
                    key={String(productId)}
                    className="flex items-center gap-3 border-b border-[#F0F0F0] pb-3 last:border-0"
                  >
                    {image ? (
                      <img src={image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#8B0000] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1">{name}</p>
                      <p className="text-xs text-[#585858]">Qty: {qty}</p>
                    </div>
                    <p className="text-sm font-semibold shrink-0">{formatNGN(price * qty)}</p>
                    <button
                      type="button"
                      className="p-1.5 text-[#585858] hover:text-[#80011D] shrink-0"
                      aria-label={`Remove ${name}`}
                      disabled={removeMutation.isPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (productId) {
                          removeMutation.mutate(String(productId));
                        }
                      }}
                    >
                      <img src={ImagesAndIcons.trashSm} alt="" className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <div className="border-t border-[#E8E8E8] bg-white px-6 py-5 mt-2 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Total</p>
              <p className="text-base font-semibold">{formatNGN(total)}</p>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3 bg-[#8B0000] text-white rounded-[55px] text-base font-semibold hover:bg-[#6B0000] transition-colors"
            >
              {isLoggedIn ? "Checkout" : "Login to Checkout"}
            </button>
            <button
              type="button"
              onClick={handleViewCart}
              className="text-[#8B0000] font-semibold text-base underline text-center w-full"
            >
              View Cart
            </button>
          </div>
        </div>
      }
      trigger="click"
      placement="bottom"
      open={open}
      onOpenChange={setOpen}
      overlayInnerStyle={{ padding: 0, borderRadius: 24 }}
    >
      <button
        type="button"
        className="relative border border-transparent hover:border-[#80011D] transition-all duration-300 p-0.5 rounded-full"
        aria-label="Open cart"
      >
        <img className="ml-[0.5px]" src={ImagesAndIcons.cartRed} alt="" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8B0000] text-white text-[10px] font-bold leading-[18px] text-center">
            {itemCount}
          </span>
        )}
      </button>
    </Popover>
  );
};

export default CartDropDown;
