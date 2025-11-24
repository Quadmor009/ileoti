import { useEffect, useState } from "react";
import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";

const OrderCompleted = () => {

      const [active, setActive] = useState(false)
      useEffect(() => {
          setTimeout(() => {
              setActive(true)
          }, 200)
      },[])
  return (
    <div className={`transition-all duration-300 ${active ?"opacity-100" : "opacity-0"}`}>
      <div className="w-full text-xs py-3.5 px-6 border-b border-[#DEDEDE] text-[#737373] font-bold flex items-center">
        <p className="w-[15%]"></p>
        <p className="w-[25%]">Order</p>
        <p className="w-[15%]">Items</p>
        <p className="w-[15%]">Total</p>
        <p className="w-[15%]">Contact</p>
        <p className="w-[15%]">Location</p>
      </div>
      <div className="flex items-start py-5 px-6 font-normal text-sm">
        <div className="w-[15%] flex relative">
          {[1, 2, 3].map((i, idx) => (
            <div
              style={{
                backgroundImage: `url(${ImagesAndIcons.softDrinkBottle})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                left: `${idx * 25}px`,
              }}
              key={i}
              className="h-11 w-11 border-2 absolute border-[#DEDEDE]  rounded-full"
            ></div>
          ))}
        </div>
        <div className="text-primary w-[25%]">
          Order #1412 <br />{" "}
          <span className="text-black">Delivered - Oct 10</span>
        </div>
        <p className="text-[#545454] w-[15%]">40</p>
        <p className="w-[15%]">N50,000.00</p>
        <p className="w-[15%]">Alain Stuart</p>
        <p className="w-[15%]">151 O’Connor St, Ottawa</p>
      </div>
    </div>
  );
};

export default OrderCompleted;
