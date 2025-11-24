import { ImagesAndIcons } from "../../../../shared/images-icons/ImagesAndIcons";

export default function RightHandSideOrderDetail() {
  return (
    <div className="w-114 rounded-3xl bg-[#F5F5F5] p-5">
      <h3 className="text-[#101010] text-base font-semibold mb-4">
        Order summary
      </h3>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="relative h-18 w-17">
              <p className="h-5.5 w-5.5 bg-[#707070]  z-50 absolute -mt-2 right-0 rounded-full flex items-center justify-center text-xs text-white">
                {i}
              </p>
              <img
                src={ImagesAndIcons.soda}
                alt="item"
                className="w-16 relative h-16 rounded-md object-cover"
              />
            </div>
            <div>
              <p className="text-sm  font-medium">Trio plant</p>
              <p className="text-xs text-[#707070]">Mixed</p>
            </div>
            <p className="ml-auto text-sm">₦23,000.00</p>
          </div>
        ))}
      </div>

      {/* Summary numbers */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₦240,000.00</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span>₦12,000.36</span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex justify-between items-center">
        <span className="text-xl font-medium ">Total</span>
        <span className="text-xl font-semibold">
          ₦278,990.36
        </span>
      </div>
    </div>
  );
}
