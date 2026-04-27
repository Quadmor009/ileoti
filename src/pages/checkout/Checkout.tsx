import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import CustomSelect from "../../components/select/CustomSelect";
import CustomInput from "../../components/input/CustomInput";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import Button from "../../components/btns/Button";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/routes/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/auth.service";
import { cartService } from "../../services/cart.service";
import { orderService } from "../../services/order.service";
import { effectivePrice, formatNGN, primaryImage } from "../../lib/format";
import { message } from "antd";
import type { Address, CartItem } from "../../types";
import { usePageTitle } from "../../lib/use-page-title";

type CheckoutStep = "delivery" | "payment";

const mutedRowClass = "text-[#585858] text-base lg:text-xl font-normal";
const shippingTaxAmountClass = "text-lg sm:text-2xl font-normal text-[#585858] tabular-nums";

function OrderLines({ items }: { items: CartItem[] }) {
  if (!items.length) {
    return <p className="text-[#585858] text-base py-4">Your cart is empty.</p>;
  }
  return (
    <ul className="space-y-0 divide-y divide-[#EFEFEF]">
      {items.map((item) => {
        const unit = effectivePrice(item.product);
        const line = unit * item.quantity;
        const cat = (item.product as { category?: { name?: string } }).category?.name ?? "—";
        return (
          <li key={item.id} className="flex gap-4 sm:gap-5 py-5 first:pt-0">
            <img
              className="w-[5.5rem] h-[6.5rem] sm:w-32 sm:h-40 rounded-2xl object-cover shrink-0 ring-1 ring-black/5"
              src={primaryImage(item.product.images, ImagesAndIcons.softDrinkBottle)}
              alt={item.product.name}
            />
            <div className="min-w-0 flex-1 flex flex-col justify-between gap-3">
              <div>
                <p className="text-lg sm:text-xl font-bold text-black leading-snug">{item.product.name}</p>
                <p className="text-sm text-[#585858] mt-1.5 leading-relaxed">
                  <span className="font-medium text-[#585858]">Category</span>
                  <span className="text-[#C4C4C4] mx-1.5" aria-hidden>
                    ·
                  </span>
                  <span>{cat}</span>
                  <span className="text-[#C4C4C4] mx-1.5" aria-hidden>
                    ·
                  </span>
                  <span className="font-medium text-[#585858]">Qty</span> {item.quantity}
                </p>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-3 pt-1 border-t border-[#F4F4F4] sm:border-0 sm:pt-0">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#9B9B9B]">Unit price</p>
                  <p className="text-sm sm:text-base text-[#585858] tabular-nums mt-0.5">{formatNGN(unit)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#9B9B9B]">Line total</p>
                  <p className="text-lg sm:text-xl font-semibold text-black tabular-nums mt-0.5">{formatNGN(line)}</p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function SummaryRows({
  subtotal,
  shipping,
  tax,
  total,
}: {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex justify-between gap-4">
        <p className="text-base lg:text-xl font-bold text-black">Subtotal</p>
        <p className="text-2xl font-normal text-black tabular-nums">{formatNGN(subtotal)}</p>
      </div>
      <div className="flex justify-between items-baseline gap-4">
        <p className={mutedRowClass}>Estimated Shipping</p>
        <p className={shippingTaxAmountClass}>{formatNGN(shipping)}</p>
      </div>
      <div className="flex justify-between items-baseline gap-4">
        <p className={mutedRowClass}>Estimated Tax</p>
        <p className={shippingTaxAmountClass}>{formatNGN(tax)}</p>
      </div>
      <div className="flex justify-between border-y-2 border-[#F0F0F0] py-4 mt-2 gap-4">
        <p className="text-base lg:text-xl font-bold text-black">Total</p>
        <p className="text-2xl font-semibold text-black tabular-nums">{formatNGN(total)}</p>
      </div>
    </div>
  );
}

const Checkout = () => {
  usePageTitle("Checkout");
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<CheckoutStep>("delivery");
  const [payMethod, setPayMethod] = useState<"card" | "transfer">("card");

  useEffect(() => {
    if (!isAuthenticated) navigate(routes.home);
  }, [isAuthenticated, navigate]);

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: authService.getAddresses,
    enabled: isAuthenticated,
  });

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });

  const defaultAddr: Address | undefined =
    (addresses as Address[] | undefined)?.find((a) => a.isDefault) ??
    (addresses as Address[] | undefined)?.[0];

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Nigeria",
    phone: "",
  });

  const [resolvedAddressId, setResolvedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (defaultAddr) {
      setForm({
        fullName: defaultAddr.fullName,
        address: defaultAddr.address,
        city: defaultAddr.city,
        state: defaultAddr.state,
        zip: defaultAddr.zip ?? "",
        country: defaultAddr.country,
        phone: defaultAddr.phone,
      });
      setResolvedAddressId(defaultAddr.id);
    }
  }, [defaultAddr]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const cartItems = cart?.items ?? [];
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + effectivePrice(item.product) * item.quantity, 0),
    [cartItems],
  );
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const persistAddressMutation = useMutation({
    mutationFn: async (): Promise<string> => {
      if (!form.fullName || !form.address || !form.city || !form.state || !form.country || !form.phone) {
        throw new Error("Please fill in all required fields");
      }
      let addressId = resolvedAddressId ?? defaultAddr?.id ?? null;
      if (addressId) {
        await authService.updateAddress(addressId, {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip || null,
          country: form.country,
          phone: form.phone,
          isDefault: true,
        });
      } else {
        const created = (await authService.createAddress({
          type: "SHIPPING",
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip || null,
          country: form.country,
          phone: form.phone,
          isDefault: true,
        })) as Address;
        addressId = created.id;
        void queryClient.invalidateQueries({ queryKey: ["addresses"] });
      }
      return addressId;
    },
    onSuccess: (id) => {
      setResolvedAddressId(id);
      setStep("payment");
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "Could not save address";
      void message.error(msg);
    },
  });

  const payMutation = useMutation({
    mutationFn: async () => {
      if (!cartItems.length) {
        throw new Error("Your cart is empty");
      }
      const addressId = resolvedAddressId ?? defaultAddr?.id;
      if (!addressId) {
        throw new Error("Please complete delivery details first");
      }
      const order = await orderService.createOrder({ addressId });
      const payment = await orderService.initializePayment(order.id);
      return payment;
    },
    onSuccess: (payment) => {
      window.location.href = payment.authorizationUrl;
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "Could not process payment";
      void message.error(msg);
    },
  });

  const handleContinueToPayment = () => {
    if (!cartItems.length) {
      void message.warning("Your cart is empty.");
      return;
    }
    persistAddressMutation.mutate();
  };

  return (
    <section>
      <Navbar />
      <div className="max-w-300 w-[90%] mx-auto pt-8 pb-20">
        <div className="flex flex-col gap-2 mb-6">
          {step === "delivery" ? (
            <button
              type="button"
              onClick={() => navigate(routes.cart)}
              className="text-left text-[#585858] hover:text-black text-base font-medium flex items-center gap-2 w-fit"
            >
              <span aria-hidden>←</span>
              Back to cart
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep("delivery")}
              className="text-left text-[#585858] hover:text-black text-base font-medium flex items-center gap-2 w-fit"
            >
              <span aria-hidden>←</span>
              Delivery
            </button>
          )}
          <p className="text-xl sm:text-2xl font-normal text-[#585858]">Checkout</p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16 lg:items-start">
          {/* Main column */}
          <div className="w-full lg:flex-1 lg:max-w-2xl flex flex-col gap-6">
            {step === "delivery" ? (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-black">Delivery</h1>
                <CustomSelect
                  options={[
                    { value: "Delivery", label: "Delivery" },
                    { value: "Pickup", label: "Pickup" },
                  ]}
                  placeholder="Select delivery method"
                  label="Delivery method"
                />
                <div className="flex gap-4 flex-col sm:flex-row">
                  <CustomInput
                    label="Full Name"
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={set("fullName")}
                  />
                  <CustomInput
                    label="Phone"
                    placeholder="+234…"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
                <CustomInput
                  label="Address"
                  placeholder="Enter your full address"
                  icon={ImagesAndIcons.mapIcon}
                  value={form.address}
                  onChange={set("address")}
                />
                <div className="flex gap-4 flex-col sm:flex-row">
                  <CustomInput label="City" placeholder="City" value={form.city} onChange={set("city")} />
                  <CustomInput label="State" placeholder="State" value={form.state} onChange={set("state")} />
                  <CustomInput label="Zip" placeholder="ZIP" value={form.zip} onChange={set("zip")} />
                </div>
                <CustomInput
                  label="Country"
                  placeholder="Country"
                  value={form.country}
                  onChange={set("country")}
                />
                <Button
                  type="red"
                  label={persistAddressMutation.isPending ? "Saving…" : "Next: Payment method"}
                  className="lg:py-6 text-base lg:text-xl py-3 font-semibold rounded-[55px] mt-2"
                  handleClick={() => handleContinueToPayment()}
                />
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-black">Payment method</h1>
                <p className="text-base text-[#585858] -mt-2">All transactions are secure and encrypted.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setPayMethod("card")}
                    className={`flex-1 rounded-2xl border-2 p-4 text-left transition-colors ${
                      payMethod === "card"
                        ? "border-[#80011D] bg-[#FFF8F8]"
                        : "border-[#E8E8E8] bg-white hover:border-[#D0D0D0]"
                    }`}
                  >
                    <p className="font-semibold text-black">Card payment</p>
                    <p className="text-sm text-[#585858] mt-1">Pay with card via Paystack</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod("transfer")}
                    className={`flex-1 rounded-2xl border-2 p-4 text-left transition-colors ${
                      payMethod === "transfer"
                        ? "border-[#80011D] bg-[#FFF8F8]"
                        : "border-[#E8E8E8] bg-white hover:border-[#D0D0D0]"
                    }`}
                  >
                    <p className="font-semibold text-black">Bank transfer</p>
                    <p className="text-sm text-[#585858] mt-1">Paystack transfer options</p>
                  </button>
                </div>
                <p className="text-sm text-[#585858] leading-relaxed">
                  Card and bank details are entered only on Paystack&apos;s secure checkout page. We never store
                  your full card number on this site.
                </p>
                <Button
                  type="red"
                  label={payMutation.isPending ? "Redirecting…" : "Make payment"}
                  className="lg:py-6 text-base lg:text-xl py-3 font-semibold rounded-[55px] mt-4"
                  handleClick={() => payMutation.mutate()}
                  disabled={payMutation.isPending}
                />
              </>
            )}
          </div>

          {/* Sidebar — order matches reference: delivery = Your order then Summary; payment = Summary then Your order */}
          <aside className="w-full lg:w-[min(100%,28rem)] shrink-0 lg:sticky lg:top-24 space-y-10">
            {step === "delivery" ? (
              <>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Your order</h2>
                  <div className="mt-5 rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] px-4 py-3 sm:px-5 sm:py-4">
                    <OrderLines items={cartItems} />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Summary</h2>
                  <SummaryRows subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Summary</h2>
                  <SummaryRows subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Your order</h2>
                  <div className="mt-5 rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] px-4 py-3 sm:px-5 sm:py-4">
                    <OrderLines items={cartItems} />
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Checkout;
