/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  createOrder,
  deleteItem,
  getOrders,
} from "../../../services/contentService";
import { asArray, getField } from "../../../utils/strapi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [bookTitle, setBookTitle] = useState("");

  const [searchCode, setSearchCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(asArray(data));
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !phone || !address || !email) {
      return setError(
        "Name, phone, address, and email are required."
      );
    }

    setLoading(true);

    try {
      await createOrder(
        name.trim(),
        phone.trim(),
        address.trim(),
        email.trim(),
        bookTitle.trim() || undefined
      );

      setName("");
      setPhone("");
      setAddress("");
      setEmail("");
      setBookTitle("");

      await loadOrders();
    } catch {
      setError("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteItem("orders", id);

      setOrders((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch {
      setError("Failed to delete order.");
    }
  };

  /*
   * Filter orders by Order Code, customer name,
   * phone number, email, or book title.
   */
  const filteredOrders = orders.filter((order, idx) => {
    const code =
      getField(order, "ordercode") ??
      "ALB" + (order.id ?? idx);

    const customerName =
      getField(order, "name") ?? "";

    const customerPhone =
      getField(order, "phonenumber") ?? "";

    const customerEmail =
      getField(order, "email") ?? "";

    const customerBook =
      getField(order, "booktitle") ?? "";

    const search = searchCode.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return (
      String(code).toLowerCase().includes(search) ||
      String(customerName).toLowerCase().includes(search) ||
      String(customerPhone).toLowerCase().includes(search) ||
      String(customerEmail).toLowerCase().includes(search) ||
      String(customerBook).toLowerCase().includes(search)
    );
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-accent">
        Customer Orders
      </h1>

      {/* Create Order */}
      <form
        onSubmit={handleCreate}
        className="space-y-4 mb-6 max-w-xl bg-gray-850 p-4 rounded-xl border border-gray-750"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Customer Name"
          className="input w-full"
        />

        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number (e.g. +92 300 1234567)"
          className="input w-full"
        />

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Delivery Address"
          className="input w-full"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="input w-full"
        />

        <input
          type="text"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          placeholder="Book Title (optional)"
          className="input w-full"
        />

        {error && (
          <p className="text-danger text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Creating..." : "Create Order"}
        </button>
      </form>

      {/* Orders Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">
          All Orders ({orders.length})
        </h2>

        <input
          type="text"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="Search Order Code / Name / Phone..."
          className="input w-full md:w-80"
        />
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <p className="text-gray-400">
          No orders yet.
        </p>
      ) : filteredOrders.length === 0 ? (
        <div className="border border-gray-800 p-6 rounded-xl bg-gray-900/80 text-center">
          <p className="text-gray-400">
            No order found for &quot;{searchCode}&quot;.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredOrders.map((order, idx) => {
            const oName =
              getField(order, "name") ?? "Customer";

            const oPhone =
              getField(order, "phonenumber") ?? "N/A";

            const oEmail =
              getField(order, "email") ?? "N/A";

            const oAddr =
              getField(order, "address") ?? "N/A";

            const oBook =
              getField(order, "booktitle") ??
              "General Book Order";

            const oCode =
              getField(order, "ordercode") ??
              "ALB" + (order.id ?? idx);

            const id = order.id ?? idx;

            return (
              <li
                key={id}
                className="border border-gray-800 p-4 rounded-xl bg-gray-900/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  {/* Customer + Order Code */}
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-lg text-white">
                      {oName}
                    </h3>

                    <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs px-3 py-1 rounded-full font-mono font-bold">
                      Order: {oCode}
                    </span>
                  </div>

                  {/* Book */}
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-500">
                      Item:
                    </span>{" "}
                    {oBook}
                  </p>

                  {/* Phone + Email */}
                  <p className="text-gray-400 text-xs">
                    <span className="text-gray-500">
                      Phone:
                    </span>{" "}
                    {oPhone}
                    {" | "}
                    <span className="text-gray-500">
                      Email:
                    </span>{" "}
                    {oEmail}
                  </p>

                  {/* Address */}
                  <p className="text-gray-500 text-xs">
                    <span className="text-gray-400">
                      Address:
                    </span>{" "}
                    {oAddr}
                  </p>

                  {/* Order Code */}
                  <p className="text-xs text-cyan-400 font-mono">
                    Order Code: {oCode}
                  </p>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(id)}
                  className="btn btn-secondary text-xs self-end md:self-center"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </AdminLayout>
  );
}