import { useEffect, useState } from 'react';
import { ImagesAndIcons } from '../../../shared/images-icons/ImagesAndIcons'


const OrderActive = () => {
    interface OrderCardProps {
  id: number;
  image: string;
  items: number;
  orderId: string;
  price: number;
  status: string;
  date: string;
}

const sampleOrders: OrderCardProps[] = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/demo/image/upload/v1690507896/sample.jpg",
    items: 3,
    orderId: "#1014",
    price: 57000,
    status: "Confirmed",
    date: "Oct 17",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/demo/image/upload/v1690507896/sample.jpg",
    items: 3,
    orderId: "#1015",
    price: 57000,
    status: "Confirmed",
    date: "Oct 17",
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/demo/image/upload/v1690507896/sample.jpg",
    items: 3,
    orderId: "#1016",
    price: 57000,
    status: "Confirmed",
    date: "Oct 17",
  },
];

    const [active, setActive] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setActive(true)
        }, 200)
    },[])
  return (
   <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${active ?"opacity-100" : "opacity-0"}`}>
             {sampleOrders.map((order) => (
               <div
                 key={order.id}
                 className="rounded-[48px] border p-6 w-91.5 border-[#D8D8D8] overflow-hidden bg-white"
               >
                 <button className="border border-[#80011D] text-[#80011D] text-xs font-semibold w-full py-4 rounded-full hover:bg-[#F4EEEE] transition-all">
                   Reorder
                 </button>
                 <div className="flex items-start px-4 pt-3 pb-2 my-4.5 gap-2 rounded-lg bg-[#F5F5F5]">
                   <img src={ImagesAndIcons.successBlack} alt="" />
                   <p className="text-xs text-black font-normal">
                     {order.status}
                     <br />
                     Updated {order.date}
                   </p>
                 </div>
   
                 <div className="flex justify-center items-center p-4">
                   <img
                     src={order.image}
                     alt="order"
                     className="w-36 h-40 object-cover rounded-xl"
                   />
                 </div>
   
                 <div className="flex flex-col gap-2">
                   <p className="text-sm text-gray-700">{order.items} Items</p>
                   <p className="text-xs text-gray-400">Order {order.orderId}</p>
                   <p className="font-semibold text-[#80011D] text-lg">
                     ₦{order.price.toLocaleString()}.00
                   </p>
   
                   <div className="flex items-center gap-3 mt-3">
                     <button className="bg-[#80011D] text-white text-xs font-semibold flex items-center justify-center gap-2 w-1/2 py-4 rounded-full hover:bg-[#660018] transition-all">
                       <img src={ImagesAndIcons.shoppingCartWhite} alt="" /> Add To
                       Cart
                     </button>
                     <button className="bg-[#80011D] text-white text-xs font-semibold flex items-center justify-center gap-2 w-1/2 py-4 rounded-full hover:bg-[#660018] transition-all">
                       <img src={ImagesAndIcons.reorder} alt="" /> Reorder
                     </button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
  )
}

export default OrderActive
