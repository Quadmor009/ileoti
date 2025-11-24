import { BrowserRouter, Route, Routes } from "react-router-dom"
import { routes } from "./routes"
import Home from "../../pages/home/Home"
import Products from "../../pages/products/Products"
import ProductDetailsPage from "../../pages/product-details/ProductDetails"
import Checkout from "../../pages/checkout/Checkout"
import BookAnEvent from "../../pages/book-event/BookAnEvent"
import ContactUs from "../../pages/contact-us/ContactUs"
import Cart from "../../pages/cart/Cart"
import Orders from "../../pages/dashboard/orders/Orders"
import Profile from "../../pages/dashboard/profile/Profile"
import OrderDetails from "../../pages/dashboard/orders/OrderDetails"
import Dashboard from "../../pages/dashboard/dashboard/Dashboard"

const CentralNav = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.products} element={<Products />} />
        <Route path={routes.productsDetails} element={<ProductDetailsPage />} />
        <Route path={routes.checkout} element={<Checkout />} />
        <Route path={routes.bookEvent} element={<BookAnEvent />} />
        <Route path={routes.contact} element={<ContactUs />} />
        <Route path={routes.cart} element={<Cart />} />
        <Route path={routes.orders} element={<Orders />} />
        <Route path={routes.ordersDetails} element={<OrderDetails />} />
        <Route path={routes.profile} element={<Profile />} />
        <Route path={routes.dashboard} element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default CentralNav
