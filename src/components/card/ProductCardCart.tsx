import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import type { CartItem } from "../../types";
import { effectivePrice, formatNGN, primaryImage } from "../../lib/format";

interface ProductCardCartProps {
  /** Legacy prop kept for backward compatibility */
  i?: number;
  /** Real cart item from API */
  item?: CartItem;
  onRemove?: (productId: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onToggleWishlist?: (productId: string) => void;
}

const ProductCardCart = ({
  i,
  item,
  onRemove,
  onUpdateQuantity,
  onToggleWishlist,
}: ProductCardCartProps) => {
  if (!item?.product) {
    return null;
  }

  const name = item.product.name || "—";
  const category =
    (item.product as { category?: { name?: string } }).category?.name ?? "—";
  const image = primaryImage(item.product.images, ImagesAndIcons.furasgnBottle);
  const unitPrice = effectivePrice(item.product);
  const quantity = item.quantity ?? 1;
  const lineTotal = unitPrice * quantity;
  const productId = item.productId;

  return (
    <div key={i ?? item.id}>
      <div className="flex gap-6 sm:gap-8 items-start sm:items-center">
        <img className="w-28 h-28 sm:w-55 sm:h-55 rounded-2xl sm:rounded-3xl object-cover shrink-0" src={image} alt={name} />
        <div className="flex flex-1 flex-col sm:flex-row sm:items-start sm:justify-between gap-4 min-w-0">
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-xl sm:text-2xl leading-tight text-black font-bold">{name}</p>
            <p className="text-base sm:text-xl font-normal text-[#585858]">Category: {category}</p>
            <p className="text-sm text-[#585858]">
              {formatNGN(unitPrice)} each × {quantity}
            </p>
            <div className="flex items-center gap-4 pt-1">
              <button
                type="button"
                className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity"
                onClick={() => onToggleWishlist?.(productId)}
                aria-label="Wishlist"
              >
                <img src={ImagesAndIcons.lovelyRed} alt="" className="w-8 h-8" />
              </button>
              <button type="button" onClick={() => onRemove?.(productId)} aria-label="Remove from cart">
                <img src={ImagesAndIcons.trashSm} alt="" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3 items-center pt-2">
              <div className="bg-[#F4EEEE] rounded-[55px] px-4 py-2 flex gap-4 items-center font-semibold text-xl sm:text-2xl">
                <button
                  type="button"
                  className="min-w-[2rem] text-center disabled:opacity-40"
                  onClick={() => quantity > 1 && onUpdateQuantity?.(productId, quantity - 1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="min-w-[2ch] text-center">{quantity}</span>
                <button
                  type="button"
                  className="min-w-[2rem] text-center"
                  onClick={() => onUpdateQuantity?.(productId, quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[#585858]">Line total</p>
            <p className="text-2xl sm:text-3xl font-semibold text-black tabular-nums">{formatNGN(lineTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardCart;
