"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<unknown>;
  }
}

export default function GoogleAd({
  clientId,
}: {
  clientId?: string;
}) {
  const [adsLoaded, setAdsLoaded] = useState(false);

  const resolvedClientId =
    clientId ||
    (typeof window !== "undefined"
      ? localStorage.getItem("adsense_client") || ""
      : "") ||
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID ||
    "";

  useEffect(() => {
    if (!resolvedClientId) {
      return;
    }

    const existingScript = document.querySelector(
      `script[data-adsense-client="${resolvedClientId}"]`
    ) as HTMLScriptElement | null;

    const script =
      existingScript || document.createElement("script");

    const initializeAds = () => {
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
          setAdsLoaded(true);
        }
      } catch (error) {
        console.warn("Adsense load failed", error);
      }
    };

    if (!existingScript) {
      script.src =
        `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${resolvedClientId}`;

      script.async = true;
      script.crossOrigin = "anonymous";

      script.setAttribute(
        "data-adsense-client",
        resolvedClientId
      );

      script.addEventListener("load", initializeAds);

      document.body.appendChild(script);
    } else {
      initializeAds();
    }

    return () => {
      script.removeEventListener(
        "load",
        initializeAds
      );
    };
  }, [resolvedClientId]);

  if (!resolvedClientId) {
    return (
      <div className="google-ad-placeholder p-4 text-center">
        <h3 className="text-sm text-gray-400">
          Google Ad Slot
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          Set the AdSense client ID from the admin panel
          to enable the sidebar ad.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-25">
      <ins
        className="adsbygoogle google-ad-slot"
        style={{
          display: "block",
          width: "100%",
        }}
        data-ad-client={resolvedClientId}
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {!adsLoaded && (
        <div className="text-center text-xs text-slate-600 py-3">
          Advertisement
        </div>
      )}
    </div>
  );
}