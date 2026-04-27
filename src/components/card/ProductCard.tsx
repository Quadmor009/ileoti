import { Rate, message } from "antd";
import type { MouseEvent } from "react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/routes/routes";
import { formatNGN, primaryImage } from "../../lib/format";
import { useAuthStore } from "../../store/auth.store";
import { cartService } from "../../services/cart.service";
import { useCartStore } from "../../store/cart.store";
import { getApiErrorMessage } from "../../lib/api-error";
import { wishlistService } from "../../services/wishlist.service";
import GiftBoxModal from "../gift-box-modal/GiftboxModal";
import PersonalMessageModal from "../gift-box-modal/PersonalMessageModal";

interface Product {
  id: string;
  name: string;
  price: number | string;
  discountedPrice?: number | string | null;
  images?: { url: string; isPrimary: boolean }[];
  category?: { name: string };
  reviews?: { rating: number }[];
  stockStatus?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const setCart = useCartStore((s) => s.setCart);
  const addGuestItem = useCartStore((s) => s.addGuestItem);
  const removeGuestItem = useCartStore((s) => s.removeGuestItem);
  const isLoggedIn = useAuthStore((s) => Boolean(s.accessToken));
  const id = product.id;
  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: isLoggedIn,
    staleTime: 20_000,
  });
  const wishlisted = useMemo(
    () => Boolean(wishlistData?.items?.some((row) => row.productId === id)),
    [wishlistData, id],
  );
  const [giftBoxOpen, setGiftBoxOpen] = useState(false);
  const [personalMessageOpen, setPersonalMessageOpen] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [quantity, setQuantity] = useState(0);

  const name = product.name;
  const image = primaryImage(product.images, "");
  const hasImage = Boolean(image);
  const firstLetters = name.slice(0, 2).toUpperCase();
  const sellingPrice =
    product.discountedPrice != null ? Number(product.discountedPrice) : Number(product.price);
  const avgRating = useMemo(() => {
    if (!product.reviews?.length) return 0;
    const total = product.reviews.reduce((sum, review) => sum + Number(review.rating ?? 0), 0);
    return total / product.reviews.length;
  }, [product.reviews]);

  const handleCardClick = () => {
    if (giftBoxOpen || personalMessageOpen) {
      return;
    }
    navigate(`${routes.products}/${id}`);
  };

  const addToCartMutation = useMutation({
    mutationFn: (nextQuantity: number) => cartService.addToCart(id, nextQuantity),
    onSuccess: (cart, nextQuantity) => {
      setCart(cart);
      setQuantity(nextQuantity);
      qc.setQueryData(['cart'], cart);
    },
    onError: (e) => {
      void message.error(getApiErrorMessage(e));
    },
  });

  const handleWishlistClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      void message.info("Please log in to use wishlist.");
      return;
    }
    try {
      await wishlistService.toggleWishlist(id);
      void qc.invalidateQueries({ queryKey: ["wishlist"] });
    } catch (error) {
      void message.error(getApiErrorMessage(error));
    }
  };

  const handleGiftBoxClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setGiftBoxOpen(true);
  };

  const handleAddToCartClick = (e: MouseEvent<HTMLButtonElement>, newQuantity: number) => {
    e.stopPropagation();
    if (isLoggedIn) {
      // Logged in: call API
      addToCartMutation.mutate(newQuantity);
    } else {
      // Guest: add to local store
      addGuestItem({
        productId: id,
        name: product.name,
        price: sellingPrice,
        image: image,
        quantity: 1,
        category: product.category?.name,
      });
      setQuantity(newQuantity);
      void message.success('Added to cart');
    }
  };

  const handleDecrement = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const next = Math.max(quantity - 1, 0);
    if (isLoggedIn) {
      if (next === 0) {
        try {
          const cart = await cartService.removeFromCart(id);
          setCart(cart);
          setQuantity(0);
          qc.setQueryData(['cart'], cart);
        } catch {
          void message.error('Could not remove from cart');
        }
      } else {
        addToCartMutation.mutate(next);
      }
    } else {
      if (next === 0) {
        removeGuestItem(id);
      } else {
        useCartStore.getState().updateGuestItem(id, next);
      }
      setQuantity(next);
    }
  };

  const handleIncrement = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const next = quantity + 1;
    if (isLoggedIn) {
      addToCartMutation.mutate(next);
    } else {
      useCartStore.getState().updateGuestItem(id, next);
      setQuantity(next);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="cursor-pointer border border-[#80011D] bg-[#F4EEEE] lg:border-transparent lg:bg-transparent lg:hover:border-[#80011D] lg:hover:bg-[#F4EEEE] flex flex-col h-full w-full min-w-0 max-w-full p-2 sm:p-2.5 rounded-3xl transition-all duration-300 ease-in-out"
    >
      <div className="relative w-full aspect-[246/306] shrink-0 mb-3 rounded-2xl overflow-hidden bg-[#f5f5f5]">
        {hasImage ? (
          <div
            role="img"
            aria-label={name}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="p-2 flex items-center justify-end">
              <button
                type="button"
                onClick={handleWishlistClick}
                aria-pressed={wishlisted}
                aria-label={wishlisted ? "Remove from favourites" : "Add to favourites"}
                className={`relative z-20 rounded-full p-1.5 transition-all duration-200 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  wishlisted
                    ? "bg-[#80011D] ring-2 ring-white"
                    : "bg-black/30 ring-1 ring-white/50 hover:bg-black/45"
                }`}
              >
                <img
                  src={ImagesAndIcons.lovelyRed}
                  alt=""
                  className="h-6 w-6 object-contain brightness-0 invert"
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#8B0000] text-white flex items-center justify-center text-2xl font-semibold">
            <span>{firstLetters}</span>
          </div>
        )}
        {!hasImage && (
          <div className="absolute top-2 right-2 z-20">
            <button
              type="button"
              onClick={handleWishlistClick}
              aria-pressed={wishlisted}
              aria-label={wishlisted ? "Remove from favourites" : "Add to favourites"}
              className={`relative z-20 rounded-full p-1.5 transition-all duration-200 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                wishlisted
                  ? "bg-[#80011D] ring-2 ring-white"
                  : "bg-black/30 ring-1 ring-white/50 hover:bg-black/45"
              }`}
            >
              <img
                src={ImagesAndIcons.lovelyRed}
                alt=""
                className="h-6 w-6 object-contain brightness-0 invert"
              />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 min-h-0 w-full min-w-0">
        <p className="text-sm sm:text-base lg:text-xl mb-0.5 font-medium text-black line-clamp-2 min-h-[2.75rem] sm:min-h-[3.25rem] lg:min-h-[4.25rem] leading-snug">
          {name}
        </p>
        <p className="text-xs sm:text-sm lg:text-xs mb-0.5 text-[#585858] font-medium line-clamp-1 shrink-0">
          {product.category?.name ?? "—"}
        </p>
        {(product.reviews?.length ?? 0) > 0 ? (
          <div className="mb-0.5 flex items-center gap-2 shrink-0">
            <Rate disabled value={avgRating} allowHalf />
            <p className="text-[10px] lg:text-xs text-[#585858] font-medium">
              {product.reviews?.length} Reviews
            </p>
          </div>
        ) : null}
        <div className="flex items-center gap-2 shrink-0">
          <p className="text-sm sm:text-base lg:text-xl font-medium text-black">{formatNGN(sellingPrice)}</p>
        </div>
        <div className="flex-1 min-h-0" aria-hidden />
        <div className="flex items-center gap-2 w-full min-w-0 shrink-0 pt-2">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={(e) => void handleAddToCartClick(e, 1)}
              className="flex-1 min-h-[48px] sm:min-h-14 h-12 sm:h-14 text-sm sm:text-base text-white bg-primary rounded-[56px] px-3 sm:px-6"
              disabled={addToCartMutation.isPending}
            >
              Add to cart
            </button>
          ) : (
            <div
              className="flex-1 min-h-[48px] sm:h-14 rounded-[56px] border border-[#80011D] flex items-center justify-center gap-6 sm:gap-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => void handleDecrement(e)}
                disabled={addToCartMutation.isPending}
              >
                -
              </button>
              <span className="text-sm font-medium">{quantity}</span>
              <button
                type="button"
                onClick={(e) => void handleIncrement(e)}
                disabled={addToCartMutation.isPending}
              >
                +
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleGiftBoxClick}
            className="shrink-0 h-12 w-12 min-w-12 min-h-12 rounded-full flex justify-center items-center border border-[#80011D] bg-white"
            aria-label="Add to gift box"
          >
            <img src={ImagesAndIcons.giftBox} alt="" className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
      {product && id ? (
        <>
          <GiftBoxModal
            open={giftBoxOpen}
            setOpen={setGiftBoxOpen}
            handleAddPersonalMessage={() => setPersonalMessageOpen(true)}
            personalMessage={giftMessage}
            initialProduct={{
              productId: id,
              name: product.name,
              category: product.category?.name ?? "—",
              price: sellingPrice,
              image: hasImage ? image : ImagesAndIcons.furasgnBottle,
            }}
          />
          <PersonalMessageModal
            open={personalMessageOpen}
            setOpen={setPersonalMessageOpen}
            initialDraft={giftMessage}
            onSubmitMessage={(msg) => setGiftMessage(msg)}
          />
        </>
      ) : null}
    </div>
  );
};

export default ProductCard;
