import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';

const StorefrontLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <CartDrawer />
    <div className="flex-grow">
      <Outlet />
    </div>
    <Footer />
    <FloatingWhatsApp />
  </div>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Storefront Routes */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="categories" element={<div className="p-8">Categories Management Coming Soon</div>} />
            <Route path="settings" element={<div className="p-8">Settings Coming Soon</div>} />
          </Route>
        </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
