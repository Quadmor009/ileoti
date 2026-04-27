import { Modal, message } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "../btns/Button";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import { createGiftBox } from "../../services/giftbox.service";
import { getApiErrorMessage } from "../../lib/api-error";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import { formatNGN } from "../../lib/format";

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
  const isAuthed = useAuthStore((s) => Boolean(s.accessToken));
  const addGuestItem = useCartStore((s) => s.addGuestItem);
  const [items, setItems] = useState<GiftItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !initialProduct) {
      return;
    }
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
  }, [open, initialProduct]);

  const increment = (productId: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );

  const decrement = (productId: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleProceedCheckout = async () => {
    if (onCheckout) {
      await onCheckout();
      return;
    }
    if (!isAuthed) {
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
      void message.success("Gift box items added to cart");
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
      void message.success("Your gift box has been created");
      setOpen(false);
    } catch (e) {
      void message.error(getApiErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const busy = Boolean(checkoutLoading) || submitting;

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={650}
      centered
      closable={false}
    >
      <div className="p-10 lato">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <img src={ImagesAndIcons.giftBox} alt="" /> Your Gift Box
          </h2>
          <button type="button" onClick={() => setOpen(false)}>
            <img src={ImagesAndIcons.xIcon} alt="" />
          </button>
        </div>
        <div className="bg-[#F4EEEE] rounded-2xl overflow-auto  p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold">Box Content</h3>
            <span className="bg-[#80011D] text-white text-xs px-6 py-2 rounded-full">
              {items.length} Items
            </span>
          </div>

          <div className="flex items-center lato gap-4 overflow-auto no-scrollbar my-6 min-h-[120px]">
            {items.length === 0 ? (
              <p className="w-full text-center text-[#585858] text-sm py-6 px-2">
                Your box is empty. Close this and add products from the grid, or use{" "}
                <span className="font-semibold text-[#80011D]">Shop More Items</span> below
                to keep browsing.
              </p>
            ) : null}
            {items.map((item) => (
              <div
                key={item.productId}
                className="rounded-2xl whitespace-nowrap min-w-117 flex items-center gap-4 bg-white px-8 py-6"
              >
                <img className="w-34 h-40 object-cover" src={item.image} alt="" />
                <div className=" flex items-start flex-auto justify-between">
                  <div className="flex flex-col">
                    <p className="text-xl text-black mb-1 font-bold max-w-59">
                      {item.name}
                    </p>
                    <p className="text-sm font-normal mb-4 text-[#585858]">
                      Category: {item.category}
                    </p>
                    <p className="text-xl leading-8 mb-1 text-black font-bold max-w-59">
                      {formatNGN(item.price)}
                    </p>
                    <div className="flex">
                      <div className="bg-[#F4EEEE] rounded-[12px] px-4 py-2 flex gap-2 font-semibold text-xl ">
                        <button
                          type="button"
                          onClick={() => decrement(item.productId)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increment(item.productId)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button type="button" className="text-[#80011D] underline font-semibold text-sm">
              Shop More Items
            </button>
          </div>
        </div>
        <div className="flex items-center text-xl mb-4 justify-between">
          <span className="font-bold ">Total:</span>
          <span className="font-bold ">{formatNGN(total)}</span>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            label="Add Personal Message"
            type="outlineRed"
            className="py-6 text-xl rounded-[55px] font-semibold"
            icon={ImagesAndIcons.messages}
            handleClick={handleAddPersonalMessage}
          />
          <Button
            label={busy ? "Please wait…" : "Proceed To Check Out"}
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
