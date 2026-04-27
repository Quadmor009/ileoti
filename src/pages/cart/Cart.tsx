import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/btns/Button";
import ProductCardCart from "../../components/card/ProductCardCart";
import Footer from "../../components/footer/Footer";
import CustomInput from "../../components/input/CustomInput";
import Navbar from "../../components/navbar/Navbar";
import { cartService } from "../../services/cart.service";
import { discountService } from "../../services/discount.service";
import { wishlistService } from "../../services/wishlist.service";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import { effectivePrice, formatNGN, primaryImage } from "../../lib/format";
import { getApiErrorMessage } from "../../lib/api-error";
import { routes } from "../../shared/routes/routes";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";

const Cart = () => {
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));
  const navigate = useNavigate();
  const qc = useQueryClient();
  const setCart = useCartStore((s) => s.setCart);
  const guestItems = useCartStore((s) => s.guestItems);
  const removeGuestItem = useCartStore((s) => s.removeGuestItem);
  const updateGuestItem = useCartStore((s) => s.updateGuestItem);
  const [discountCode, setDiscountCode] = useState("");
  const [discountResult, setDiscountResult] = useState<{
    code: string;
    discountType: string;
    value: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState("");

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
    if (cart) {
      setCart(cart);
    }
  }, [cart, setCart]);

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateCartItem(productId, quantity),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => void message.error("Could not update cart"),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => void message.error("Could not remove item"),
  });

  const normalizedGuestItems = guestItems.map((item) => ({
    id: `guest-${item.productId}`,
    cartId: "guest-cart",
    productId: item.productId,
    quantity: item.quantity,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    product: {
      id: item.productId,
      name: item.name,
      slug: item.name.toLowerCase().replace(/\s+/g, "-"),
      price: item.price,
      discountedPrice: null,
      discountStart: null,
      discountEnd: null,
      stockStatus: "IN_STOCK" as const,
      stockQuantity: 999,
      allowBackorders: true,
      images: item.image
        ? [{ id: `guest-image-${item.productId}`, url: item.image, isPrimary: true, sortOrder: 0 }]
        : [],
    },
  }));
  const cartItems = isAuthenticated ? cart?.items ?? [] : normalizedGuestItems;
  const subtotal = isAuthenticated
    ? (cart?.items ?? []).reduce(
        (sum, item) => sum + effectivePrice(item.product) * item.quantity,
        0,
      )
    : guestItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = 0;
  const apiTotal = subtotal;

  const validateDiscountMutation = useMutation({
    mutationFn: () => discountService.validateCode(discountCode, subtotal),
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

  let discountAmount = 0;
  if (discountResult) {
    discountAmount =
      discountResult.discountType === "PERCENTAGE"
        ? (subtotal * discountResult.value) / 100
        : Math.min(Number(discountResult.value), subtotal);
  }

  const total = useMemo(
    () => apiTotal + shipping + tax - discountAmount,
    [apiTotal, shipping, tax, discountAmount],
  );

  return (
    <section>
      <Navbar />
      <div className="max-w-300 w-[90%] flex flex-col lg:flex-row mx-auto gap-12 pt-12 pb-20">
        <div className="w-full lg:w-180 flex-col flex gap-6">
          <h4 className="text-3xl font-bold">Cart</h4>

          {isAuthenticated && isLoading && (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-3xl bg-[#F4EEEE] animate-pulse" />
              ))}
            </div>
          )}
          {isAuthenticated && isError && <p className="text-red-600">Failed to load cart</p>}
          {(!isAuthenticated || (!isLoading && !isError)) && cartItems.length === 0 && (
            <p className="text-[#585858]">Your cart is empty.</p>
          )}
          {cartItems.map((item) => (
            <div key={item.id}>
              <ProductCardCart
                item={item}
                onRemove={(productId) => {
                  if (isAuthenticated) {
                    removeMutation.mutate(productId);
                  } else {
                    removeGuestItem(productId);
                  }
                }}
                onUpdateQuantity={(productId, quantity) =>
                  isAuthenticated
                    ? updateMutation.mutate({ productId, quantity })
                    : updateGuestItem(productId, quantity)
                }
              />
              <div className="w-full border mt-6 border-[#D8D8D8]" />
            </div>
          ))}
        </div>

        <div className="w-full lg:w-115">
          <h4 className="text-3xl font-bold">Summary</h4>
          <div className="flex flex-col gap-2 mt-8">
            <div className="flex justify-between gap-4">
              <p className="text-base lg:text-xl font-bold text-black">Subtotal</p>
              <p className="text-2xl font-normal text-black tabular-nums">{formatNGN(subtotal)}</p>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between">
                <p className="text-base lg:text-xl font-bold text-primary">
                  Discount ({discountResult?.code})
                </p>
                <p className="text-2xl font-normal text-primary">-{formatNGN(discountAmount)}</p>
              </div>
            )}
            <div className="flex justify-between items-baseline gap-4">
              <p className="text-base lg:text-xl font-normal text-[#585858]">Estimated Shipping</p>
              <p className="text-lg sm:text-2xl font-normal text-[#585858] tabular-nums">{formatNGN(shipping)}</p>
            </div>
            <div className="flex justify-between items-baseline gap-4">
              <p className="text-base lg:text-xl font-normal text-[#585858]">Estimated Tax</p>
              <p className="text-lg sm:text-2xl font-normal text-[#585858] tabular-nums">{formatNGN(tax)}</p>
            </div>
          </div>
          <div className="flex justify-between border-y-2 mb-6 mt-4 border-[#F0F0F0] py-4 gap-4">
            <p className="text-base lg:text-xl font-bold text-black">Total</p>
            <p className="text-2xl font-semibold text-black tabular-nums">{formatNGN(total)}</p>
          </div>

          <CustomInput
            label="Discount Code"
            placeholder="XXXXXXXXXX"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          {discountError && <p className="text-red-600 text-sm mt-1">{discountError}</p>}
          <Button
            type="red"
            label="Apply"
            className="font-semibold rounded-[55px] py-6 text-xl mt-6"
            handleClick={() => {
              if (discountCode.trim()) {
                validateDiscountMutation.mutate();
              }
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
      {(wishlist?.items ?? []).length > 0 && (
        <div id="favourites-section" className="max-w-300 w-[90%] mx-auto pb-12 scroll-mt-24">
          <h4 className="text-2xl font-bold mb-6">Favourites</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlist?.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-center border border-[#E8E8E8] rounded-2xl p-4"
              >
                <img
                  className="w-16 h-16 rounded-xl object-cover"
                  src={primaryImage(item.product.images, ImagesAndIcons.furasgnBottle)}
                  alt={item.product.name}
                />
                <div className="flex-1">
                  <p className="font-bold">{item.product.name}</p>
                  <p className="text-[#585858] text-sm">{formatNGN(effectivePrice(item.product))}</p>
                </div>
                <button
                  type="button"
                  className="h-10 rounded-full bg-primary px-4 text-xs text-white"
                  onClick={() => {
                    void cartService
                      .addToCart(item.productId, 1)
                      .then((cart) => {
                        setCart(cart);
                        void qc.invalidateQueries({ queryKey: ["cart"] });
                        void message.success("Added to cart");
                      })
                      .catch((e) => void message.error(getApiErrorMessage(e)));
                  }}
                >
                  Add To Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </section>
  );
};

export default Cart;
