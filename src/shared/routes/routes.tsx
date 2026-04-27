export const routes = {
    home: '/',
    products: '/products',
    /** Themed listing from “Explore our world” (slug → category when possible). */
    shopExplore: '/shop/:slug',
    productsDetails: '/products/:id',
    about: '/about',
    contact: '/contact-us',
    cart: '/cart',
    checkout: '/checkout',
    bookEvent: '/book-an-event',
    orders: '/dashboard/orders',
    ordersDetails: '/dashboard/orders/:id',
    profile: '/dashboard/profile',
    dashboard: '/dashboard',
    paymentSuccess: '/payment/success',
    paymentFailed: '/payment/failed',
    membershipSuccess: '/membership/success',
};