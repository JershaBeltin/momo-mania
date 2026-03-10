import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function FloatingCart({ showToast }) {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  const delivery = subtotal > 0 ? 40 : 0;
  const taxes    = Math.round(subtotal * 0.05);
  const total    = subtotal + delivery + taxes;

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className={`cart-sidebar${cartOpen ? '' : ' closed'}`}>
      {/* Header */}
      <div className="cart-header">
        <div className="cart-title">YOUR <span>ORDER</span></div>
        <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
      </div>

      {/* Items */}
      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-emoji">🥟</div>
            <div className="cart-empty-text">Cart is empty</div>
            <p style={{ fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>
              Add some delicious momos to get started!
            </p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image || item.img} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">₹{item.price * item.qty}</div>
                <div className="cart-item-controls">
                  <button className="remove-btn" onClick={() => removeItem(item._id)}>Remove</button>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQty(item._id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item._id, +1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="cart-footer">
        <div className="cart-total-row">
          <span className="cart-total-label">Subtotal</span>
          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--white)' }}>₹{subtotal}</span>
        </div>
        <div className="cart-total-row">
          <span className="cart-total-label">Delivery</span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--green)' }}>
            {delivery === 0 ? '—' : `₹${delivery}`}
          </span>
        </div>
        <div className="cart-total-row">
          <span className="cart-total-label">GST (5%)</span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--white)' }}>
            {taxes === 0 ? '—' : `₹${taxes}`}
          </span>
        </div>
        <div className="cart-grand-total">
          <span style={{ fontWeight: 900, fontSize: '16px', color: 'var(--white)' }}>Total</span>
          <span style={{ fontWeight: 900, fontSize: '22px', color: 'var(--gold)' }}>₹{total}</span>
        </div>
        <div className="delivery-note">🛵 Estimated delivery: 25–35 minutes</div>
        <button
          className="checkout-btn"
          disabled={cart.length === 0}
          onClick={handleCheckout}
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}