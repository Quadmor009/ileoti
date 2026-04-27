import { Rate, message } from "antd";
import type { MouseEvent } from "react";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
  const user = useAuthStore((s) => s.user);
  const setCart = useCartStore((s) => s.setCart);
  const addGuestItem = useCartStore((s) => s.addGuestItem);
  const removeGuestItem = useCartStore((s) => s.removeGuestItem);
  const isLoggedIn = Boolean(user);
  const [wishlisted, setWishlisted] = useState(false);
  const [giftBoxOpen, setGiftBoxOpen] = useState(false);
  const [personalMessageOpen, setPersonalMessageOpen] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [quantity, setQuantity] = useState(0);

  const id = product.id;
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
    navigate(`${routes.products}/${id}`);
  };

  const addToCartMutation = useMutation({
    mutationFn: (nextQuantity: number) => cartService.addToCart(id, nextQuantity),
    onSuccess: (cart, nextQuantity) => {
      setCart(cart);
      setQuantity(nextQuantity);
    },
    onError: () => {
      void message.error('Could not add to cart');
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
      setWishlisted((prev) => !prev);
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
      className="cursor-pointer border border-transparent lg:hover:border-[#80011D] lg:hover:bg-[#F4EEEE] p-2 rounded-3xl transition-all duration-300 ease-in-out"
    >
      <div className="lg:w-[246px] lg:h-[306px] w-40 h-49 mb-3 rounded-2xl overflow-hidden relative">
        {hasImage ? (
          <div
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            className="w-full h-full"
          >
            <div className="p-2 flex items-center justify-end">
              <button onClick={handleWishlistClick}>
                <img
                  src={ImagesAndIcons.lovelyRed}
                  alt=""
                  className={wishlisted ? "opacity-100" : "opacity-60"}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-[#8B0000] text-white flex items-center justify-center text-2xl font-semibold">
            <span>{firstLetters}</span>
          </div>
        )}
        {!hasImage && (
          <div className="absolute top-2 right-2">
            <button onClick={handleWishlistClick}>
              <img
                src={ImagesAndIcons.lovelyRed}
                alt=""
                className={wishlisted ? "opacity-100" : "opacity-60"}
              />
            </button>
          </div>
        )}
      </div>
      <p className="text-sm lg:text-xl mb-0.5 font-medium text-black">{name}</p>
      <p className="text-[10px] lg:text-xs mb-0.5 text-[#585858] font-medium">
        {product.category?.name ?? "—"}
      </p>
      <div className="mb-0.5 flex items-center gap-2">
        <Rate disabled value={avgRating} allowHalf />
        <p className="text-[10px] lg:text-xs text-[#585858] font-medium">
          {product.reviews?.length ?? 0} Reviews
        </p>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-sm lg:text-xl font-medium text-black">{formatNGN(sellingPrice)}</p>
      </div>
      <div className="flex items-center gap-2 w-full">
        {quantity === 0 ? (
          <button
            onClick={(e) => void handleAddToCartClick(e, 1)}
            className="flex-1 h-14 text-base text-white bg-primary rounded-[56px] px-6"
            disabled={addToCartMutation.isPending}
          >
            Add To Cart
          </button>
        ) : (
          <div
            className="flex-1 h-14 rounded-[56px] border border-[#80011D] flex items-center justify-center gap-10"
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
          onClick={handleGiftBoxClick}
          className="shrink-0 lg:h-12 h-8 w-8 lg:w-12 rounded-full flex justify-center items-center border border-[#80011D]"
        >
          <img src={ImagesAndIcons.giftBox} alt="" />
        </button>
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
            onSubmitMessage={(msg) => setGiftMessage(msg)}
          />
        </>
      ) : null}
    </div>
  );
};

export default ProductCard;
