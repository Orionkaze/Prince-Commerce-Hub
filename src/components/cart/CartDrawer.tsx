"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  X,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";

export function CartDrawer() {
  const { items, removeFromCart, clearCart, totalAmount, isCartOpen, closeCart } = useCart();
  const { user, signInWithGoogle, isConfigured } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      if (isConfigured) {
        await signInWithGoogle();
      } else {
        window.location.href = "/login";
      }
      return;
    }

    setIsCheckingOut(true);
    // Simulate payment / enrollment order processing
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      clearCart();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }, 1200);
  };

  const handleClose = () => {
    setOrderSuccess(false);
    closeCart();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#16141B]/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#ECE8FA] flex items-center justify-center text-[#5B32D6]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#16141B] tracking-tight">
                      Course Cart
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {items.length} {items.length === 1 ? "course" : "courses"} selected
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {orderSuccess ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                    </div>
                    <h4 className="text-2xl font-bold text-[#16141B]">
                      Enrollment Confirmed!
                    </h4>
                    <p className="text-sm text-neutral-600 leading-relaxed max-w-xs mx-auto">
                      Welcome to Prime Commerce Hub! Your course access has been activated in your Student Portal.
                    </p>
                    <div className="p-4 rounded-2xl bg-[#F7F7F9] text-xs text-neutral-700 text-left space-y-1.5 max-w-xs mx-auto">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Instant Access Granted</span>
                      </div>
                      <div>Batch coordinator will contact you via WhatsApp with Google Meet credentials.</div>
                    </div>
                    <div className="pt-2">
                      <Button variant="purple" onClick={handleClose}>
                        View Dashboard
                      </Button>
                    </div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#F7F7F9] text-neutral-400 flex items-center justify-center mx-auto">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-[#16141B]">
                      Your cart is empty
                    </h4>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                      Explore our Class 11 and Class 12 Accountancy batches to build conceptual clarity and score top marks.
                    </p>
                    <div className="pt-2">
                      <Button href="/courses" onClick={closeCart} variant="purple" size="md">
                        Browse Courses
                      </Button>
                    </div>
                  </div>
                ) : (
                  items.map(({ course }) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl border border-neutral-200/80 hover:border-[#5B32D6]/40 transition-colors flex gap-3.5 items-start bg-white"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#5B32D6] bg-[#ECE8FA] px-2 py-0.5 rounded">
                          {course.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#16141B] line-clamp-2 leading-snug">
                          {course.title}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-sm font-extrabold text-[#16141B]">
                            ₹{course.price.toLocaleString("en-IN")}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(course.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {!orderSuccess && items.length > 0 && (
                <div className="p-6 border-t border-neutral-100 bg-[#F7F7F9]/80 space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-500">
                      <span>Subtotal ({items.length} {items.length === 1 ? "course" : "courses"})</span>
                      <span className="font-semibold text-neutral-800">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>Taxes &amp; Digital Materials</span>
                      <span className="text-emerald-600 font-semibold">Included (₹0)</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-[#16141B] pt-2 border-t border-neutral-200/80">
                      <span>Total Amount</span>
                      <span className="text-base text-[#5B32D6]">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    {user ? (
                      <Button
                        variant="purple"
                        size="lg"
                        className="w-full justify-center cursor-pointer shadow-md"
                        onClick={handleCheckout}
                      >
                        {isCheckingOut ? "Enrolling..." : `Enroll Now • ₹${totalAmount.toLocaleString("en-IN")}`}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            closeCart();
                            window.location.href = "/login";
                          }}
                          className="w-full py-3 px-4 rounded-full bg-[#16141B] text-white hover:bg-neutral-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md cursor-pointer transition-all"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="#EA4335"
                              d="M12 5c1.54 0 2.94.53 4.04 1.57l3.03-3.03C17.24 1.8 14.8 1 12 1 7.42 1 3.51 3.6 1.63 7.37l3.69 2.87C6.2 7.42 8.87 5 12 5z"
                            />
                            <path
                              fill="#4285F4"
                              d="M23.49 12.28c0-.79-.07-1.54-.19-2.28H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.71-4.93 3.71-8.69z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.32 14.76c-.23-.68-.36-1.41-.36-2.16s.13-1.48.36-2.16L1.63 7.37C.6 9.42 0 11.64 0 12s.6 2.58 1.63 4.63l3.69-2.87z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.72-2.45 1.16-4.22 1.16-3.13 0-5.8-2.42-6.68-5.24L1.63 15.99C3.51 19.76 7.42 23 12 23z"
                            />
                          </svg>
                          <span>Sign In with Google to Complete Enrollment</span>
                        </button>
                        <p className="text-[11px] text-center text-neutral-500">
                          1-Click authentication with your Google account
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Secure Enrollment • 7-Day Money-Back Guarantee</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
