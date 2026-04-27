import ProductCard from "../../../components/card/ProductCard";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/navbar/Navbar";
import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import Topbar from "../top-bar/Topbar";

const Dashboard = () => {
  const demoProducts = [
    { id: "demo-1", name: "Deanston 12 Year Old", price: 40000 },
    { id: "demo-2", name: "Single Malt Whisky", price: 38000 },
    { id: "demo-3", name: "London Dry Gin", price: 22000 },
    { id: "demo-4", name: "Premium Rum", price: 18000 },
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-[1200px] mx-auto py-10">
        <Topbar />

        <h4 className="text-2xl font-bold">Welcome Back, Sarah Johnson!</h4>

        <>
          <div className="flex items-center mt-2 gap-3">
            <button className="py-1.5 px-5 bg-transparent text-primary text-sm font-normal rounded-[55px] border border-[#DEDEDE]">
              Regular
            </button>
            <div className="flex items-center gap-0.5">
              <p className="text-primary underline">Upgrade Membership</p>
              <img src={ImagesAndIcons.crown} alt="" />
            </div>
          </div>
          <div className="border border-[#D8D8D8] rounded-3xl mt-9.5 p-6">
            <div className="flex items-center gap-1 mb-4">
              <img src={ImagesAndIcons.wineNdGleass} alt="" />
              <div>
                <h4 className="font-semibold text-2xl ">Upcoming Events</h4>
                <h4 className="text-base font-normal text-[#585858]">
                  Events Powered By Ile-Oti
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-6 w-full overflow-auto no-scrollbar">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#FAF9F7] p-6 rounded-[48px]">
                  <h4 className="text-2xl font-semibold mb-2">
                    Bordeaux Wine Tasting
                  </h4>
                  <p className="text-base font-normal my-4">
                    An exclusive tasting of premium Bordeaux wines with
                    sommelier Jean-Pierre
                  </p>
                  <p className="text-xs font-normal flex items-center gap-2 mb-2.5">
                    <img src={ImagesAndIcons.calendar} alt="" />
                    March 15, 2025 at 7:00PM
                  </p>
                  <p className="text-xs font-normal flex items-center gap-2 mb-4">
                    <img src={ImagesAndIcons.locationRed} alt="" />
                    Wine Cellar Illupeju
                  </p>
                  <p className="text-primary font-extrabold mb-6 text-xs">
                    {i} Spots Left
                  </p>
                  <button className="text-white bg-primary font-semibold w-full flex items-center justify-center py-4  rounded-[55px]">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>

        <div className="mt-2 max-w-196">
          <div className="bg-primary text-white text-base mb-6 font-medium flex justify-center items-center gap-1 rounded-[32px] py-1.5 w-46">
            VIP Member <img src={ImagesAndIcons.crown} alt="" />
          </div>
          <div className="border border-[#660033] bg-[#FDECEC] flex items-center justify-between rounded-3xl p-8">
            <div className="flex items-center gap-2">
              <img src={ImagesAndIcons.percentageSymbol} alt="" />
              <div>
                <h4 className="text-[#660033] font-bold text-2xl">
                  Exclusive Member Discount
                </h4>
                <p className="text-[#585858] text-base ">
                  15% off your next purchase
                </p>
              </div>
            </div>
            <button className="bg-primary rounded-[55px] px-10 py-3.5 text-white">Redeem Now</button>
          </div>
        </div>
        <h4 className="text-2xl font-bold mt-8">Personalized For You</h4>
        <div className="flex items-center gap-7.5">
          {demoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
