/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";

export default function GoogleAdBar() {
  const [adsenseId, setAdsenseId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdsenseId(localStorage.getItem("adsense_client") || "");
    }
  }, []);

  if (!adsenseId) {
    return (
      <div className="google-ad-placeholder">
        <h3>Google Ad Space</h3>
        <p>Set your AdSense client ID in the admin panel to activate this slot.</p>
      </div>
    );
  }

  return (
    <div className="google-ad-slot">
      <p className="text-sm text-gray-400">Google Ad Slot</p>
      <p className="font-semibold text-accent">ca-pub: {adsenseId}</p>
    </div>
  );
}
