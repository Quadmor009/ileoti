import { useNavigate } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/navbar/Navbar";
import { TimelineStep } from "./components/OrderStatusTimeline";
import RightHandSideOrderDetail from "./components/RightHandSide";
import { routes } from "../../../shared/routes/routes";

const OrderDetails = () => {
  const navigate = useNavigate();
  const data = [
    {
      title: "Delivered",
      note: "",
      date: "",
      updated: false,
    },
    {
      title: "Out for delivery",
      note: "Customer Note: ",
      date: "",
      updated: false,
    },
    {
      title: "Order on its way",
      note: "Note: Our dispatch will contact you...",
      date: "Updated March 24, 08:39PM",
      updated: true,
    },
    {
      title: "Order Confirmed",
      note: "",
      date: "Updated March 23",
      updated: true,
    },
    {
      title: "Order Submitted",
      note: "",
      date: "Updated March 21",
      updated: true,
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-285 mx-auto py-10">
        <div className="w-full flex mb-7 items-center justify-between">
          <div onClick={() => navigate(routes.orders)} className="flex cursor-pointer items-start gap-3">
            <p className="mt-2 ">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.1992 8.99922L1.79922 8.99922M1.79922 8.99922L8.09922 15.2992M1.79922 8.99922L8.09922 2.69922"
                  stroke="black"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>{" "}
            </p>
            <p className="text-[#707070] font-normal text-sm">
              <span className="text-2xl font-normal text-black">
                Order #1013
              </span>{" "}
              <br /> oct 14
            </p>
          </div>
          <button className="px-12.5 py-4 bg-transparent text-primary text-sm font-normal rounded-[55px] border border-[#DEDEDE]">
            Buy again
          </button>
        </div>
        <div className="flex items-start gap-5.5">
        <div className="max-w-162">
          <div className="rounded-3xl w-full bg-[#F5F5F5] p-5">
            <h4 className="text-xl font-semibold">Arrived Oct 14</h4>
            <p className="text-sm font-normal text-black">
              Oshodi Post{" "}
              <span className="text-primary">5316843216813206514</span>{" "}
            </p>
            <TimelineStep data={data} />
            <p className="text-sm font-normal mt-5 text-black">
              Haven't received your delivery?
              <span className="text-primary"> Let us know</span>{" "}
            </p>
          </div>
          <div className="rounded-3xl w-full bg-[#F5F5F5] mt-6.5 p-5">
            <h4 className="text-base font-normal mb-5.5">Order Details</h4>
            <div className="flex justify-between flex-row-reverse">
              <div className="w-1/2">
                <h5 className="text-[#707070] mb-2.5 text-sm font-normal">
                  Payment
                </h5>
                <p className="text-sm font-normal">
                  ending with 1234 - $185.36
                </p>
              </div>
              <div className="w-1/2">
                <h5 className="text-[#707070] mb-2.5 text-sm font-normal">
                  Contact information
                </h5>
                <p className="text-sm font-normal">
                  Kristin Watson <br />
                  k.watson@gmail.com{" "}
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-5">
              <div className="w-1/2">
                <h5 className="text-[#707070] mb-2.5 text-sm font-normal">
                  Shipping address
                </h5>
                <p className="text-sm w-2/3 font-normal">
                  Kristin Watson 1655 Island Pkwy Kamloops BC M7G 6F2 Canada
                </p>
              </div>
              <div className="w-1/2">
                <h5 className="text-[#707070] mb-2.5 text-sm font-normal">
                  Billing address
                </h5>
                <p className="text-sm w-2/3 font-normal">
                  Kristin Watson 1655 Island Pkwy Kamloops BC M7G 6F2 Canada
                </p>
              </div>
            </div>
          </div>
        </div>
        <RightHandSideOrderDetail />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;
