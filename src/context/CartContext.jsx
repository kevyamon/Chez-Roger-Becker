/**
 * Contexte de gestion du panier d'achat avec persistance locale (localStorage).
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('rb_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryFee, setDeliveryFee] = useState(1000);

  useEffect(() => {
    try {
      localStorage.setItem('rb_cart_items', JSON.stringify(items));
    } catch {
      // Ignorer les erreurs d'ecriture localStorage
    }
  }, [items]);

  const addItem = (dish, quantity = 1, selectedOptions = []) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.dishId === (dish._id || dish.id));
      const effectivePrice = dish.promotionalPrice && dish.promotionalPrice < dish.price 
        ? dish.promotionalPrice 
        : dish.price;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          dishId: dish._id || dish.id,
          name: dish.name,
          price: effectivePrice,
          image: dish.image,
          quantity,
          selectedOptions
        }
      ];
    });
  };

  const updateQuantity = (dishId, delta) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.dishId === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (dishId) => {
    setItems((prev) => prev.filter((item) => item.dishId !== dishId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const total = useMemo(() => {
    return items.length > 0 ? subtotal + deliveryFee : 0;
  }, [subtotal, deliveryFee, items]);

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        deliveryFee,
        setDeliveryFee,
        total,
        totalCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit etre utilise au sein de CartProvider');
  }
  return context;
};
