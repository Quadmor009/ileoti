import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../../components/card/ProductCard";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/navbar/Navbar";
import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import Topbar from "../top-bar/Topbar";
import { authService } from "../../../services/auth.service";
import { wishlistService } from "../../../services/wishlist.service";
import { orderService } from "../../../services/order.service";
import { getMembershipStatus } from "../../../services/membership.service";
import { useAuthStore } from "../../../store/auth.store";
import type { Order, WishlistItem } from "../../../types";
import { routes } from "../../../shared/routes/routes";
import GetExclusiveAccessModal from "../../../components/get-exclusive-access-modal/GetExclusiveAccessModal";

const ACTIVE_STATUSES = new Set([
  "SUBMITTED",
  "CONFIRMED",
  "AWAITING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "ON_ITS_WAY",
  "OUT_FOR_DELIVERY",
  "PENDING",
]);

type CardProduct = {
  id: string;
  name: string;
  price: number | string;
  discountedPrice?: number | string | null;
  images?: { url: string; isPrimary: boolean }[];
  category?: { name: string };
  stockStatus?: string;
};

function productsFromWishlistAndOrders(items: WishlistItem[], orders: Order[]): CardProduct[] {
  const map = new Map<string, CardProduct>();
  for (const row of items) {
    const p = row.product;
    if (!map.has(p.id)) {
      map.set(p.id, {
        id: p.id,
        name: p.name,
        price: p.price,
        discountedPrice: p.discountedPrice,
        images: p.images,
        stockStatus: p.stockStatus,
      });
    }
  }
  for (const order of orders) {
    for (const line of order.items) {
      const id = line.product?.id ?? line.productId;
      if (map.has(id)) continue;
      const name = line.product?.name ?? line.productName;
      map.set(id, {
        id,
        name,
        price: line.unitPrice,
        images: line.product?.images,
        stockStatus: "IN_STOCK",
      });
    }
  }
  return Array.from(map.values()).slice(0, 12);
}

const Dashboard = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isLoggedIn = Boolean(accessToken);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
    enabled: isLoggedIn,
  });

  const { data: membership } = useQuery({
    queryKey: ["membership-status"],
    queryFn: getMembershipStatus,
    enabled: isLoggedIn,
  });

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: isLoggedIn,
  });

  const { data: ordersPage } = useQuery({
    queryKey: ["orders", "dashboard"],
    queryFn: () => orderService.listOrders(1, 50),
    enabled: isLoggedIn,
  });

  const p = profile as
    | { firstName?: string | null; lastName?: string | null; membershipStatus?: string | null }
    | undefined;
  const firstName = p?.firstName?.trim();
  const displayName =
    [p?.firstName, p?.lastName].filter(Boolean).join(" ").trim() ||
    (firstName ? firstName : "there");

  const subscriptionActive =
    membership &&
    typeof membership === "object" &&
    "status" in membership &&
    (membership as { status?: string }).status === "ACTIVE";
  const planName =
    subscriptionActive &&
    membership &&
    typeof membership === "object" &&
    "plan" in membership &&
    (membership as { plan?: { name?: string } | null }).plan?.name;

  const membershipLabel = planName
    ? planName
    : subscriptionActive
      ? "Premium member"
      : (p?.membershipStatus && String(p.membershipStatus).trim()) || "Shopper";

  const orders = ordersPage?.data ?? [];
  const activeOrderCount = orders.filter((o) => ACTIVE_STATUSES.has(o.status)).length;

  const forYouProducts = useMemo(
    () => productsFromWishlistAndOrders(wishlist?.items ?? [], orders),
    [wishlist?.items, orders],
  );

  return (
    <div>
      <Navbar />
      <div className="max-w-[1200px] mx-auto py-10 px-4 sm:px-6">
        <Topbar />

        <header className="mt-2 mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
            Welcome back{displayName ? `, ${displayName}` : ""}
          </h1>
          <p className="text-[#585858] mt-2 max-w-2xl text-base leading-relaxed">
            Your home for membership, tastings we announce, and bottles you have saved or ordered.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <span className="inline-flex items-center rounded-full border border-[#E8E8E8] bg-[#FAFAFA] px-4 py-2 text-sm text-[#333]">
              <span className="text-[#707070] mr-2">Membership</span>
              <span className="font-semibold text-[#80011D] capitalize">{membershipLabel}</span>
            </span>
            {!subscriptionActive ? (
              <button
                type="button"
                className="text-sm font-semibold text-[#80011D] underline underline-offset-2"
                onClick={() => setMembershipModalOpen(true)}
              >
                Explore membership
              </button>
            ) : null}
            <Link
              to={routes.orders}
              className="text-sm font-semibold text-[#585858] hover:text-[#80011D] underline underline-offset-2"
            >
              View orders{activeOrderCount ? ` (${activeOrderCount} active)` : ""}
            </Link>
          </div>
        </header>

        <section className="border border-[#E8E8E8] rounded-3xl p-6 sm:p-8 bg-white mb-10">
          <div className="flex items-start gap-3 mb-2">
            <img src={ImagesAndIcons.wineNdGleass} alt="" className="shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-xl sm:text-2xl text-black">Events & experiences</h2>
              <p className="text-[#585858] text-sm sm:text-base mt-1">
                When our team publishes tastings, dinners, or private experiences, they will appear here.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#FAFAFA] border border-dashed border-[#E0E0E0] px-6 py-12 text-center mt-6">
            <p className="text-[#585858] max-w-md mx-auto text-sm sm:text-base">
              There are no upcoming events listed yet. You can still plan a corporate or bulk experience with us.
            </p>
            <Link
              to={routes.bookEvent}
              className="inline-flex mt-5 text-sm font-semibold text-[#80011D] underline underline-offset-2"
            >
              Book an event
            </Link>
          </div>
        </section>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-black">Products you have engaged with</h2>
              <p className="text-[#585858] text-sm mt-1">
                From your wishlist and recent orders — jump back in where you left off.
              </p>
            </div>
            <Link
              to={routes.products}
              className="text-sm font-semibold text-[#80011D] shrink-0 underline underline-offset-2"
            >
              Browse all products
            </Link>
          </div>
          {forYouProducts.length === 0 ? (
            <div className="rounded-2xl border border-[#EEEEEE] bg-[#FAFAFA] px-6 py-14 text-center">
              <p className="text-[#585858] max-w-md mx-auto">
                Save items to your favourites or place an order to build this row. It updates automatically.
              </p>
              <Link
                to={routes.products}
                className="inline-flex mt-5 rounded-full bg-[#80011D] text-white text-sm font-semibold px-6 py-3 hover:bg-[#6B011A] transition-colors"
              >
                Discover products
              </Link>
            </div>
          ) : (
            <div className="flex items-stretch gap-6 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
              {forYouProducts.map((product) => (
                <div key={product.id} className="shrink-0 w-[min(88vw,260px)] sm:w-56 flex h-full min-h-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
      <GetExclusiveAccessModal
        open={membershipModalOpen}
        onClose={() => setMembershipModalOpen(false)}
        hideDefaultJoinButton
      />
    </div>
  );
};

export default Dashboard;
