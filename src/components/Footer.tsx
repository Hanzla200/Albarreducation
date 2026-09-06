import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#060911] text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Albar Education logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-contain"
            />
            <div>
              <span className="block text-lg font-bold tracking-tight text-white">Albar Education</span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-cyan-400">Classes 9-12</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Empowering Pakistani Matric (Class 9-10) and FSC (Class 11-12) students with structured lectures, notes, books, and past papers.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Academic Portal
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/student/classes" className="hover:text-cyan-300">All Classes (9-12)</Link></li>
            <li><Link href="/student/lectures" className="hover:text-cyan-300">Video Lectures</Link></li>
            <li><Link href="/student/notes" className="hover:text-cyan-300">Formulas & Notes</Link></li>
            <li><Link href="/student/pastpapers" className="hover:text-cyan-300">Punjab Past Papers</Link></li>
            <li><Link href="/student/books" className="hover:text-cyan-300">Books & Keybooks</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Community & AI
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/chat" className="hover:text-cyan-300">AI Study Assistant</Link></li>
            <li>
              <a href="https://www.youtube.com/@sirsadam" target="_blank" rel="noreferrer" className="hover:text-cyan-300">
                YouTube: Sir Sadam
              </a>
            </li>
            <li>
              <a href="https://whatsapp.com/channel/0029VaEdyBSG3R3p7BU1C02e" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
                WhatsApp Channel
              </a>
            </li>
            <li>
              <a href="https://patreon.com/sirsadam" target="_blank" rel="noreferrer" className="hover:text-pink-400">
                Patreon Supporters
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Support & Account
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-cyan-300">Contact Us</Link></li>
            <li><Link href="/cart" className="hover:text-cyan-300">Cart & Checkout</Link></li>
            <li><Link href="/login" className="hover:text-cyan-300">Student Login</Link></li>
            <li><Link href="/register" className="hover:text-cyan-300">Create Account</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/6 py-6 bg-[#04060c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Albar Education. All rights reserved. Designed for Pakistani students.</span>
          <span>Powered by Next.js & Strapi v5</span>
        </div>
      </div>
    </footer>
  );
}
