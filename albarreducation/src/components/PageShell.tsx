"use client";

import { usePathname } from "next/navigation";
import AdSidebar from "./AdSidebar";
import AppHeader from "./AppHeader";
import Footer from "./Footer";
import GeminiChat from "./GeminiChat";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgetpassword";

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background text-gray-200 flex flex-col">
        <AppHeader />

        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background text-gray-200 flex flex-col justify-between">
        <AppHeader />

        <main className="flex-1 flex items-center justify-center p-4">
          {children}
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-gray-200 flex flex-col">
      <AppHeader />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">

        {/* EXISTING PAGE CONTENT */}
        <main className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>

        {/* RIGHT SIDE - GOOGLE ADS */}
        <aside className="w-full lg:w-80 lg:flex-none">
          <AdSidebar />
        </aside>
      </div>

      <Footer />

      {/* LEFT SIDE - AI ASSISTANT */}
      <div className="fixed bottom-4 left-4 z-50 sm:bottom-6 sm:left-6">

        <details className="group">

          {/* SMALL AI BUTTON */}
          <summary
            className="
              ai-launcher
              list-none
              cursor-pointer
              w-14
              h-14
              rounded-full
              bg-indigo-600
              hover:bg-indigo-500
              text-white
              flex
              items-center
              justify-center
              shadow-2xl
              border
              border-indigo-400/30
              transition
              duration-200
              hover:scale-105
            "
            title="Open AI Study Assistant"
          >
            <span className="text-2xl">
              🤖
            </span>
          </summary>

          {/* GEMINI CHAT */}
          <div
              className="
              ai-chat-panel
              absolute
              left-0
              bottom-16
              w-[min(22rem,calc(100vw-2rem))]
              max-w-[calc(100vw-2rem)]
              max-h-[70vh]
              overflow-hidden
              rounded-2xl
              border
              border-indigo-500/20
              bg-slate-950
              shadow-2xl
            "
          >
            <GeminiChat />
          </div>

        </details>

      </div>
    </div>
  );
}