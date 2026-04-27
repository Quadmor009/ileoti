import { Modal, message } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../btns/Button";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import { createGiftBox } from "../../services/giftbox.service";
import { getApiErrorMessage } from "../../lib/api-error";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import { formatNGN } from "../../lib/format";
import { cartService } from "../../services/cart.service";
import { routes } from "../../shared/routes/routes";

export type GiftBoxProductSeed = {
  productId: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

interface GiftItem {
  productId: string;
  image: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface giftBoxModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleAddPersonalMessage: () => void;
  initialProduct?: GiftBoxProductSeed | null;
  personalMessage?: string;
  checkoutLoading?: boolean;
  onCheckout?: () => void | Promise<void>;
}

const GiftBoxModal = ({
  open,
  setOpen,
  handleAddPersonalMessage,
  initialProduct,
  personalMessage,
  checkoutLoading,
  onCheckout,
}: giftBoxModalProps) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isAuthed = useAuthStore((s) => Boolean(s.accessToken));
  const setCart = useCartStore((s) => s.setCart);
  const addGuestItem = useCartStore((s) => s.addGuestItem);
  const [items, setItems] = useState<GiftItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialProduct) {
      setItems([
        {
          productId: initialProduct.productId,
          image: initialProduct.image,
          name: initialProduct.name,
          category: initialProduct.category,
          price: initialProduct.price,
          quantity: 1,
        },
      ]);
    } else {
      setItems([]);
    }
  }, [open, initialProduct]);

  const increment = (productId: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );

  const decrement = (productId: string) => {
    setItems((prev) => {
      const next = prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0);
      return next;
    });
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleProceedCheckout = async () => {
    if (onCheckout) {
      await onCheckout();
      return;
    }
    if (!isAuthed) {
      if (items.length === 0) {
        void message.info("Add items to your gift box from the product list, or use Shop more items.");
        return;
      }
      items.forEach((item) => {
        addGuestItem({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          category: item.category,
        });
      });
      void message.success("Gift box items added so you can check out as a guest.");
      setOpen(false);
      return;
    }
    if (items.length === 0) {
      void message.error("Add at least one item to your gift box.");
      return;
    }
    setSubmitting(true);
    try {
      await createGiftBox({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        personalMessage: personalMessage?.trim() || undefined,
      });
      void message.success(
        "Your gift box is saved. Items are in your cart; your note is stored for checkout.",
      );
      try {
        const cart = await cartService.getCart();
        setCart(cart);
      } catch {
        // cart will refresh on next page load
      }
      void qc.invalidateQueries({ queryKey: ["cart"] });
      setOpen(false);
    } catch (e) {
      void message.error(getApiErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const busy = Boolean(checkoutLoading) || submitting;

  const handleShopMore = () => {
    setOpen(false);
    navigate(routes.products);
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={650}
      centered
      closable={false}
    >
      <div className="p-5 sm:p-8 md:p-10 lato max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 pr-2">
            <img src={ImagesAndIcons.giftBox} alt="" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
            <span>Your gift box</span>
          </h2>
          <button type="button" onClick={() => setOpen(false)}>
            <img src={ImagesAndIcons.xIcon} alt="" />
          </button>
        </div>
        <p className="text-sm text-[#585858] -mt-2 mb-4">
          Build a set of products for gifting, add a personal note, then proceed — items go to your
          cart for payment (saved guests: local cart).
        </p>
        <div className="border border-[#E8E8E8] bg-white rounded-2xl overflow-auto p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold">Box content</h3>
            <span className="bg-[#80011D] text-white text-xs px-6 py-2 rounded-full">
              {items.length} items
            </span>
          </div>

          <div className="flex items-stretch lato gap-4 overflow-x-auto no-scrollbar my-4 min-h-[100px]">
            {items.length === 0 ? (
              <p className="w-full text-center text-[#585858] text-sm py-6 px-2">
                Your box is empty. Browse products and tap the gift icon on a product, or use{" "}
                <button
                  type="button"
                  onClick={handleShopMore}
                  className="font-semibold text-[#80011D] underline"
                >
                  Shop more items
                </button>{" "}
                to add drinks here.
              </p>
            ) : null}
            {items.map((item) => (
              <div
                key={item.productId}
                className="rounded-2xl whitespace-nowrap min-w-117 flex items-center gap-4 bg-[#FAFAFA] border border-[#F0F0F0] px-6 py-5"
              >
                <img className="w-28 h-36 object-cover rounded-lg" src={item.image} alt="" />
                <div className="flex items-start flex-auto justify-between min-w-0">
                  <div className="flex flex-col min-w-0">
                    <p className="text-lg text-black mb-1 font-bold line-clamp-2 max-w-59">
                      {item.name}
                    </p>
                    <p className="text-sm font-normal mb-2 text-[#585858]">
                      Category: {item.category}
                    </p>
                    <p className="text-xl leading-8 mb-2 text-black font-bold">{formatNGN(item.price)}</p>
                    <div className="bg-white border border-[#E0E0E0] rounded-[12px] px-3 py-2 flex gap-3 font-semibold text-lg w-fit">
                      <button type="button" onClick={() => decrement(item.productId)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => increment(item.productId)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleShopMore}
              className="text-[#80011D] underline font-semibold text-sm"
            >
              Shop more items
            </button>
          </div>
        </div>
        <div className="flex items-center text-xl mb-4 justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">{formatNGN(total)}</span>
        </div>
        <div className="flex flex-col gap-4">
          {personalMessage?.trim() ? (
            <div className="rounded-xl border border-[#80011D]/30 bg-[#FDF6F7] px-4 py-3 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#80011D] mb-1">
                Personal message
              </p>
              <p className="text-sm text-[#333] whitespace-pre-wrap line-clamp-4">{personalMessage.trim()}</p>
            </div>
          ) : null}
          <Button
            label={personalMessage?.trim() ? "Edit personal message" : "Add personal message"}
            type={personalMessage?.trim() ? "lightRed" : "outlineRed"}
            className={`py-6 text-xl rounded-[55px] font-semibold ${
              personalMessage?.trim() ? "ring-2 ring-[#80011D]/30" : ""
            }`}
            icon={ImagesAndIcons.messages}
            handleClick={handleAddPersonalMessage}
          />
          <Button
            label={busy ? "Please wait…" : isAuthed ? "Save to cart & continue" : "Add gift box to cart"}
            type="red"
            className="py-6 text-xl rounded-[55px] font-semibold"
            handleClick={() => void handleProceedCheckout()}
          />
        </div>
      </div>
    </Modal>
  );
};

export default GiftBoxModal;
