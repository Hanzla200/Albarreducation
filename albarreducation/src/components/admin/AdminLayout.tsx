"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import api from "../../services/api";
import { getStoredJwt, isAdminUser, logoutUser, setStoredUser } from "../../lib/auth";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Subjects", href: "/admin/subject" },
  { name: "Lectures", href: "/admin/lectures" },
  { name: "Notes", href: "/admin/notes" },
  { name: "Past Papers", href: "/admin/pastpapers" },
  { name: "Books", href: "/admin/books" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Reviews", href: "/admin/reviews" },
  { name: "Announcements", href: "/admin/announcements" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const jwt = getStoredJwt();
    if (!jwt) {
      window.location.href = "/login";
      return;
    }

    api.get("/users/me").then((response) => {
      setStoredUser(response.data);
      if (!isAdminUser(response.data)) {
        window.location.href = "/student";
      }
    }).catch(() => {
      logoutUser();
      window.location.href = "/login";
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200 p-6 hidden md:block border-r border-gray-800">
        <h1 className="text-2xl font-bold text-accent mb-8">Admin Panel</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md transition ${
                pathname === item.href
                  ? "bg-accent text-white font-semibold shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
