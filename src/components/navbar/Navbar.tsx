import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MenuProps } from "antd";
import { Badge, Dropdown, message } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Login from "../../pages/authentication/Login";
import SignUp from "../../pages/authentication/SignUp";
import CartDropDown from "../../pages/cart/component/CartDropDown";
import FavouritesDropDown from "../../pages/cart/component/Favourites";
import { AccountMenuPopover } from "./AccountMenuPopover";
import Search from "../search/Search";
import { useAuthStore } from "../../store/auth.store";
import { cartService } from "../../services/cart.service";
import { useCartStore } from "../../store/cart.store";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
  type NotificationRow,
} from "../../services/notification.service";
import { getApiErrorMessage } from "../../lib/api-error";
import { routes } from "../../shared/routes/routes";
import { productService } from "../../services/product.service";

function initials(
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null,
): string {
  if (!user) {
    return "?";
  }
  const a = user.firstName?.trim()?.[0];
  const b = user.lastName?.trim()?.[0];
  if (a && b) {
    return `${a}${b}`.toUpperCase();
  }
  if (a) {
    return a.toUpperCase();
  }
  const e = user.email?.trim()?.[0];
  return e ? e.toUpperCase() : "?";
}

function formatNotifTime(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const Navbar = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, accessToken } = useAuthStore();
  const isLoggedIn = Boolean(accessToken);
  const setCart = useCartStore((s) => s.setCart);
  const [searchDraft, setSearchDraft] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;
    void (async () => {
      try {
        const cart = await cartService.getCart();
        setCart(cart);
      } catch {
        // avoid noisy navbar errors during page load
      }
    })();
  }, [isLoggedIn, setCart]);

  const { data: notifData } = useQuery({
    queryKey: ["notifications", "nav"],
    queryFn: () => getNotifications(1, 15),
    enabled: isLoggedIn,
    refetchInterval: 60_000,
  });

  const { data: navCategories } = useQuery({
    queryKey: ["categories", "navbar"],
    queryFn: () => productService.getCategories(),
    staleTime: 60_000,
  });

  const productMenuItems: MenuProps["items"] = useMemo(() => {
    const fromApi =
      navCategories?.map((c) => ({
        key: c.id,
        label: c.name,
        onClick: () =>
          navigate(`${routes.products}?categoryId=${encodeURIComponent(c.id)}`),
      })) ?? [];
    return [
      {
        key: "all",
        label: "All products",
        onClick: () => navigate(routes.products),
      },
      { type: "divider" },
      ...fromApi,
    ];
  }, [navCategories, navigate]);

  const markOne = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e) => void message.error(getApiErrorMessage(e)),
  });

  const markAll = useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["notifications"] });
      void message.success("All notifications marked as read");
    },
    onError: (e) => void message.error(getApiErrorMessage(e)),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchDraft.trim();
    if (q) {
      navigate(`${routes.products}?search=${encodeURIComponent(q)}`);
    } else {
      navigate(routes.products);
    }
  };

  const list: NotificationRow[] = notifData?.data ?? [];
  const unread = notifData?.unreadCount ?? 0;

  const dropdownContent = (
    <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-lg w-80 max-h-96 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#F0F0F0]">
        <span className="text-sm font-semibold">Notifications</span>
        <button
          type="button"
          className="text-xs text-primary font-semibold disabled:opacity-50"
          disabled={markAll.isPending || unread === 0}
          onClick={() => markAll.mutate()}
        >
          Mark all as read
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        {list.length === 0 ? (
          <p className="text-sm text-[#585858] p-4">No notifications yet.</p>
        ) : (
          list.map((n) => (
            <button
              key={n.id}
              type="button"
              className="w-full text-left px-3 py-2 border-b border-[#F5F5F5] hover:bg-[#FAFAFA]"
              onClick={() => {
                if (!n.isRead) {
                  markOne.mutate(n.id);
                }
              }}
            >
              <p className="text-sm font-semibold text-black">{n.title}</p>
              <p className="text-xs text-[#585858] line-clamp-2">{n.message}</p>
              <p className="text-[10px] text-[#9B9B9B] mt-1">
                {formatNotifTime(n.createdAt)}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm w-full">
      <nav className="max-w-[1300px] mx-auto px-6 py-4 lato hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4">
      <div className="flex items-center gap-6 lg:gap-8 justify-self-start min-w-0">
        <Dropdown
          menu={{ items: productMenuItems, className: "min-w-[240px] py-1 rounded-lg shadow-md" }}
          trigger={["click"]}
          placement="bottomLeft"
        >
          <button
            type="button"
            className="text-xl font-medium lato text-black flex items-center gap-1.5 shrink-0 rounded-lg px-1 py-0.5 hover:bg-[#FFF5F5] transition-colors"
            aria-haspopup="menu"
            aria-expanded="false"
          >
            Products
            <span className="text-sm opacity-60" aria-hidden>
              ▾
            </span>
          </button>
        </Dropdown>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 min-w-0 flex-1 max-w-md">
          <Search
            placeholder="Search any drink or Brand here..."
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
          />
        </form>
      </div>
      <Link
        to={routes.home}
        className="justify-self-center flex items-center justify-center"
        aria-label="Ile Oti home"
      >
        <img
          src="/logos/red-logo.svg"
          alt=""
          className="h-12 w-auto max-h-[64px] md:h-[52px] max-w-[220px] object-contain"
        />
      </Link>
      {isLoggedIn ? (
        <div className="flex items-center gap-5 lg:gap-6 justify-self-end flex-wrap justify-end">
          <Dropdown dropdownRender={() => dropdownContent} trigger={["click"]}>
            <button
              type="button"
              className="flex items-center justify-center text-xl text-black"
              aria-label="Notifications"
            >
              <Badge count={unread} size="small" offset={[2, 0]} overflowCount={99}>
                <BellOutlined />
              </Badge>
            </button>
          </Dropdown>
          <div className="flex items-center gap-2">
            <FavouritesDropDown />
            <CartDropDown />
          </div>
          <AccountMenuPopover initials={initials(user)} userEmail={user?.email} />
        </div>
      ) : (
        <div className="flex items-center gap-8 justify-self-end flex-wrap justify-end">
          <button
            type="button"
            className="text-xl font-medium text-black"
            onClick={() => navigate(routes.contact)}
          >
            Contact Us
          </button>
          <SignUp />
          <Login />
        </div>
      )}
      </nav>
    </div>
  );
};

export default Navbar;
