import { HeartOutlined } from "@ant-design/icons";
import { Popover, message, Spin } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import { wishlistService } from "../../../services/wishlist.service";
import { cartService } from "../../../services/cart.service";
import { getApiErrorMessage } from "../../../lib/api-error";
import { formatNGN, primaryImage, effectivePrice } from "../../../lib/format";
import { useAuthStore } from "../../../store/auth.store";
import { useLoginModalStore } from "../../../store/login-modal.store";
import { routes } from "../../../shared/routes/routes";
import { useCartStore } from "../../../store/cart.store";

const FavouritesDropDown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isLoggedIn = useAuthStore((s) => Boolean(s.accessToken));
  const requestLogin = useLoginModalStore((s) => s.requestLogin);
  const setCart = useCartStore((s) => s.setCart);

  const { data: wishlist, isLoading, isError } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: isLoggedIn && open,
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.toggleWishlist(productId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (e) => void message.error(getApiErrorMessage(e)),
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => cartService.addToCart(productId, 1),
    onSuccess: (cart) => {
      setCart(cart);
      void qc.invalidateQueries({ queryKey: ["cart"] });
      void message.success("Added to cart");
    },
    onError: (e) => void message.error(getApiErrorMessage(e)),
  });

  const items = wishlist?.items ?? [];

  return (
    <Popover
      content={
        <div className="w-[22rem] max-w-[92vw] pt-6 lato border border-[#D9D9D9] bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex px-6 items-center justify-between">
            <p className="text-xl font-bold">Favourites</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1"
              aria-label="Close"
            >
              <img src={ImagesAndIcons.xIcon} alt="" />
            </button>
          </div>
          <div className="flex px-6 flex-col gap-0 mt-4 max-h-72 overflow-y-auto min-h-[80px]">
            {isLoading && (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            )}
            {isError && (
              <p className="text-sm text-red-600 text-center py-4">Could not load favourites</p>
            )}
            {!isLoading && !isError && isLoggedIn && items.length === 0 && (
              <p className="text-[#585858] text-sm text-center py-6">No saved favourites yet</p>
            )}
            {!isLoading &&
              !isError &&
              isLoggedIn &&
              items.map((row) => {
                const p = row.product;
                const img = primaryImage(p.images, ImagesAndIcons.furasgnBottle);
                const price = effectivePrice(p);
                return (
                  <div
                    key={row.id}
                    className="flex items-start gap-3 border-b border-[#F0F0F0] py-3 last:border-0"
                  >
                    <img
                      className="w-14 h-16 rounded-lg object-cover shrink-0"
                      src={img}
                      alt={p.name}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-black line-clamp-2 leading-snug">
                        {p.name}
                      </h4>
                      <p className="text-xs text-[#9B9B9B] mt-0.5">{formatNGN(price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          className="text-xs font-semibold text-[#80011D] underline"
                          disabled={addToCartMutation.isPending}
                          onClick={() => addToCartMutation.mutate(p.id)}
                        >
                          Add to cart
                        </button>
                        <button
                          type="button"
                          className="p-1 opacity-70 hover:opacity-100"
                          aria-label="Remove from favourites"
                          disabled={removeMutation.isPending}
                          onClick={() => removeMutation.mutate(p.id)}
                        >
                          <img src={ImagesAndIcons.trashSm} alt="" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            {!isLoading && !isLoggedIn && (
              <p className="text-sm text-[#585858] text-center py-6">
                Sign in to see your favourites
              </p>
            )}
          </div>
          <div className="border-t border-[#E8E8E8] bg-white px-6 py-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                if (isLoggedIn) {
                  navigate(`${routes.cart}#favourites-section`);
                } else {
                  requestLogin();
                }
              }}
              className="w-full py-3 bg-[#80011D] text-white rounded-[55px] text-base font-semibold hover:bg-[#6B0000] transition-colors"
            >
              {isLoggedIn ? "View saved items on cart" : "Log in to continue"}
            </button>
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(routes.products);
                }}
                className="text-primary font-semibold text-sm underline text-center w-full"
              >
                Browse products
              </button>
            )}
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
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#80011D] text-white shadow-sm transition-colors hover:bg-[#6B011A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Favourites"
      >
        <HeartOutlined className="text-[1.35rem] text-white" />
      </button>
    </Popover>
  );
};

export default FavouritesDropDown;
