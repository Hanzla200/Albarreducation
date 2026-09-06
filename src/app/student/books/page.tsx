/* eslint-disable react-hooks/immutability */
 /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { CLASS_OPTIONS, getBooks } from "../../../services/contentService";
import { asArray, getField, getRelationField } from "../../../utils/strapi";
import { getCartStorageKey, getStoredUser } from "../../../lib/auth";

export default function StudentBooksPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    getBooks()
      .then((data) => setItems(asArray(data)))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (book: any) => {
    // Check if user is logged in
    const user = getStoredUser();

    if (!user) {
      // Guest user → send to login page
      window.location.href = "/login";
      return;
    }

    // Logged-in user → add book to cart
    const cartKey = getCartStorageKey(user);
    const existing = JSON.parse(localStorage.getItem(cartKey) || "[]");

    const payload = [...existing, book];

    localStorage.setItem(cartKey, JSON.stringify(payload));

    // Update navbar/cart count
    window.dispatchEvent(new Event("cart:updated"));

    // Show success message
    setAddedMessage(`"${getField(book, "title")}" added to cart!`);

    setTimeout(() => {
      setAddedMessage("");
    }, 3000);
  };

  const filtered = items.filter((book) => {
    if (selectedClass === "All") return true;

    return getField(book, "classlevel") === selectedClass;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            Student Library
          </p>

          <h1 className="text-3xl font-bold text-accent mt-1">
            Course Books & Guides
          </h1>

          <p className="mt-1 text-gray-400">
            Browse textbook solutions, keybooks, and study guides for all
            classes.
          </p>
        </div>
      </div>

      {/* Added to Cart Message */}
      {addedMessage && (
        <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 p-3 rounded-lg text-sm">
          ✅ {addedMessage}
        </div>
      )}

      {/* Class Level Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 font-medium">
          Filter by Class:
        </span>

        {/* All Classes */}
        <button
          onClick={() => setSelectedClass("All")}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            selectedClass === "All"
              ? "bg-cyan-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All Classes
        </button>

        {/* Classes */}
        {CLASS_OPTIONS.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedClass(c)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              selectedClass === c
                ? "bg-cyan-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-accent">Loading books...</p>
      ) : filtered.length === 0 ? (
        /* No Books */
        <div className="card">
          <p className="text-gray-400">
            No books found for this class.
          </p>
        </div>
      ) : (
        /* Books */
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item: any, idx: number) => {
            const title = getField(item, "title") ?? "Untitled";

            const price = getField(item, "price");

            const level =
              getField(item, "classlevel") ?? "General";

            const sub =
              getRelationField(item, "subject", "subjectname") ??
              getField(item, "subjectName") ??
              "";

            return (
              <div
                key={item.id ?? idx}
                className="card border border-gray-800 bg-gray-900/90 flex flex-col justify-between"
              >
                {/* Book Information */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {/* Class */}
                    <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      {level}
                    </span>

                    {/* Price */}
                    <span className="text-white font-bold text-base">
                      {price ? `PKR ${price}` : "On Request"}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-white">
                    {title}
                  </h2>

                  {/* Subject */}
                  {sub && (
                    <p className="text-xs text-gray-400 mt-1">
                      Subject: {sub}
                    </p>
                  )}
                </div>

                {/* Bottom */}
                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                  {/* Stock */}
                  <span className="text-xs text-emerald-400 font-medium">
                    In Stock
                  </span>

                  {/* Add To Cart */}
                  <button
                    onClick={() => addToCart(item)}
                    className="btn btn-primary text-xs py-1.5 px-3"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}