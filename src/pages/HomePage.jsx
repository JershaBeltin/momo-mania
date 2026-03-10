import { useNavigate } from 'react-router-dom';

const TRENDING = [
  { _id: 'p1',  name: 'Classic Veg Momo',   price: 120, rating: 4.8, img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=75',   desc: 'Delicate steamed dumplings with spiced vegetables & herbs' },
  { _id: 'p13', name: 'Jhol Momo Classic',  price: 149, rating: 5.0, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=75', desc: 'Floating in our secret spicy sesame-tomato broth' },
  { _id: 'p5',  name: 'Kothey Momo',        price: 139, rating: 4.8, img: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=75', desc: 'Half-steamed, half-fried – crispy bottom, fluffy top' },
  { _id: 'p9',  name: 'Tandoori Veg Momo',  price: 149, rating: 4.8, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=400&q=75', desc: 'Smoked in the clay oven with tandoor masala glaze' },
];

const WHY_US = [
  { icon: '🥟', title: 'Hand-Crafted',    desc: 'Every dumpling folded fresh daily' },
  { icon: '🌶️', title: 'Authentic Spice', desc: 'Original Nepali recipes, zero shortcuts' },
  { icon: '⚡', title: '30 Min',          desc: 'Fastest delivery in the city' },
  { icon: '🌿', title: 'Fresh Always',    desc: 'Locally sourced, zero-frozen promise' },
];

export default function HomePage({ showToast }) {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-tag">🔥 Kathmandu's Finest Street Dumplings</div>
          <h1 className="hero-h1">DUMPLING<br /><span>OBSESSION</span></h1>
          <p className="hero-sub">
            20+ varieties of <em>hand-crafted momos</em> — steamed, fried,<br />
            tandoori &amp; drowned in our legendary jhol broth
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate('/menu')}>🥟 Order Now</button>
            <button className="btn-secondary" onClick={() => navigate('/menu')}>Explore Menu</button>
          </div>
          <div className="hero-stats">
            {[['20+', 'Varieties'], ['4.9★', 'Rating'], ['50K+', 'Orders'], ['30 min', 'Delivery']].map(([n, l]) => (
              <div key={l} className="stat">
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flame-divider" />

      {/* ── Trending Now ── */}
      <div style={{ background: 'linear-gradient(180deg, #1A0A00 0%, #0E0500 100%)' }}>
        <div className="section">
          <div className="section-eyebrow">🔥 What Everyone's Eating</div>
          <h2 className="section-title">TRENDING <span>NOW</span></h2>
          <div className="trending-grid">
            {TRENDING.map(p => (
              <div key={p._id} className="trending-card" onClick={() => navigate('/menu')}>
                <img src={p.img} alt={p.name} className="trending-img" />
                <div className="trending-body">
                  <div className="trending-name">{p.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px', fontWeight: 600 }}>{p.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--gold)' }}>₹{p.price}</span>
                    <span style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: 800 }}>⭐ {p.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Us ── */}
      <div className="why-banner">
        <h2 style={{ fontFamily: "'Bangers', cursive", fontSize: '56px', letterSpacing: '3px', color: 'white' }}>WHY MOMO MANIA?</h2>
        <div className="why-grid">
          {WHY_US.map(w => (
            <div key={w.title} className="why-item">
              <div className="why-icon">{w.icon}</div>
              <div className="why-title">{w.title}</div>
              <div className="why-desc">{w.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <Footer navigate={navigate} />
    </>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="footer-logo">MOMO🥟MANIA</div>
          <div className="footer-tagline">Kathmandu's finest street dumplings, delivered to your doorstep. Handcrafted with love, spice, and a whole lot of soul.</div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', fontSize: '22px' }}>
            {['📘', '📸', '🐦', '▶️'].map((i, k) => <span key={k} style={{ cursor: 'pointer', opacity: 0.7 }}>{i}</span>)}
          </div>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <span className="footer-link" onClick={() => navigate('/')}>Home</span>
          <span className="footer-link" onClick={() => navigate('/menu')}>Menu</span>
          <span className="footer-link">About Us</span>
          <span className="footer-link">Blog</span>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <span className="footer-link">📞 +91 98765-43210</span>
          <span className="footer-link">📧 hello@momomania.in</span>
          <span className="footer-link">📍 Lajpat Nagar, Delhi</span>
          <span className="footer-link">⏰ 11AM – 11PM Daily</span>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2024 MomoMania. Made with 🔥 in Delhi.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span className="footer-link">Privacy Policy</span>
          <span className="footer-link">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}