import { useNavigate } from "react-router-dom";
import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import type { Order } from "../../../types";
import { formatNGN, primaryImage } from "../../../lib/format";

interface OrderActiveProps {
  orders: Order[];
  isLoading: boolean;
}

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  SUBMITTED:       { label: "Submitted",        color: "text-gray-600" },
  AWAITING_PAYMENT:{ label: "Awaiting Payment", color: "text-gray-600" },
  PENDING:         { label: "Pending",           color: "text-gray-600" },
  CONFIRMED:       { label: "Confirmed",         color: "text-blue-600" },
  PAID:            { label: "Paid",              color: "text-blue-600" },
  PROCESSING:      { label: "Processing",        color: "text-blue-600" },
  ON_ITS_WAY:      { label: "On Its Way",        color: "text-orange-500" },
  OUT_FOR_DELIVERY:{ label: "Out for Delivery",  color: "text-orange-500" },
  SHIPPED:         { label: "Shipped",           color: "text-orange-500" },
  DELIVERED:       { label: "Delivered",         color: "text-green-600" },
  CANCELLED:       { label: "Cancelled",         color: "text-red-600" },
  REFUNDED:        { label: "Refunded",          color: "text-red-600" },
};

const OrderActive = ({ orders, isLoading }: OrderActiveProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-[48px] border p-6 w-91.5 border-[#D8D8D8] h-72 animate-pulse bg-[#F4EEEE]" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E0E0E0] bg-[#FAFAFA] px-6 py-12 text-center text-[#585858]">
        <p className="max-w-md mx-auto">Nothing in this list right now. When you check out, progress will show here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-100 transition-all duration-300">
      {orders.map((order) => {
        const badge = STATUS_BADGE[order.status] ?? { label: order.status, color: "text-gray-600" };
        const firstItem = order.items[0];
        const itemImage = firstItem?.product?.images
          ? primaryImage(firstItem.product.images, ImagesAndIcons.softDrinkBottle)
          : ImagesAndIcons.softDrinkBottle;
        const updatedAt = new Date(order.updatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <div
            key={order.id}
            className="rounded-[48px] border p-6 w-91.5 border-[#D8D8D8] overflow-hidden bg-white"
          >
            <button
              className="border border-[#80011D] text-[#80011D] text-xs font-semibold w-full py-4 rounded-full hover:bg-[#F4EEEE] transition-all"
              onClick={() => navigate(`/dashboard/orders/${order.id}`)}
            >
              View Order
            </button>
            <div className="flex items-start px-4 pt-3 pb-2 my-4.5 gap-2 rounded-lg bg-[#F5F5F5]">
              <img src={ImagesAndIcons.successBlack} alt="" />
              <p className={`text-xs font-normal ${badge.color}`}>
                {badge.label}
                <br />
                Updated {updatedAt}
              </p>
            </div>

            <div className="flex justify-center items-center p-4">
              <img
                src={itemImage}
                alt="order"
                className="w-36 h-40 object-cover rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-700">{order.items.length} Item{order.items.length !== 1 ? "s" : ""}</p>
              <p className="text-xs text-gray-400">Order #{order.orderNumber}</p>
              <p className="font-semibold text-[#80011D] text-lg">{formatNGN(order.total)}</p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  className="bg-[#80011D] text-white text-xs font-semibold flex items-center justify-center gap-2 w-full py-4 rounded-full hover:bg-[#660018] transition-all"
                  onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                >
                  <img src={ImagesAndIcons.shoppingCartWhite} alt="" /> View Details
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderActive;
