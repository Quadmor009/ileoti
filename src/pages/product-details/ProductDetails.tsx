import { Rate, message } from "antd";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Button from "../../components/btns/Button";
import Lovelyred from "../../assets/icons/lovelyred";
import { useEffect, useMemo, useState } from "react";
import RightHandSideProductDetail from "./component/RightHand";
import ProductCard from "../../components/card/ProductCard";
import RefundPolicy from "./component/RefundPolicy";
import ReviewsModal from "./component/ReviewsModal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../services/product.service";
import { cartService } from "../../services/cart.service";
import { wishlistService } from "../../services/wishlist.service";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import { effectivePrice, formatDate, formatNGN, primaryImage } from "../../lib/format";
import { getApiErrorMessage } from "../../lib/api-error";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import GiftBoxModal from "../../components/gift-box-modal/GiftboxModal";
import PersonalMessageModal from "../../components/gift-box-modal/PersonalMessageModal";
import { useLoginModalStore } from "../../store/login-modal.store";
import { routes } from "../../shared/routes/routes";

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [giftBoxOpen, setGiftBoxOpen] = useState(false);
  const [personalMessageOpen, setPersonalMessageOpen] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));
  const setCart = useCartStore((s) => s.setCart);
  const addGuestItem = useCartStore((s) => s.addGuestItem);
  const guestItems = useCartStore((s) => s.guestItems);
  const updateGuestItem = useCartStore((s) => s.updateGuestItem);
  const removeGuestItem = useCartStore((s) => s.removeGuestItem);
  const requestLogin = useLoginModalStore((s) => s.requestLogin);
  const qc = useQueryClient();

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProduct(id!),
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => productService.getReviews(id!),
    enabled: !!id,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["related-products", product?.categoryId],
    queryFn: () =>
      productService.getProducts({ categoryId: product!.categoryId, limit: 3 }),
    enabled: !!product?.categoryId,
  });

  const reviews = reviewsData?.data ?? [];
  const relatedProducts = relatedData?.data?.filter((p) => p.id !== id).slice(0, 3) ?? [];
  const sellPrice = product ? effectivePrice(product) : 0;

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });

  const lineQty = useMemo(() => {
    if (!id) return 0;
    if (!isAuthenticated) {
      return guestItems.find((i) => i.productId === id)?.quantity ?? 0;
    }
    const line = cartData?.items?.find((i) => i.productId === id);
    return line?.quantity ?? 0;
  }, [id, isAuthenticated, guestItems, cartData]);

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) =>
      cartService.addToCart(productId, qty),
    onSuccess: (cart) => {
      setCart(cart);
      void message.success("Added to cart");
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e) => void message.error(getApiErrorMessage(e)),
  });

  const updateLineMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) =>
      cartService.updateCartItem(productId, qty),
    onSuccess: (cart) => {
      setCart(cart);
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e) => void message.error(getApiErrorMessage(e)),
  });

  const removeLineMutation = useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: (cart) => {
      setCart(cart);
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e) => void message.error(getApiErrorMessage(e)),
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: () => wishlistService.toggleWishlist(id!),
    onSuccess: () => {
      setWishlisted((prev) => !prev);
      void qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (e) => void message.error(getApiErrorMessage(e)),
  });

  const bumpCart = (delta: number) => {
    if (!id) return;
    const next = lineQty + delta;
    if (!isAuthenticated) {
      if (next <= 0) {
        removeGuestItem(id);
      } else {
        updateGuestItem(id, next);
      }
      return;
    }
    if (next <= 0) {
      removeLineMutation.mutate(id);
    } else {
      updateLineMutation.mutate({ productId: id, qty: next });
    }
  };

  const handleAddToCart = () => {
    if (!product || !id) return;
    if (!isAuthenticated) {
      addGuestItem({
        productId: id,
        name: product.name,
        price: sellPrice,
        image: primaryImage(product.images, ImagesAndIcons.furasgnBottle),
        quantity,
        category: product.category?.name,
      });
      void message.success("Added to cart");
      return;
    }
    addToCartMutation.mutate({ productId: id, qty: quantity });
  };

  const handleBuyNow = () => {
    if (!product || !id) return;
    if (!isAuthenticated) {
      if (lineQty === 0) {
        addGuestItem({
          productId: id,
          name: product.name,
          price: sellPrice,
          image: primaryImage(product.images, ImagesAndIcons.furasgnBottle),
          quantity,
          category: product.category?.name,
        });
      }
      navigate(routes.cart);
      return;
    }
    if (lineQty === 0) {
      addToCartMutation.mutate(
        { productId: id, qty: quantity },
        {
          onSuccess: (cart) => {
            setCart(cart);
            void qc.invalidateQueries({ queryKey: ["cart"] });
            navigate(routes.cart);
          },
        },
      );
    } else {
      navigate(routes.cart);
    }
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      requestLogin();
      return;
    }
    toggleWishlistMutation.mutate();
  };

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + Number(review.rating ?? 0), 0);
    return total / reviews.length;
  }, [reviews]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-[1200px] mx-auto py-20 flex justify-center">
          <div className="w-full h-96 rounded-3xl bg-[#F4EEEE] animate-pulse" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div>
        <Navbar />
        <div className="max-w-[1200px] mx-auto py-20 text-center text-red-600">
          Failed to load product.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-[1200px] mx-auto">
        <nav className="text-base text-[#585858] font-normal mt-10" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <li>
              <Link to={routes.home} className="hover:text-[#80011D] underline-offset-2 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-[#C4C4C4]">
              ›
            </li>
            <li>
              <Link to={routes.products} className="hover:text-[#80011D] underline-offset-2 hover:underline">
                Products
              </Link>
            </li>
            <li aria-hidden className="text-[#C4C4C4]">
              ›
            </li>
            <li className="text-[#8B0000] font-medium truncate max-w-[min(100%,28rem)]" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>
        <div className="py-9 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            {product.images?.length ? (
              <RightHandSideProductDetail
                images={product.images}
                primaryImage={primaryImage(product.images, ImagesAndIcons.furasgnBottle)}
              />
            ) : (
              <div className="flex h-166 w-[90%] mx-auto lg:w-full rounded-3xl items-center justify-center bg-[#8B0000] text-white text-4xl font-semibold">
                {product.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <p className="hidden lg:block text-3xl text-black font-bold mt-9 mb-6">
              You may also like
            </p>
            <div className="hidden lg:flex flex-col gap-6">
              {relatedProducts.length === 0 ? (
                <p className="text-[#585858]">No related products available.</p>
              ) : (
                relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-4 items-center cursor-pointer"
                    onClick={() => navigate(`/products/${p.id}`)}
                  >
                    <img
                      className="w-55 h-55 rounded-3xl"
                      src={primaryImage(p.images, ImagesAndIcons.furasgnBottle)}
                      alt={p.name}
                    />
                    <div className="flex-1">
                      <p className="text-xl font-bold">{p.name}</p>
                      <p className="text-[#585858]">{p.category?.name}</p>
                      <p className="font-semibold">{formatNGN(effectivePrice(p))}</p>
                      <button
                        type="button"
                        className="mt-3 h-10 rounded-full bg-primary px-5 text-sm text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isAuthenticated) {
                            addGuestItem({
                              productId: p.id,
                              name: p.name,
                              price: Number(p.discountedPrice ?? p.price),
                              image: primaryImage(p.images, ImagesAndIcons.furasgnBottle),
                              quantity: 1,
                              category: p.category?.name,
                            });
                            void message.success("Added to cart");
                            return;
                          }
                          addToCartMutation.mutate({ productId: p.id, qty: 1 });
                        }}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-8 hidden lg:block">
              <Button type="lightRed" label="View More" />
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="w-[90%] mx-auto lg:max-w-125">
            <div className="flex items-start justify-between">
              <h2 className="text-[40px] leading-12 font-bold max-w-107 text-gray-900">
                {product.name}
              </h2>
              <button type="button" onClick={handleToggleWishlist}>
                <Lovelyred
                  width="56"
                  height="56"
                  rx="28"
                  fill={wishlisted ? "#80011D" : "none"}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Rate disabled value={averageRating} allowHalf />
              <span className="text-gray-600 text-sm">({reviewsData?.total ?? 0})</span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <p className="text-3xl font-semibold text-black">{formatNGN(sellPrice)}</p>
              {product.discountedPrice != null && (
                <p className="text-xl font-normal text-[#585858] line-through">
                  {formatNGN(product.price)}
                </p>
              )}
            </div>
            <p className="text-[#585858] text-xl font-normal mt-1">
              Product Category: {product.category?.name ?? "—"}
            </p>

            {/* Quantity + cart actions */}
            {lineQty === 0 ? (
              <>
                <div className="mt-9 flex items-center justify-between">
                  <p className="font-normal text-2xl text-[#585858]">Quantity</p>
                  <div className="bg-[#F4EEEE] rounded-[55px] px-4 py-2 flex gap-2 font-semibold text-2xl w-40">
                    <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                      -
                    </button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => setQuantity((q) => q + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <Button
                  type="red"
                  label="Buy Now"
                  className="py-6 mt-9 text-base rounded-[55px]"
                  handleClick={handleBuyNow}
                />
                <div className="mt-4 flex gap-4">
                  <Button
                    type="outlineRed"
                    className="py-6"
                    label={addToCartMutation.isPending ? "Adding…" : "Add To Cart"}
                    handleClick={handleAddToCart}
                  />
                  <Button
                    type="outlineRed"
                    className="py-6"
                    label="Create Gift Box"
                    handleClick={() => setGiftBoxOpen(true)}
                  />
                </div>
              </>
            ) : (
              <div className="mt-9 space-y-6">
                <div className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] px-4 py-5 sm:px-6 sm:py-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#80011D] mb-1">
                    In your cart
                  </p>
                  <p className="text-base text-[#585858] mb-4">Adjust quantity or continue to checkout.</p>
                  <div
                    className="max-w-md w-full min-h-[52px] sm:min-h-14 rounded-[56px] border border-[#80011D] bg-white flex items-center justify-center gap-8 sm:gap-12 shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="text-2xl font-medium w-12 h-12 rounded-full hover:bg-[#FFF5F5] disabled:opacity-40 transition-colors"
                      onClick={() => bumpCart(-1)}
                      disabled={updateLineMutation.isPending || removeLineMutation.isPending}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="text-xl font-semibold min-w-[2.5rem] text-center tabular-nums">{lineQty}</span>
                    <button
                      type="button"
                      className="text-2xl font-medium w-12 h-12 rounded-full hover:bg-[#FFF5F5] disabled:opacity-40 transition-colors"
                      onClick={() => bumpCart(1)}
                      disabled={updateLineMutation.isPending || removeLineMutation.isPending}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="red"
                    label="Buy now"
                    className="py-6 text-base rounded-[55px]"
                    handleClick={handleBuyNow}
                  />
                  <Button
                    type="outlineRed"
                    className="py-6"
                    label="Create gift box"
                    handleClick={() => setGiftBoxOpen(true)}
                  />
                </div>
              </div>
            )}

            {/* Mobile: You May Also Like */}
            <div className="flex-col lg:hidden">
              <p className="font-bold text-base mt-6 text-black">You May Also Like</p>
              <div className="flex gap-4 overflow-x-auto items-stretch">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="shrink-0 w-[min(88vw,300px)] sm:w-56 lg:w-[246px] flex h-full min-h-0"
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">Description</h3>
              {product.description ? (
                <p className="bg-[#F4EEEE] rounded-2xl p-6 mt-2 text-xl font-normal text-[#726868]">
                  {product.description}
                </p>
              ) : (
                <p className="text-[#585858] font-bold text-base">—</p>
              )}
            </div>
            <div className="mt-8">
              <Button
                handleClick={() => setIsModalOpen(true)}
                type="lightRed"
                label="Refund Policy"
              />
            </div>

            {/* Reviews */}
            <h4 className="font-bold text-2xl mt-8 mb-4 text-black">
              Reviews ({reviewsData?.total ?? 0})
            </h4>
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="border-b border-[#F0F0F0] mt-4 pb-4">
                <p className="text-2xl font-bold text-black">
                  {review.user?.firstName ?? review.user?.email ?? "User"}
                </p>
                <div className="flex items-center gap-2">
                  <Rate disabled defaultValue={review.rating} />
                  <p className="text-[#585858] text-base font-medium">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <p className="font-medium text-xl text-black">{review.body}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-[#585858]">No reviews yet.</p>
            )}
            <div className="mt-8 flex gap-4">
              {(reviewsData?.total ?? 0) > 3 && (
                <Button
                  handleClick={() => {
                    setOpen(true);
                  }}
                  type="lightRed"
                  label="Read More Reviews"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <RefundPolicy isModalOpen={isModalOpen} handleCancel={() => setIsModalOpen(false)} />
      <ReviewsModal open={open} handleCancel={() => setOpen(false)} />
      <GiftBoxModal
        open={giftBoxOpen}
        setOpen={setGiftBoxOpen}
        handleAddPersonalMessage={() => setPersonalMessageOpen(true)}
        personalMessage={giftMessage}
        initialProduct={{
          productId: product.id,
          name: product.name,
          category: product.category?.name ?? "—",
          price: sellPrice,
          image: primaryImage(product.images, ImagesAndIcons.furasgnBottle),
        }}
      />
      <PersonalMessageModal
        open={personalMessageOpen}
        setOpen={setPersonalMessageOpen}
        initialDraft={giftMessage}
        onSubmitMessage={(msg) => setGiftMessage(msg)}
      />
    </div>
  );
}
