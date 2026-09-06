/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredUser, isAdminUser } from "../lib/auth";
import GoogleAd from "./GoogleAd";

export default function AdSidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adsenseId, setAdsenseId] = useState("");

  useEffect(() => {
    try {
      const user = getStoredUser();
      setIsAdmin(isAdminUser(user));

      const ads =
        typeof window !== "undefined"
          ? localStorage.getItem("adsense_client") || ""
          : "";

      setAdsenseId(ads);
    } catch {
      setIsAdmin(false);
      setAdsenseId("");
    }
  }, []);

  return (
    <div className="space-y-5 sticky top-20">

      {/* Google Ad / Admin Controls */}
      {isAdmin ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
          <span className="font-bold text-cyan-300 block mb-1">
            AdSense Admin Controls
          </span>

          <span>
            AdSense Client ID:{" "}
            {adsenseId ? (
              <code className="text-white break-all">
                {adsenseId}
              </code>
            ) : (
              "Not configured yet"
            )}
          </span>

          <Link
            href="/admin/dashboard"
            className="block text-cyan-400 hover:underline mt-2"
          >
            Configure in Admin Panel →
          </Link>
        </div>
      ) : adsenseId ? (
        <div className="rounded-2xl overflow-hidden border border-white/8 bg-slate-950/60">
          <GoogleAd clientId={adsenseId} />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-white/8 bg-slate-950/60 p-4">
          <p className="text-xs text-slate-500 text-center">
            Advertisement
          </p>
        </div>
      )}

    </div>
  );
}