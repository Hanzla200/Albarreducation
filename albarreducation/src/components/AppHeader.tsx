/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCartStorageKey, getStoredJwt, getStoredUser, isAdminUser, logoutUser } from "../lib/auth";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Classes", href: "/student/classes" },
  { label: "Lectures", href: "/student/lectures" },
  { label: "Past Papers", href: "/student/pastpapers" },
  { label: "Books", href: "/student/books" },
  { label: "Contact", href: "/contact" },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuthAndCart = () => {
      const jwt = getStoredJwt();
      const stored = getStoredUser();
      if (jwt && stored) {
        setUser(stored);
      } else {
        setUser(null);
      }

      try {
        const cart = JSON.parse(localStorage.getItem(getCartStorageKey(stored)) || "[]");
        setCartCount(Array.isArray(cart) ? cart.length : 0);
      } catch {
        setCartCount(0);
      }
    };

    checkAuthAndCart();
    window.addEventListener("storage", checkAuthAndCart);
    window.addEventListener("cart:updated", checkAuthAndCart);

    return () => {
      window.removeEventListener("storage", checkAuthAndCart);
      window.removeEventListener("cart:updated", checkAuthAndCart);
    };
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  const dashboardUrl = isAdminUser(user) ? "/admin/dashboard" : "/student";

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#070b14]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
        <img src="/logo.png" alt="Albar Education Logo" className="h-12 w-12 rounded-xl object-contain"/>
        <div>
          <span className="text-lg font-bold tracking-tight text-white block">
            Albar Education
            </span>
                <span className="text-[10px] text-cyan-400 tracking-wider uppercase font-semibold block -mt-1">
                  Matric & FSC Hub
                  </span>
                  </div>
                  </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-3.5 py-1.5 text-sm font-semibold text-slate-200 hover:border-cyan-400/50 hover:text-white transition shadow-sm"
          >
            <span>🛒 Cart</span>
            <span className="rounded-full bg-cyan-500 text-slate-950 font-bold px-2 py-0.2 text-xs">
              {cartCount}
            </span>
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href={dashboardUrl}
                className="rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:opacity-95 shadow-md shadow-cyan-500/20"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/8 bg-[#090e1a] px-4 py-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/30"
                    : "bg-slate-900 text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-800 flex gap-2">
            {user ? (
              <>
                <Link
                  href={dashboardUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-lg bg-cyan-500 py-2 text-sm font-semibold text-slate-950"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 rounded-lg border border-red-500/40 bg-red-500/10 py-2 text-sm font-semibold text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 py-2 text-sm font-semibold text-cyan-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-lg bg-cyan-500 py-2 text-sm font-semibold text-slate-950"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
