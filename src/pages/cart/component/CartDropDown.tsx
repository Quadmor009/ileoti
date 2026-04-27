import { Popover } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagesAndIcons } from '../../../shared/images-icons/ImagesAndIcons';
import { useCartStore } from '../../../store/cart.store';
import { useAuthStore } from '../../../store/auth.store';
import { useLoginModalStore } from '../../../store/login-modal.store';
import { formatNGN } from '../../../lib/format';
import { routes } from '../../../shared/routes/routes';

const CartDropDown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = Boolean(user);
  const requestLogin = useLoginModalStore((s) => s.requestLogin);
  const guestItems = useCartStore((s) => s.guestItems);
  const apiItems = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.itemCount);
  const total = useCartStore((s) => s.total);

  // Show guest items if not logged in, API items if logged in
  const displayItems = isLoggedIn ? apiItems : guestItems;

  const handleCheckout = () => {
    setOpen(false);
    if (!isLoggedIn) {
      requestLogin();
      return;
    }
    navigate(routes.checkout);
  };

  const handleViewCart = () => {
    setOpen(false);
    navigate(routes.cart);
  };

  return (
    <Popover
      content={
        <div className="w-96 bg-white border border-[#D9D9D9] lato rounded-3xl overflow-hidden">
          <div className="flex px-6 pt-6 items-center justify-between">
            <p className="text-xl font-bold">Cart ({itemCount})</p>
            <button onClick={() => setOpen(false)}>
              <img src={ImagesAndIcons.xIcon} alt="close" />
            </button>
          </div>
          <div className="flex px-6 flex-col gap-4 mt-4 max-h-64 overflow-y-auto">
            {displayItems.length === 0 ? (
              <p className="text-[#585858] text-sm py-4 text-center">Your cart is empty</p>
            ) : (
              displayItems.map((item: any) => {
                const name = item.name ?? item.product?.name ?? 'Product';
                const price = item.price ?? Number(item.product?.price ?? 0);
                const qty = item.quantity ?? 1;
                const image = item.image ?? item.product?.images?.[0]?.url ?? '';
                return (
                  <div key={item.productId ?? item.id} className="flex items-center gap-3">
                    {image ? (
                      <img src={image} alt={name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#8B0000] flex items-center justify-center text-white text-xs font-bold">
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold line-clamp-1">{name}</p>
                      <p className="text-xs text-[#585858]">Qty: {qty}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatNGN(price * qty)}</p>
                  </div>
                );
              })
            )}
          </div>
          <div className="bg-[#F4EEEE] px-6 py-5 mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Total</p>
              <p className="text-base font-semibold">{formatNGN(total)}</p>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-[#8B0000] text-white rounded-[55px] text-base font-semibold hover:bg-[#6B0000] transition-colors"
            >
              {isLoggedIn ? 'Checkout' : 'Login to Checkout'}
            </button>
            <button
              onClick={handleViewCart}
              className="text-[#8B0000] font-semibold text-base underline text-center w-full"
            >
              View Cart
            </button>
          </div>
        </div>
      }
      trigger="click"
      placement="bottom"
      open={open}
      onOpenChange={setOpen}
      overlayInnerStyle={{ padding: 0, borderRadius: 24 }}
    >
      <button className="relative border border-transparent hover:border-[#80011D] transition-all duration-300 p-0.5 rounded-full">
        <img className="ml-[0.5px]" src={ImagesAndIcons.cartRed} alt="cart" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8B0000] text-white text-[10px] font-bold leading-[18px] text-center">
            {itemCount}
          </span>
        )}
      </button>
    </Popover>
  );
};

export default CartDropDown;
