import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import Topbar from "../top-bar/Topbar";
import OrderTabs from "./components/OrderTabs";
import { useState } from "react";
import OrderCompleted from "./OrderCompleted";
import OrderActive from "./OrderActive";



export default function Orders() {
  const [activeTab, setActiveTab] = useState("Active")

  return (
    <div>
      <Navbar />
      <div className="max-w-[1200px] mx-auto py-10">
      <Topbar />

        <OrderTabs setActiveTab={setActiveTab} activeTab={activeTab}/>

        {
          activeTab === "Active" && <OrderActive  />
        }

        {
          activeTab === "Completed" && <OrderCompleted />
        }
        

        <div className="text-sm border-[#DEDEDE] border-t pt-5 text-primary mt-10 space-x-4">
          <a href="#">Refund Policy</a>
          <a href="#">Shipping Policy</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
