import { useNavigate } from "react-router-dom";
import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import type { Order } from "../../../types";
import { formatNGN, primaryImage } from "../../../lib/format";

interface OrderCompletedProps {
  orders: Order[];
  isLoading: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED:  "Refunded",
};

const OrderCompleted = ({ orders, isLoading }: OrderCompletedProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-[#F4EEEE] animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E0E0E0] bg-[#FAFAFA] px-6 py-12 text-center text-[#585858]">
        <p className="max-w-md mx-auto">No past or closed orders yet. Finished deliveries and cancelled orders will land here.</p>
      </div>
    );
  }

  return (
    <div className="transition-all duration-300 opacity-100">
      <div className="w-full text-xs py-3.5 px-6 border-b border-[#DEDEDE] text-[#737373] font-bold flex items-center">
        <p className="w-[15%]"></p>
        <p className="w-[25%]">Order</p>
        <p className="w-[15%]">Items</p>
        <p className="w-[15%]">Total</p>
        <p className="w-[15%]">Contact</p>
        <p className="w-[15%]">Location</p>
      </div>
      {orders.map((order) => {
        const firstItem = order.items[0];
        const itemImage = firstItem?.product?.images
          ? primaryImage(firstItem.product.images, ImagesAndIcons.softDrinkBottle)
          : ImagesAndIcons.softDrinkBottle;
        const statusLabel = STATUS_LABEL[order.status] ?? order.status;
        const date = new Date(order.updatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <div
            key={order.id}
            className="flex items-center py-5 px-6 font-normal text-sm cursor-pointer hover:bg-[#F9F9F9] transition-all"
            onClick={() => navigate(`/dashboard/orders/${order.id}`)}
          >
            <div className="w-[15%] flex relative">
              {order.items.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    backgroundImage: `url(${
                      item.product?.images
                        ? primaryImage(item.product.images, ImagesAndIcons.softDrinkBottle)
                        : itemImage
                    })`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    left: `${idx * 25}px`,
                  }}
                  className="h-11 w-11 border-2 absolute border-[#DEDEDE] rounded-full"
                />
              ))}
            </div>
            <div className="text-primary w-[25%]">
              Order #{order.orderNumber} <br />
              <span className="text-black">{statusLabel} - {date}</span>
            </div>
            <p className="text-[#545454] w-[15%]">{order.items.length}</p>
            <p className="w-[15%]">{formatNGN(order.total)}</p>
            <p className="w-[15%]">{order.shippingName}</p>
            <p className="w-[15%]">{order.shippingCity}, {order.shippingState}</p>
          </div>
        );
      })}
    </div>
  );
};

export default OrderCompleted;
