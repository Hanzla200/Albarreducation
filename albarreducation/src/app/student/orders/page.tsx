/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getOrdersForUser } from "../../../services/contentService";
import { asArray, getField } from "../../../utils/strapi";
import Link from "next/link";
import { getStoredUser } from "../../../lib/auth";

export default function StudentOrdersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user?.email) {
      return;
    }

    getOrdersForUser()
      .then((data) => setItems(asArray(data)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            Order History
          </p>

          <h1 className="text-3xl font-bold text-accent mt-1">
            My Book Orders
          </h1>

          <p className="mt-1 text-gray-400">
            Track your book deliveries and past order history.
          </p>
        </div>

        <Link
          href="/student/books"
          className="btn btn-primary text-xs"
        >
          Browse Books
        </Link>
      </div>

      {loading ? (
        <p className="text-accent">Loading orders...</p>
      ) : items.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-gray-400 mb-4">
            You haven&apos;t placed any orders yet.
          </p>

          <Link
            href="/student/books"
            className="btn btn-primary inline-block"
          >
            Order Course Books
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item: any, idx: number) => {
            const name =
              getField(item, "name") ?? "Student";

            const bookTitle =
              getField(item, "booktitle") ?? "Book Order";

            const code =
              getField(item, "ordercode") ??
              "ALB" + (item.id ?? idx);

            const phone =
              getField(item, "phonenumber") ?? "N/A";

            const address =
              getField(item, "address") ??
              "Delivery Address";

            const id = item.id ?? idx;

            return (
              <div
                key={id}
                className="card border border-gray-800 bg-gray-900/90 flex flex-col md:flex-row md:items-center justify-between gap-3 p-5"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-white">
                      {bookTitle}
                    </h3>

                    <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
                      {code}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300">
                    Recipient: {name} ({phone})
                  </p>

                  <p className="text-xs text-gray-400">
                    Delivery To: {address}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                    Processing
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}