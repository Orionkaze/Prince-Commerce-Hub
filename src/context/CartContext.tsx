"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Course, CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  totalAmount: number;
  itemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  isInCart: () => false,
  totalAmount: 0,
  itemCount: 0,
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
});

const CART_STORAGE_KEY = "prime_commerce_cart_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, mounted]);

  const addToCart = (course: Course) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.course.id === course.id);
      if (exists) return prev;
      return [...prev, { course, addedAt: new Date().toISOString() }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (courseId: string) => {
    setItems((prev) => prev.filter((item) => item.course.id !== courseId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (courseId: string) => {
    return items.some((item) => item.course.id === courseId);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.course.price, 0);
  const itemCount = items.length;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        totalAmount,
        itemCount,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
