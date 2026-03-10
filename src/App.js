import { Routes, Route } from 'react-router-dom';
import Navbar       from './components/Navbar';
import FloatingCart from './components/FloatingCart';
import Toast        from './components/Toast';
import HomePage     from './pages/HomePage';
import MenuPage     from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthModal    from './components/AuthModal';
import { useState } from 'react';
import { useCart }  from './context/CartContext';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast]       = useState(null);
  const { cartOpen, setCartOpen } = useCart();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <>
      <Navbar setAuthOpen={setAuthOpen} showToast={showToast} />

      <Routes>
        <Route path="/"         element={<HomePage  showToast={showToast} />} />
        <Route path="/menu"     element={<MenuPage  showToast={showToast} />} />
        <Route path="/checkout" element={<CheckoutPage showToast={showToast} setAuthOpen={setAuthOpen} />} />
      </Routes>

      <FloatingCart showToast={showToast} />

      {cartOpen && <div className="cart-overlay" onClick={() => setCartOpen(false)} />}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} showToast={showToast} />}

      <Toast message={toast} />
    </>
  );
}