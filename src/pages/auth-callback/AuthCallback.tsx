import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../../services/auth.service";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import { cartService } from "../../services/cart.service";
import { takePathForOAuthReturn } from "../../lib/post-login-redirect";
import api from "../../lib/api";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const returnTo = takePathForOAuthReturn();

      // Exchange the httpOnly refresh_token cookie (set by the backend redirect)
      // for an access token — token never travels through the URL.
      let token: string;
      try {
        const { data } = await api.post<{ accessToken: string }>(
          "/authservice/v1.0/rest/api/app/auth/refresh",
          {}
        );
        token = data.accessToken;
      } catch {
        navigate("/?error=oauth_failed", { replace: true });
        return;
      }

      useAuthStore.getState().setAuth(token, null);

      // Merge guest cart now that auth token is set
      const guestItems = useCartStore.getState().guestItems;
      if (guestItems.length > 0) {
        await Promise.allSettled(
          guestItems.map((item) => cartService.addToCart(item.productId, item.quantity))
        );
        useCartStore.getState().clearGuestCart();
      }

      try {
        const user = await fetchProfile();
        useAuthStore.getState().setAuth(token, user);
      } catch {
        // Access token is still valid; user can retry loading profile later.
      }

      navigate(returnTo, { replace: true });
    };

    void run();
  }, [navigate]);

  return <p className="p-4 lato">Signing you in…</p>;
}
