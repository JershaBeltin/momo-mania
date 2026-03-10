import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ setAuthOpen, showToast }) {
  const { cartCount, setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    showToast('👋 Logged out. See you soon!');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">MOMO🥟MANIA</Link>

      <div className="nav-links">
        <Link to="/"     className={`nav-link${location.pathname === '/'      ? ' active' : ''}`}>Home</Link>
        <Link to="/menu" className={`nav-link${location.pathname === '/menu'  ? ' active' : ''}`}>Menu</Link>
        <span className="nav-link">About</span>

        {user ? (
          <>
            <div className="user-pill" title={user.email}>
              <div className="user-avatar">{user.name[0].toUpperCase()}</div>
              {user.name.split(' ')[0]}
            </div>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <button className="signin-btn" onClick={() => setAuthOpen(true)}>Sign In</button>
        )}

        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          🛒 Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}