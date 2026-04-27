import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import CustomSelect from "../../components/select/CustomSelect";
import CustomInput from "../../components/input/CustomInput";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import Button from "../../components/btns/Button";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/routes/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/auth.service";
import { cartService } from "../../services/cart.service";
import { orderService } from "../../services/order.service";
import { effectivePrice, formatNGN, primaryImage } from "../../lib/format";
import { message } from "antd";
import { ImagesAndIcons as Img } from "../../shared/images-icons/ImagesAndIcons";
import type { Address } from "../../types";

const Checkout = () => {
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  // Pre-fill from default address
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
    }
  }, [defaultAddr]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const cartItems = cart?.items ?? [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + effectivePrice(item.product) * item.quantity,
    0,
  );

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!form.fullName || !form.address || !form.city || !form.state || !form.country || !form.phone) {
        throw new Error("Please fill in all required fields");
      }
      if (!cartItems.length) {
        throw new Error("Your cart is empty");
      }

      let addressId = defaultAddr?.id;
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

      const order = await orderService.createOrder({ addressId });
      const payment = await orderService.initializePayment(order.id);
      return payment;
    },
    onSuccess: (payment) => {
      window.location.href = payment.authorizationUrl;
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "Could not process order";
      void message.error(msg);
    },
  });

  return (
    <section>
      <Navbar />
      <div className="max-w-300 w-[90%] flex flex-col-reverse lg:flex-row mx-auto gap-12 pt-12 pb-20">
        {/* LEFT — Delivery form */}
        <div className="w-full lg:w-180 flex-col flex gap-6">
          <p className="hidden lg:block font-normal text-2xl">Checkout</p>
          <h4 className="text-3xl font-bold">Delivery</h4>
          <CustomSelect
            options={[
              { value: "Delivery", label: "Delivery" },
              { value: "Pickup", label: "Pickup" },
            ]}
            placeholder="Select delivery method"
            label="Delivery method"
          />
          <div className="flex gap-4 flex-col lg:flex-row items-center">
            <CustomInput
              label="Full Name"
              placeholder="Your full name"
              value={form.fullName}
              onChange={set("fullName")}
            />
            <CustomInput
              label="Phone"
              placeholder="+234..."
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
          <div className="flex gap-4 flex-col lg:flex-row items-center">
            <CustomInput
              label="City"
              placeholder="City"
              value={form.city}
              onChange={set("city")}
            />
            <CustomInput
              label="State"
              placeholder="State"
              value={form.state}
              onChange={set("state")}
            />
            <CustomInput
              label="Zip"
              placeholder="Enter Zip"
              value={form.zip}
              onChange={set("zip")}
            />
          </div>
          <CustomInput
            label="Country"
            placeholder="Country"
            value={form.country}
            onChange={set("country")}
          />
          <Button
            type="red"
            label={createOrderMutation.isPending ? "Processing…" : "Pay with Paystack"}
            className="lg:py-6 text-base lg:text-xl py-3 font-semibold rounded-[55px]"
            handleClick={() => createOrderMutation.mutate()}
          />
        </div>

        {/* RIGHT — Order summary */}
        <div className="w-full lg:w-115">
          <h4 className="text-3xl font-bold">Your Order</h4>
          <div className="flex flex-col gap-4 mt-6">
            {cartItems.length === 0 ? (
              <p className="text-[#585858] text-base py-4">Your cart is empty. Add products before checkout.</p>
            ) : (
              cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img
                      className="w-34 h-40 rounded-2xl object-cover"
                      src={primaryImage(item.product.images, Img.softDrinkBottle)}
                      alt={item.product.name}
                    />
                    <div>
                      <p className="text-base lg:text-xl font-bold">{item.product.name}</p>
                      <p className="text-[#585858] text-xs lg:text-base font-normal mb-6">
                        Category: {(item.product as { category?: { name?: string } }).category?.name ?? "—"}
                      </p>
                      <p className="text-base lg:text-xl font-bold">
                        {formatNGN(effectivePrice(item.product))}
                      </p>
                      <p className="text-[#585858] text-xs lg:text-base font-normal">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
              )))
            }
          </div>
          <h4 className="text-3xl font-bold mt-10">Summary</h4>
          <div className="flex flex-col gap-2 mt-8">
            <div className="flex justify-between">
              <p className="text-base lg:text-xl font-bold text-black">Subtotal</p>
              <p className="text-2xl font-normal text-black">{formatNGN(subtotal)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-base lg:text-xl font-bold text-black">Estimated Shipping</p>
              <p className="text-2xl font-normal text-black">{formatNGN(0)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-base lg:text-xl font-bold text-black">Estimated Tax</p>
              <p className="text-2xl font-normal text-black">{formatNGN(0)}</p>
            </div>
          </div>
          <div className="flex justify-between border-y-2 mt-4 border-[#F0F0F0] py-4">
            <p className="text-base lg:text-xl font-bold text-black">Total</p>
            <p className="text-2xl font-normal text-black">{formatNGN(subtotal)}</p>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Checkout;
