/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../services/api";
import {
  getAnnouncements,
  getBooks,
  getLectures,
  getNotes,
  getOrdersForUser,
  getPastPapers,
} from "../../services/contentService";
import ChatWidget from "../../components/ui/ChatWidget";
import GoogleAdBar from "../../components/ui/GoogleAdBar";
import { getCartStorageKey, getStoredJwt, getStoredUser, logoutUser } from "../../lib/auth";
import { asArray, getField, getLectureLabel } from "../../utils/strapi";

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadStudentData = async () => {
      const jwt = getStoredJwt();
      const localUser = getStoredUser();
      let currentUser = localUser;
      if (localUser) {
        setUser(localUser);
      }

      if (jwt) {
        try {
          const userRes = await api.get("/users/me");
          currentUser = userRes.data;
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } catch {
          // If token expired, proceed with local user or guest
        }
      }

      try {
        const [booksArr, lecturesArr, notesArr, announcementsArr, papersArr, ordersArr] =
          await Promise.all([
            getBooks(),
            getLectures(),
            getNotes(),
            getAnnouncements(),
            getPastPapers(),
            currentUser?.email ? getOrdersForUser(currentUser.email) : Promise.resolve([]),
          ]);

        setBooks(asArray(booksArr));
        setLectures(asArray(lecturesArr));
        setNotes(asArray(notesArr));
        setAnnouncements(asArray(announcementsArr));
        setPapers(asArray(papersArr));
        setOrders(asArray(ordersArr));
      } catch (err: any) {
        setError("Failed to load some dashboard data: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    const updateCartCount = () => {
      const savedCart = JSON.parse(localStorage.getItem(getCartStorageKey(getStoredUser())) || "[]");
      setCartCount(Array.isArray(savedCart) ? savedCart.length : 0);
    };

    updateCartCount();
    window.addEventListener("cart:updated", updateCartCount);
    loadStudentData();

    return () => {
      window.removeEventListener("cart:updated", updateCartCount);
    };
  }, []);

  const addToCart = (book: any) => {
    const cartKey = getCartStorageKey(user);
    const existing = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const payload = [...existing, book];
    localStorage.setItem(cartKey, JSON.stringify(payload));
    setCartCount(payload.length);
    window.dispatchEvent(new Event("cart:updated"));
  };

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-accent text-xl animate-pulse">Loading Student Dashboard...</p>
      </div>
    );
  }

  const latestAnnouncement =
    announcements.length > 0
      ? getField(announcements[0], "news") ?? "Welcome to Albar Education!"
      : null;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-accent">Student Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome, <span className="text-white font-medium">{user?.username || "Student"}</span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Link href="/student/classes" className="btn bg-cyan-600 hover:bg-cyan-700 text-sm">
            Classes
          </Link>
          <Link href="/profile" className="btn bg-blue-600 hover:bg-blue-700 text-sm">
            Profile
          </Link>
          <Link href="/cart" className="btn bg-purple-600 hover:bg-purple-700 text-sm">
            Cart ({cartCount})
          </Link>
          {user ? (
            <button onClick={handleLogout} className="btn bg-red-600 hover:bg-red-700 text-sm">
              Logout
            </button>
          ) : (
            <Link href="/login" className="btn btn-primary text-sm">
              Login
            </Link>
          )}
        </div>
      </div>

      {error && <p className="text-danger text-center bg-red-900/30 p-3 rounded-lg">{error}</p>}

      {/* Announcement Banner */}
      {latestAnnouncement && (
        <div className="bg-yellow-900/40 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow-sm">
          <h2 className="text-yellow-400 font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
            <span>📢</span> Latest Announcement
          </h2>
          <p className="text-yellow-100 mt-1 text-base">{latestAnnouncement}</p>
        </div>
      )}

      {/* Main Grid: Books and Lectures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Books Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-accent">📚 Books ({books.length})</h2>
            <Link href="/student/books" className="text-xs text-cyan-400 hover:underline">
              View all
            </Link>
          </div>
          {books.length > 0 ? (
            <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {books.map((book: any, idx: number) => {
                const bTitle = getField(book, "title") ?? "Untitled Book";
                const bPrice = getField(book, "price") ?? "N/A";
                const bClass = getField(book, "classlevel") ?? "General";
                return (
                  <li
                    key={book.id ?? idx}
                    className="bg-gray-800/80 border border-gray-750 p-3.5 rounded-lg flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-white">{bTitle}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Class: {bClass} | <span className="text-cyan-400 font-medium">PKR {bPrice}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(book)}
                      className="btn bg-cyan-600 hover:bg-cyan-500 text-xs py-1.5 px-3 flex-none"
                    >
                      + Cart
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400">No books available yet</p>
          )}
        </div>

        {/* Lectures Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-accent">🎓 Video Lectures ({lectures.length})</h2>
            <Link href="/student/lectures" className="text-xs text-cyan-400 hover:underline">
              View all
            </Link>
          </div>
          {lectures.length > 0 ? (
            <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {lectures.map((lecture: any, idx: number) => {
                const label = getLectureLabel(lecture);
                const vurl = getField(lecture, "vediourls") ?? "";
                const lClass = getField(lecture, "classlevel") ?? "General";
                return (
                  <li
                    key={lecture.id ?? idx}
                    className="bg-gray-800/80 border border-gray-750 p-3.5 rounded-lg space-y-1"
                  >
                    <div className="font-semibold text-white">{label}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Class: {lClass}</span>
                      {vurl && (
                        <a
                          href={vurl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline"
                        >
                          Watch Lecture ↗
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400">No lectures available yet</p>
          )}
          <div className="mt-6 pt-4 border-t border-gray-750">
            <h3 className="text-sm font-semibold text-accent mb-2">Ask AI Study Assistant</h3>
            <ChatWidget
              context={`Available Lectures: ${lectures.map((l: any) => getLectureLabel(l)).join("; ")}`}
            />
          </div>
        </div>
      </div>

      {/* Secondary Grid: Notes, Past Papers, Orders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-accent">📝 Notes ({notes.length})</h2>
            <Link href="/student/notes" className="text-xs text-cyan-400 hover:underline">
              View
            </Link>
          </div>
          {notes.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {notes.slice(0, 5).map((note: any, idx: number) => (
                <li key={note.id ?? idx} className="text-gray-300 text-sm bg-gray-800/50 p-2 rounded">
                  {getField(note, "title") ?? "Untitled Note"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No notes yet</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-accent">📄 Past Papers ({papers.length})</h2>
            <Link href="/student/pastpapers" className="text-xs text-cyan-400 hover:underline">
              View
            </Link>
          </div>
          {papers.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {papers.slice(0, 5).map((paper: any, idx: number) => (
                <li key={paper.id ?? idx} className="text-gray-300 text-sm bg-gray-800/50 p-2 rounded">
                  <span className="text-cyan-400 font-medium">{getField(paper, "boards")}</span> -{" "}
                  {getField(paper, "title") ?? "Paper"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No past papers yet</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-accent">🧾 Orders ({orders.length})</h2>
            <Link href="/student/orders" className="text-xs text-cyan-400 hover:underline">
              View
            </Link>
          </div>
          {orders.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {orders.slice(0, 5).map((order: any, idx: number) => (
                <li key={order.id ?? idx} className="text-gray-300 text-sm bg-gray-800/50 p-2 rounded">
                  {getField(order, "booktitle") ?? "Order"} -{" "}
                  <span className="text-cyan-400 font-mono">{getField(order, "ordercode") ?? "N/A"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No orders yet</p>
          )}
        </div>
      </div>

      {/* Ads & Quick Navigation */}
      <div className="card">
        <GoogleAdBar />
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-accent mb-4">📖 Study Resource Hub</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/student/classes"
            className="bg-indigo-600 hover:bg-indigo-700 p-4 rounded-xl text-center font-semibold text-white transition"
          >
            Choose Class
          </Link>
          <Link
            href="/student/notes"
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-center font-semibold text-white transition"
          >
            All Notes
          </Link>
          <Link
            href="/student/pastpapers"
            className="bg-green-600 hover:bg-green-700 p-4 rounded-xl text-center font-semibold text-white transition"
          >
            Past Papers
          </Link>
          <Link
            href="/student/announcements"
            className="bg-purple-600 hover:bg-purple-700 p-4 rounded-xl text-center font-semibold text-white transition"
          >
            Announcements
          </Link>
        </div>
      </div>
    </div>
  );
}
