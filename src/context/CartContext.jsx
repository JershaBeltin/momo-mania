import { createContext, useContext, useReducer, useState } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i._id === action.product._id);
      if (exists) return state.map(i => i._id === action.product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.product, qty: 1 }];
    }
    case 'UPDATE_QTY':
      return state
        .map(i => i._id === action.id ? { ...i, qty: i.qty + action.delta } : i)
        .filter(i => i.qty > 0);
    case 'REMOVE':
      return state.filter(i => i._id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart    = (product) => dispatch({ type: 'ADD', product });
  const updateQty    = (id, delta) => dispatch({ type: 'UPDATE_QTY', id, delta });
  const removeItem   = (id) => dispatch({ type: 'REMOVE', id });
  const clearCart    = () => dispatch({ type: 'CLEAR' });
  const getQty       = (id) => cart.find(i => i._id === id)?.qty || 0;
  const cartCount    = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal     = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, updateQty, removeItem, clearCart, getQty, cartCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);