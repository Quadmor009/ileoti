import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import Topbar from "../top-bar/Topbar";
import OrderTabs from "./components/OrderTabs";
import { useState } from "react";
import OrderCompleted from "./OrderCompleted";
import OrderActive from "./OrderActive";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../../services/order.service";
import { useAuthStore } from "../../../store/auth.store";
import type { Order } from "../../../types";

const ACTIVE_STATUSES = new Set([
  "SUBMITTED", "CONFIRMED", "AWAITING_PAYMENT", "PAID",
  "PROCESSING", "SHIPPED", "ON_ITS_WAY", "OUT_FOR_DELIVERY", "PENDING",
]);

export default function Orders() {
  const [activeTab, setActiveTab] = useState("Active");
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.listOrders(1, 100),
    enabled: isAuthenticated,
    refetchInterval: 30_000,
  });

  const allOrders: Order[] = data?.data ?? [];
  const activeOrders = allOrders.filter((o) => ACTIVE_STATUSES.has(o.status));
  const completedOrders = allOrders.filter((o) => !ACTIVE_STATUSES.has(o.status));

  return (
    <div>
      <Navbar />
      <div className="max-w-[1200px] mx-auto py-10 px-4 sm:px-6">
        <Topbar />

        <header className="mb-8 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Your orders</h1>
          <p className="text-[#585858] mt-2 text-base leading-relaxed">
            Active shipments and payments appear under Active. Delivered or closed orders are under Past. All lists every order on your account.
          </p>
        </header>

        <OrderTabs
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          activeCount={activeOrders.length}
          completedCount={completedOrders.length}
          allCount={allOrders.length}
        />

        {activeTab === "Active" && (
          <OrderActive orders={activeOrders} isLoading={isLoading} />
        )}

        {activeTab === "Past" && (
          <OrderCompleted orders={completedOrders} isLoading={isLoading} />
        )}

        {activeTab === "All" && (
          <OrderActive orders={allOrders} isLoading={isLoading} />
        )}

        <div className="text-sm border-[#DEDEDE] border-t pt-5 text-[#585858] mt-10 flex flex-wrap gap-x-4 gap-y-1">
          <span title="Coming soon" className="cursor-default opacity-60">Refund Policy</span>
          <span title="Coming soon" className="cursor-default opacity-60">Shipping Policy</span>
          <span title="Coming soon" className="cursor-default opacity-60">Privacy Policy</span>
          <span title="Coming soon" className="cursor-default opacity-60">Terms of Service</span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
