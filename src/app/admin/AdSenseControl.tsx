/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";

export default function AdSenseControl() {
  const [clientId, setClientId] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = localStorage.getItem("adsense_client") || "";
    setSaved(existing);
    setClientId(existing);
  }, []);

  const save = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem("adsense_client", clientId);
    setSaved(clientId);
    alert("AdSense client saved.");
  };

  const clear = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("adsense_client");
    setSaved("");
    setClientId("");
    alert("AdSense client cleared.");
  };

  return (
    <div className="space-y-3">
      <input className="input w-full" placeholder="ca-pub-XXXXXXXXXX" value={clientId} onChange={(e) => setClientId(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={save} className="btn bg-blue-600">Save</button>
        <button onClick={clear} className="btn bg-red-600">Clear</button>
        <div className="ml-auto text-sm text-gray-400">Current: <span className="text-accent">{saved || 'Not set'}</span></div>
      </div>
    </div>
  );
}
