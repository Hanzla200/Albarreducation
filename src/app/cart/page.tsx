 /* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createOrder } from "../../services/contentService";
import { getField } from "../../utils/strapi";
import { getCartStorageKey, getStoredUser } from "../../lib/auth";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ==========================================
  // CHECK LOGIN + LOAD CART
  // ==========================================

  useEffect(() => {
    try {
      const user = getStoredUser();

      if (user) {
        setIsLoggedIn(true);

        if (user.username) {
          setName(user.username);
        }

        if (user.email) {
          setEmail(user.email);
        }

        // Load cart only for logged-in users
        const stored = JSON.parse(
          localStorage.getItem(getCartStorageKey(user)) || "[]"
        );

        setItems(Array.isArray(stored) ? stored : []);
      } else {
        setIsLoggedIn(false);
        setItems([]);
      }
    } catch {
      setIsLoggedIn(false);
      setItems([]);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  // ==========================================
  // REMOVE BOOK
  // ==========================================

  const removeFromCart = (index: number) => {
    const next = [...items];

    next.splice(index, 1);

    setItems(next);

    localStorage.setItem(
      getCartStorageKey(getStoredUser()),
      JSON.stringify(next)
    );

    window.dispatchEvent(
      new Event("cart:updated")
    );
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {
    setItems([]);

    localStorage.removeItem(getCartStorageKey(getStoredUser()));

    window.dispatchEvent(
      new Event("cart:updated")
    );
  };

  // ==========================================
  // CALCULATE TOTAL
  // ==========================================

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const priceStr =
        getField(item, "price") || "0";

      const num =
        parseFloat(priceStr) || 0;

      return sum + num;
    }, 0);
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const submitOrder = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Check login
    if (!isLoggedIn) {
      setMessage(
        "Please login before placing an order."
      );
      return;
    }

    // Check customer details
    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !email.trim()
    ) {
      setMessage(
        "Please fill in your name, phone number, address, and email."
      );
      return;
    }

    // Check cart
    if (items.length === 0) {
      setMessage(
        "Your cart is empty. Please add some books first."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // ==========================================
      // SAVE ORDERS TO STRAPI
      // ==========================================

      for (const item of items) {
        const title =
          getField(item, "title") ??
          "Book";

        const level =
          getField(item, "classlevel") ??
          "General";

        await createOrder(
          name.trim(),
          phone.trim(),
          address.trim(),
          email.trim(),
          title,
          level
        );
      }

      // ==========================================
      // CREATE BOOK DETAILS FOR WHATSAPP
      // ==========================================

      const bookDetails = items
        .map((item: any, index: number) => {
          const title =
            getField(item, "title") ??
            "Book";

          const price =
            getField(item, "price") ??
            "0";

          const level =
            getField(item, "classlevel") ??
            "General";

          return (
            `${index + 1}. ${title}\n` +
            `Class: ${level}\n` +
            `Price: PKR ${price}`
          );
        })
        .join("\n\n");

      // ==========================================
      // TOTAL
      // ==========================================

      const total = calculateTotal();

      // ==========================================
      // WHATSAPP MESSAGE
      // ==========================================

      const whatsappMessage =
        `📚 *NEW BOOK ORDER - AI Academy*\n\n` +

        `👤 *CUSTOMER DETAILS*\n` +
        `Name: ${name.trim()}\n` +
        `Email: ${email.trim()}\n` +
        `Phone: ${phone.trim()}\n` +
        `Address: ${address.trim()}\n\n` +

        `📖 *BOOKS ORDERED*\n\n` +
        `${bookDetails}\n\n` +

        `💰 *TOTAL: PKR ${total}*\n` +
        `💵 Payment: Cash on Delivery`;

      // ==========================================
      // YOUR WHATSAPP NUMBER
      // 03354630080
      // International format:
      // 923354630080
      // ==========================================

      const whatsappNumber =
        "923024665890";

      // ==========================================
      // CREATE WHATSAPP URL
      // ==========================================

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=` +
        encodeURIComponent(
          whatsappMessage
        );

      // ==========================================
      // CLEAR CART
      // ==========================================

      clearCart();

      setMessage(
        "🎉 Order placed successfully! Opening WhatsApp..."
      );

      // ==========================================
      // OPEN WHATSAPP
      // ==========================================

      window.location.href =
        whatsappUrl;

    } catch {
      setMessage("Order could not be completed. Your cart was kept; please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  // ==========================================
  // CHECKING LOGIN
  // ==========================================

  if (checkingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400">
          Checking login...
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">

          <div className="text-5xl mb-4">
            🛒
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Login Required
          </h1>

          <p className="text-gray-400 text-sm mb-6">
            Your shopping cart is available only
            to registered users. Please login to
            view your cart and place orders.
          </p>

          <Link
            href="/login"
            className="btn btn-primary w-full inline-block"
          >
            Login to Access Cart
          </Link>

          <p className="text-gray-500 text-sm mt-4">
            Do not have an account?
          </p>

          <Link
            href="/register"
            className="text-cyan-400 hover:underline text-sm"
          >
            Create an account
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // LOGGED-IN USER CART
  // ==========================================

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
          Checkout
        </p>

        <h1 className="text-3xl font-bold text-accent mt-1">
          Shopping Cart
        </h1>

        <p className="mt-1 text-gray-400">
          Review your selected books and place
          cash on delivery order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* =====================================
            CART ITEMS
        ====================================== */}

        <div className="lg:col-span-2 space-y-4">

          <div className="card">

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-xl font-bold text-white">
                Cart Items ({items.length})
              </h2>

              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-400 hover:underline"
                >
                  Clear Cart
                </button>
              )}

            </div>

            {/* EMPTY CART */}

            {items.length === 0 ? (

              <div className="text-center py-8">

                <p className="text-gray-400 mb-4">
                  Your cart is currently empty.
                </p>

                <Link
                  href="/student/books"
                  className="btn btn-primary text-sm inline-block"
                >
                  Explore Books
                </Link>

              </div>

            ) : (

              /* CART BOOKS */

              <ul className="space-y-3">

                {items.map(
                  (item: any, idx: number) => {

                    const title =
                      getField(
                        item,
                        "title"
                      ) ??
                      "Untitled Book";

                    const price =
                      getField(
                        item,
                        "price"
                      ) ??
                      "0";

                    const level =
                      getField(
                        item,
                        "classlevel"
                      ) ??
                      "General";

                    return (
                      <li
                        key={idx}
                        className="bg-gray-800/80 border border-gray-750 p-4 rounded-xl flex items-center justify-between gap-4"
                      >

                        <div>

                          <h3 className="font-semibold text-white">
                            {title}
                          </h3>

                          <div className="text-xs text-gray-400 mt-1">

                            Class: {level} |{" "}

                            <span className="text-cyan-400 font-semibold">
                              PKR {price}
                            </span>

                          </div>

                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(idx)
                          }
                          className="text-gray-400 hover:text-red-400 text-sm px-2 py-1"
                        >
                          ✕ Remove
                        </button>

                      </li>
                    );
                  }
                )}

              </ul>

            )}

            {/* TOTAL */}

            {items.length > 0 && (

              <div className="mt-6 pt-4 border-t border-gray-750 flex items-center justify-between">

                <span className="text-gray-300 font-medium">
                  Estimated Subtotal:
                </span>

                <span className="text-2xl font-bold text-cyan-400">
                  PKR {total}
                </span>

              </div>

            )}

          </div>

        </div>

        {/* =====================================
            DELIVERY DETAILS
        ====================================== */}

        <div className="card h-fit">

          <h2 className="text-xl font-bold text-accent mb-4">
            Delivery Details
          </h2>

          <form
            onSubmit={submitOrder}
            className="space-y-3"
          >

            {/* NAME */}

            <div>

              <label className="text-xs text-gray-400 block mb-1">
                Full Name
              </label>

              <input
                className="input w-full"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your Full Name"
                required
              />

            </div>

            {/* PHONE */}

            <div>

              <label className="text-xs text-gray-400 block mb-1">
                WhatsApp / Phone Number
              </label>

              <input
                className="input w-full"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="+92 300 1234567"
                required
              />

            </div>

            {/* ADDRESS */}

            <div>

              <label className="text-xs text-gray-400 block mb-1">
                Shipping Address
              </label>

              <input
                className="input w-full"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Complete Street Address & City"
                required
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="text-xs text-gray-400 block mb-1">
                Email Address
              </label>

              <input
                type="email"
                className="input w-full"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="name@example.com"
                required
              />

            </div>

            {/* PLACE ORDER */}

            <button
              type="submit"
              disabled={
                loading ||
                items.length === 0
              }
              className="btn btn-primary w-full mt-4"
            >
              {loading
                ? "Processing..."
                : "Place Order (Cash on Delivery)"}
            </button>

          </form>

          {/* MESSAGE */}

          {message && (

            <p className="mt-4 p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-cyan-200 text-sm">
              {message}
            </p>

          )}

        </div>

      </div>

    </div>
  );
}