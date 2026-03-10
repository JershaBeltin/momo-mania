import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

// ── Fallback data if backend is offline ──────────────────────
const FALLBACK_PRODUCTS = [
  // STEAMED
  { _id:'p1',  name:'Classic Veg Momo',    category:'Steamed',    price:120, rating:4.8, reviewCount:342, image:'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=75', description:'Delicate steamed dumplings with spiced vegetables & herbs',   badge:'Bestseller', isVeg:true  },
  { _id:'p2',  name:'Chicken Momo',        category:'Steamed',    price:149, rating:4.9, reviewCount:518, image:'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=75',   description:'Juicy minced chicken wrapped in paper-thin dough',            badge:'🔥 Hot',     isVeg:false },
  { _id:'p3',  name:'Cheese Corn Momo',    category:'Steamed',    price:135, rating:4.7, reviewCount:201, image:'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=75',  description:'Sweet corn & melted cheese blend — kids go crazy for it',     badge:'New',        isVeg:true  },
  { _id:'p4',  name:'Prawn Momo',          category:'Steamed',    price:179, rating:4.6, reviewCount:156, image:'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=400&q=75',    description:'Fresh tiger prawns with ginger-garlic steam-cooked to perfection', badge:'Premium', isVeg:false },
  // PAN-FRIED
  { _id:'p5',  name:'Kothey Momo',         category:'Pan-fried',  price:139, rating:4.8, reviewCount:289, image:'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=75', description:'Half-steamed, half-fried — crispy bottom, fluffy top',         badge:'Bestseller', isVeg:true  },
  { _id:'p6',  name:'Pan-fried Chicken',   category:'Pan-fried',  price:159, rating:4.7, reviewCount:203, image:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=75',  description:'Golden-bottom chicken dumplings with sesame crunch',           badge:'🔥 Hot',     isVeg:false },
  { _id:'p7',  name:'Crispy Veg Gyoza',    category:'Pan-fried',  price:129, rating:4.5, reviewCount:178, image:'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&q=75', description:'Japanese-style pan-fried veggie dumplings',                    badge:null,         isVeg:true  },
  { _id:'p8',  name:'Smash Burger Momo',   category:'Pan-fried',  price:169, rating:4.9, reviewCount:412, image:'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=75',    description:'Street-style flattened momo with burger patty filling',         badge:'Viral',      isVeg:false },
  // TANDOORI
  { _id:'p9',  name:'Tandoori Veg Momo',   category:'Tandoori',   price:149, rating:4.8, reviewCount:321, image:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=400&q=75', description:'Smoked in the clay oven with tandoor masala glaze',            badge:'Bestseller', isVeg:true  },
  { _id:'p10', name:'Tandoori Chicken Momo',category:'Tandoori',  price:169, rating:4.9, reviewCount:498, image:'https://images.unsplash.com/photo-1599487489310-5e103aa1ef8d?w=400&q=75', description:'Fiery red chicken momos with mint-yogurt dip',                 badge:'🔥 Spicy',   isVeg:false },
  { _id:'p11', name:'Achari Paneer Momo',  category:'Tandoori',   price:155, rating:4.6, reviewCount:187, image:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=75', description:'Pickled paneer filling with smoky tandoor char',               badge:'New',        isVeg:true  },
  { _id:'p12', name:'Tandoori Mutton Momo',category:'Tandoori',   price:199, rating:4.7, reviewCount:134, image:'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=75', description:'Rich minced mutton with royal spice blend',                    badge:'Premium',    isVeg:false },
  // JHOL MOMOS
  { _id:'p13', name:'Jhol Momo Classic',   category:'Jhol Momos', price:149, rating:5.0, reviewCount:623, image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=75',    description:'Floating in our secret spicy sesame-tomato broth',             badge:'⭐ No.1',    isVeg:true  },
  { _id:'p14', name:'Chicken Jhol Momo',   category:'Jhol Momos', price:169, rating:4.9, reviewCount:445, image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=75', description:'Chicken momos drowned in Nepali-style jhol achar',             badge:'🔥 Hot',     isVeg:false },
  { _id:'p15', name:'Jhol Momo Deluxe',    category:'Jhol Momos', price:189, rating:4.8, reviewCount:267, image:'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&q=75',    description:'Mixed momos in extra-spicy broth with crunch toppings',         badge:'Spicy 🌶️',  isVeg:false },
  { _id:'p16', name:'Vegan Jhol Momo',     category:'Jhol Momos', price:159, rating:4.7, reviewCount:192, image:'https://images.unsplash.com/photo-1559181567-c3190525afd8?w=400&q=75',    description:'Plant-based filling in rich tomato-cashew broth',              badge:'Vegan 🌿',   isVeg:true  },
  // SIDES
  { _id:'p17', name:'Momo Achar Combo',    category:'Sides',      price:59,  rating:4.9, reviewCount:812, image:'https://images.unsplash.com/photo-1587302164675-820fe61bbd55?w=400&q=75', description:'Our legendary house-made red & green chutneys',               badge:'Must Try',   isVeg:true  },
  { _id:'p18', name:'Fried Rice Bowl',     category:'Sides',      price:129, rating:4.5, reviewCount:234, image:'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=75', description:'Wok-tossed egg fried rice with scallions',                     badge:null,         isVeg:false },
  { _id:'p19', name:'Masala Chai',         category:'Sides',      price:49,  rating:4.8, reviewCount:567, image:'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=75', description:'Spiced Indian milk tea — the perfect momo companion',          badge:'☕ Classic',  isVeg:true  },
  { _id:'p20', name:'Sodha Lemon Soda',    category:'Sides',      price:69,  rating:4.6, reviewCount:198, image:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=75',    description:'Chilled Himalayan lemon soda with black salt',                 badge:'Refreshing', isVeg:true  },
];

const CATEGORIES = [
  { id: 'Steamed',    emoji: '🥟', desc: 'Classic hand-folded dumplings, steamed to cloud-soft perfection' },
  { id: 'Pan-fried',  emoji: '🍳', desc: 'Crispy-bottomed, golden-seared wonders that crunch on every bite' },
  { id: 'Tandoori',   emoji: '🔥', desc: 'Char-kissed in the clay oven, smothered in smoky spiced glory' },
  { id: 'Jhol Momos', emoji: '🍜', desc: 'Soupy, spicy, and soul-warming — Nepal\'s finest street obsession' },
  { id: 'Sides',      emoji: '🥤', desc: 'The perfect companions to complete your momo feast' },
];

export default function MenuPage({ showToast }) {
  const [products, setProducts]       = useState(FALLBACK_PRODUCTS);
  const [activeCategory, setActive]   = useState('All');
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${API}/products`)
      .then(({ data }) => { if (data.products?.length) setProducts(data.products); })
      .catch(() => { /* silently use fallback */ });
  }, [API]);

  const scrollTo = (catId) => {
    setActive(catId);
    if (catId === 'All') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(`cat-${catId.replace(/\s/g, '-')}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="menu-page">
      {/* Hero Banner */}
      <div className="menu-hero">
        <h1 className="menu-hero-title">THE FULL <span>MENU</span></h1>
        <p className="menu-hero-sub">20 handcrafted varieties across 5 legendary categories</p>
      </div>

      {/* Sticky Category Tabs */}
      <div className="category-bar">
        {['All', ...CATEGORIES.map(c => c.id)].map(t => (
          <button key={t} className={`cat-tab${activeCategory === t ? ' active' : ''}`} onClick={() => scrollTo(t)}>{t}</button>
        ))}
      </div>

      {/* Products */}
      <div className="menu-content">
        {CATEGORIES.map(cat => {
          const prods = products.filter(p => p.category === cat.id);
          if (prods.length === 0) return null;
          return (
            <div key={cat.id} className="cat-section" id={`cat-${cat.id.replace(/\s/g, '-')}`}>
              <div className="cat-title">{cat.emoji} {cat.id}</div>
              <p className="cat-desc">{cat.desc}</p>
              <div className="products-grid">
                {prods.map(p => <ProductCard key={p._id} product={p} showToast={showToast} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}