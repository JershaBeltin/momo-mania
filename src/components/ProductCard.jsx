import { useCart } from '../context/CartContext';

export default function ProductCard({ product, showToast }) {
  const { addToCart, updateQty, getQty } = useCart();
  const qty = getQty(product._id);

  const handleAdd = () => {
    addToCart({ ...product, img: product.image });
    showToast(`🥟 ${product.name} added!`);
  };

  return (
    <div className="product-card">
      {/* Image */}
      <div className="product-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=75'; }}
        />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <div className={`veg-dot ${product.isVeg ? 'veg' : 'non-veg'}`} />
      </div>

      {/* Body */}
      <div className="product-body">
        <div className="product-name">{product.name}</div>
        <div className="product-desc">{product.description}</div>
        <div className="product-footer">
          <div>
            <div className="product-rating">
              ⭐ {product.rating}
              <span className="product-reviews">({product.reviewCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span className="product-price">₹{product.price}</span>
              <span className="price-unit">/ plate</span>
            </div>
          </div>

          {qty === 0 ? (
            <button className="add-btn" onClick={handleAdd}>+</button>
          ) : (
            <div className="qty-control">
              <button className="qty-btn" onClick={() => updateQty(product._id, -1)}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => updateQty(product._id, +1)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}