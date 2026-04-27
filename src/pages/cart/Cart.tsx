import Button from "../../components/btns/Button";
import ProductCardCart from "../../components/card/ProductCardCart";
import Footer from "../../components/footer/Footer";
import CustomInput from "../../components/input/CustomInput";
import Navbar from "../../components/navbar/Navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../../services/cart.service";
import { wishlistService } from "../../services/wishlist.service";
import { orderService } from "../../services/order.service";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import { effectivePrice, formatNGN, primaryImage } from "../../lib/format";
import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/routes/routes";
import { useState, useEffect } from "react";
import { message } from "antd";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import { useLoginModalStore } from "../../store/login-modal.store";

const Cart = () => {
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));
  const navigate = useNavigate();
  const qc = useQueryClient();
  const setCart = useCartStore((s) => s.setCart);
  const requestLogin = useLoginModalStore((s) => s.requestLogin);
  const [discountCode, setDiscountCode] = useState("");
  const [discountResult, setDiscountResult] = useState<{
    code: string; discountType: string; value: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate(routes.home);
  }, [isAuthenticated, navigate]);

  const { data: cart, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (cart) setCart(cart);
  }, [cart, setCart]);

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateCartItem(productId, quantity),
    onSuccess: (updated) => {
      setCart(updated);
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => void message.error("Could not update cart"),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: (updated) => {
      setCart(updated);
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => void message.error("Could not remove item"),
  });

  const addFromWishlistMutation = useMutation({
    mutationFn: (productId: string) => cartService.addToCart(productId, 1),
    onSuccess: (updated) => {
      setCart(updated);
      void qc.invalidateQueries({ queryKey: ["cart"] });
      void message.success("Added to cart");
    },
    onError: () => void message.error("Could not add item to cart"),
  });

  const validateDiscountMutation = useMutation({
    mutationFn: () => orderService.validateDiscount(discountCode),
    onSuccess: (result) => {
      setDiscountResult(result);
      setDiscountError("");
      void message.success(`Discount code "${result.code}" applied!`);
    },
    onError: () => {
      setDiscountResult(null);
      setDiscountError("Invalid or expired code");
    },
  });

  const cartItems = cart?.items ?? [];

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + effectivePrice(item.product) * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (discountResult) {
    discountAmount =
      discountResult.discountType === "PERCENTAGE"
        ? (subtotal * discountResult.value) / 100
        : Math.min(Number(discountResult.value), subtotal);
  }

  const total = subtotal - discountAmount;

  return (
    <section>
      <Navbar />
      <div className="max-w-300 w-[90%] flex flex-col-reverse lg:flex-row mx-auto gap-12 pt-12 pb-20">
        {/* LEFT — Cart items */}
        <div className="w-full lg:w-180 flex-col flex gap-6">
          <h4 className="text-3xl font-bold">Cart</h4>

          {isLoading && (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-3xl bg-[#F4EEEE] animate-pulse" />
              ))}
            </div>
          )}
          {isError && (
            <p className="text-red-600">Failed to load cart</p>
          )}
          {!isLoading && !isError && cartItems.length === 0 && (
            <p className="text-[#585858]">Your cart is empty.</p>
          )}
          {cartItems.map((item) => (
            <div key={item.id}>
              <ProductCardCart
                item={item}
                onRemove={(productId) => removeMutation.mutate(productId)}
                onUpdateQuantity={(productId, quantity) =>
                  updateMutation.mutate({ productId, quantity })
                }
              />
              <div className="w-full border mt-6 border-[#D8D8D8]" />
            </div>
          ))}

          {/* Favourites */}
          {(wishlist?.items ?? []).length > 0 && (
            <div className="mt-4">
              <h4 className="text-2xl font-bold mb-4">Favourites</h4>
              {wishlist!.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center mb-4">
                  <img
                    className="w-16 h-16 rounded-xl object-cover"
                    src={primaryImage(item.product.images, ImagesAndIcons.furasgnBottle)}
                    alt={item.product.name}
                  />
                  <div className="flex-1">
                    <p className="font-bold">{item.product.name}</p>
                    <p className="text-[#585858] text-sm">
                      {formatNGN(effectivePrice(item.product))}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="h-10 rounded-full bg-primary px-4 text-xs text-white"
                    onClick={() => {
                      if (!isAuthenticated) {
                        requestLogin();
                        return;
                      }
                      addFromWishlistMutation.mutate(item.productId);
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Summary */}
        <div className="w-full lg:w-115">
          <h4 className="text-3xl font-bold">Summary</h4>
          <div className="flex flex-col gap-2 mt-8">
            <div className="flex justify-between">
              <p className="text-base lg:text-xl font-bold text-black">Subtotal</p>
              <p className="text-2xl font-normal text-black">{formatNGN(subtotal)}</p>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between">
                <p className="text-base lg:text-xl font-bold text-primary">
                  Discount ({discountResult?.code})
                </p>
                <p className="text-2xl font-normal text-primary">-{formatNGN(discountAmount)}</p>
              </div>
            )}
            <div className="flex justify-between">
              <p className="text-base lg:text-xl font-bold text-black">Estimated Shipping</p>
              <p className="text-2xl font-normal text-black">N0.00</p>
            </div>
            <div className="flex justify-between">
              <p className="text-base lg:text-xl font-bold text-black">Estimated Tax</p>
              <p className="text-2xl font-normal text-black">N0.00</p>
            </div>
          </div>
          <div className="flex justify-between border-y-2 mb-6 mt-4 border-[#F0F0F0] py-4">
            <p className="text-base lg:text-xl font-bold text-black">Total</p>
            <p className="text-2xl font-normal text-black">{formatNGN(total)}</p>
          </div>

          <CustomInput
            label="Discount Code"
            placeholder="XXXXXXXXXX"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          {discountError && (
            <p className="text-red-600 text-sm mt-1">{discountError}</p>
          )}
          <Button
            type="red"
            label="Send"
            className="font-semibold rounded-[55px] py-6 text-xl mt-6"
            handleClick={() => {
              if (discountCode.trim()) validateDiscountMutation.mutate();
            }}
          />

          <div className="mt-4">
            <Button
              type="red"
              label="Make Payment"
              className="font-semibold rounded-[55px] py-6 text-xl"
              handleClick={() => navigate(routes.checkout)}
            />
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Cart;
