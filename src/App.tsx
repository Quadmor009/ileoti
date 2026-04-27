import "./App.css";
import { Route, Routes } from "react-router-dom";
import { routes } from "./shared/routes/routes";
import Home from "./pages/home/Home";
import Products from "./pages/products/Products";
import ProductDetailsPage from "./pages/product-details/ProductDetails";
import Checkout from "./pages/checkout/Checkout";
import BookAnEvent from "./pages/book-event/BookAnEvent";
import ContactUs from "./pages/contact-us/ContactUs";
import About from "./pages/about/About";
import Cart from "./pages/cart/Cart";
import Orders from "./pages/dashboard/orders/Orders";
import Profile from "./pages/dashboard/profile/Profile";
import OrderDetails from "./pages/dashboard/orders/OrderDetails";
import Dashboard from "./pages/dashboard/dashboard/Dashboard";
import AuthCallback from "./pages/auth-callback/AuthCallback";
import PaymentSuccess from "./pages/payment-success/PaymentSuccess";
import PaymentFailed from "./pages/payment-failed/PaymentFailed";
import MembershipSuccess from "./pages/membership-success/MembershipSuccess";
import { useState } from "react";
import AgeVerificationModal from "./components/age-verification/AgeVerificationModal";

function App() {
  const [ageVerified, setAgeVerified] = useState(
    () => localStorage.getItem("ageVerified") === "true",
  );
  const [ageDenied, setAgeDenied] = useState(false);

  const handleAgeConfirm = () => {
    localStorage.setItem("ageVerified", "true");
    setAgeVerified(true);
  };

  const handleAgeDeny = () => {
    setAgeDenied(true);
  };

  return (
    <>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path={routes.paymentSuccess} element={<PaymentSuccess />} />
        <Route path={routes.paymentFailed} element={<PaymentFailed />} />
        <Route
          path={routes.membershipSuccess}
          element={<MembershipSuccess />}
        />
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.products} element={<Products />} />
        <Route path={routes.productsDetails} element={<ProductDetailsPage />} />
        <Route path={routes.checkout} element={<Checkout />} />
        <Route path={routes.bookEvent} element={<BookAnEvent />} />
        <Route path={routes.contact} element={<ContactUs />} />
        <Route path={routes.about} element={<About />} />
        <Route path={routes.cart} element={<Cart />} />
        <Route path={routes.orders} element={<Orders />} />
        <Route path={routes.ordersDetails} element={<OrderDetails />} />
        <Route path={routes.profile} element={<Profile />} />
        <Route path={routes.dashboard} element={<Dashboard />} />
      </Routes>
      {!ageVerified ? (
        <AgeVerificationModal
          denied={ageDenied}
          onConfirm={handleAgeConfirm}
          onDeny={handleAgeDeny}
        />
      ) : null}
    </>
  );
}

export default App;
