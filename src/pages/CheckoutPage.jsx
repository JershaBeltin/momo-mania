import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart }  from '../context/CartContext';
import { useAuth }  from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL;

export default function CheckoutPage({ showToast, setAuthOpen }) {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [step, setStep]         = useState(1);
  const [payMethod, setMethod]  = useState('card');
  const [processing, setProc]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [orderId, setOrderId]   = useState('');

  const [addr, setAddr] = useState({
    name:  user?.name  || '',
    phone: user?.phone || '',
    line1: '',  line2: '', city: '', pin: '',
  });
  const [card, setCard] = useState({ number: '4242 4242 4242 4242', name: 'RADHIKA THAPA', expiry: '12/27', cvv: '•••' });

  const delivery = 40;
  const taxes    = Math.round(subtotal * 0.05);
  const total    = subtotal + delivery + taxes;

  const handlePayment = async () => {
    setProc(true);
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 2200));

    try {
      const orderPayload = {
        items: cart.map(i => ({ product: i._id, name: i.name, qty: i.qty })),
        deliveryAddress: addr,
        paymentMethod: payMethod,
      };
      // Try real API first, fallback to mock
      try {
        const { data } = await axios.post(`${API}/orders`, orderPayload);
        setOrderId(data.order.shortId || `MM${Date.now().toString().slice(-6)}`);
      } catch {
        setOrderId(`MM${Date.now().toString().slice(-6).toUpperCase()}`);
      }
    } finally {
      setProc(false);
      setSuccess(true);
      clearCart();
    }
  };

  const handleDone = () => { navigate('/'); showToast('🎉 Thanks for your order!'); };

  const STEPS = ['Review', 'Address', 'Payment'];

  if (cart.length === 0 && !success) {
    return (
      <div className="checkout-page" style={{ textAlign: 'center', paddingTop: '160px' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🛒</div>
        <h2 style={{ fontFamily: "'Bangers', cursive", fontSize: '48px', letterSpacing: '3px', marginBottom: '12px' }}>CART IS EMPTY</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '32px', fontWeight: 600 }}>Add some momos first!</p>
        <button className="btn-primary" onClick={() => navigate('/menu')}>Browse Menu →</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Steps bar */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className="step-item">
            <div className={`step-circle${step === i+1 ? ' active' : step > i+1 || success ? ' done' : ''}`}>
              {step > i+1 || success ? '✓' : i+1}
            </div>
            <div className={`step-label${step === i+1 ? ' active' : ''}`}>{s}</div>
          </div>
        ))}
      </div>

      {/* ── SUCCESS ── */}
      {success ? (
        <div className="success-screen">
          <span className="confetti-emoji">🎊</span>
          <div className="success-ring">🥟</div>
          <div className="success-title">ORDER PLACED!</div>
          <div className="success-msg">Your momos are being lovingly folded right now.</div>
          <div className="success-order">
            <div className="success-order-num">Order #{orderId}</div>
            <div className="success-eta">🛵 Arriving in 25–35 minutes</div>
          </div>
          <button className="btn-primary" onClick={handleDone}>Back to Home 🏠</button>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* Left: Step content */}
          <div>
            {/* STEP 1: Review */}
            {step === 1 && (
              <div className="checkout-card">
                <h2>🛒 REVIEW <span>YOUR ORDER</span></h2>
                {cart.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: '16px', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <img src={item.image || item.img} alt={item.name} style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>{item.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600 }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: '16px', color: 'var(--gold)' }}>₹{item.price * item.qty}</div>
                  </div>
                ))}
                <div className="btn-row">
                  <button className="next-btn" onClick={() => setStep(2)}>Continue to Address →</button>
                </div>
              </div>
            )}

            {/* STEP 2: Address */}
            {step === 2 && (
              <div className="checkout-card">
                <h2>📍 DELIVERY <span>ADDRESS</span></h2>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={addr.name} onChange={e => setAddr({ ...addr, name: e.target.value })} placeholder="Radhika Thapa" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={addr.phone} onChange={e => setAddr({ ...addr, phone: e.target.value })} placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 1</label>
                  <input className="form-input" value={addr.line1} onChange={e => setAddr({ ...addr, line1: e.target.value })} placeholder="House/Flat No., Street" />
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 2 (Optional)</label>
                  <input className="form-input" value={addr.line2} onChange={e => setAddr({ ...addr, line2: e.target.value })} placeholder="Landmark, Colony" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })} placeholder="Delhi" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">PIN Code</label>
                    <input className="form-input" value={addr.pin} onChange={e => setAddr({ ...addr, pin: e.target.value })} placeholder="110001" />
                  </div>
                </div>
                <div className="btn-row">
                  <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
                  <button className="next-btn" onClick={() => setStep(3)}>Continue to Payment →</button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div className="checkout-card">
                <h2>💳 <span>PAYMENT</span></h2>

                {/* Payment method toggle */}
                <div className="payment-methods">
                  {[['card', '💳 Card'], ['upi', '📱 UPI'], ['wallet', '👛 Wallet']].map(([id, label]) => (
                    <button key={id} className={`pay-method${payMethod === id ? ' active' : ''}`} onClick={() => setMethod(id)}>{label}</button>
                  ))}
                </div>

                {payMethod === 'card' && (
                  <>
                    {/* Visual card */}
                    <div className="card-visual">
                      <span className="card-chip">💳</span>
                      <div className="card-number">{card.number}</div>
                      <div className="card-bottom">
                        <div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '2px' }}>CARD HOLDER</div>
                          <div className="card-name">{card.name}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '2px' }}>EXPIRES</div>
                          <div className="card-expiry">{card.expiry}</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input className="form-input" value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cardholder Name</label>
                      <input className="form-input" value={card.name} onChange={e => setCard({ ...card, name: e.target.value.toUpperCase() })} />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Expiry (MM/YY)</label>
                        <input className="form-input" value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input className="form-input" type="password" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} maxLength={4} />
                      </div>
                    </div>
                  </>
                )}

                {payMethod === 'upi' && (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📱</div>
                    <div className="form-group" style={{ maxWidth: '320px', margin: '0 auto' }}>
                      <label className="form-label">UPI ID</label>
                      <input className="form-input" placeholder="yourname@upi" />
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600, marginTop: '12px' }}>You'll receive a payment request on your UPI app</p>
                  </div>
                )}

                {payMethod === 'wallet' && (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>👛</div>
                    <div style={{ fontFamily: "'Bangers', cursive", fontSize: '28px', color: 'var(--gold)' }}>Wallet Balance: ₹2,000</div>
                    <p style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 600, marginTop: '8px' }}>Sufficient balance available ✓</p>
                  </div>
                )}

                <div className="btn-row" style={{ marginTop: '24px' }}>
                  <button className="back-btn" onClick={() => setStep(2)}>← Back</button>
                  <button className="next-btn" style={{ flex: 1, opacity: processing ? 0.7 : 1 }} onClick={handlePayment} disabled={processing}>
                    {processing ? '⏳ Processing...' : `Pay ₹${total} →`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div>
            <div className="order-summary">
              <h3>📋 ORDER SUMMARY</h3>
              {cart.map(item => (
                <div key={item._id} className="summary-item">
                  <span>{item.name} × {item.qty}</span>
                  <span style={{ color: 'var(--white)' }}>₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="summary-item"><span>Subtotal</span><span style={{ color: 'var(--white)' }}>₹{subtotal}</span></div>
              <div className="summary-item"><span>Delivery</span><span style={{ color: 'var(--green)' }}>₹{delivery}</span></div>
              <div className="summary-item"><span>GST (5%)</span><span style={{ color: 'var(--white)' }}>₹{taxes}</span></div>
              <div className="summary-total">
                <span>Total</span>
                <span style={{ color: 'var(--gold)' }}>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}