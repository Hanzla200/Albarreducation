"use client";
import AdminLayout from "../../../components/admin/AdminLayout";
import dynamic from "next/dynamic";
const AdSenseControl = dynamic(() => import("../AdSenseControl"), { ssr: false });

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-accent">Admin Dashboard</h1>
      <p className="text-gray-400 mb-6">
        Welcome back, Admin! Manage lectures, notes, past papers, books, orders, reviews, and announcements from here.
      </p>

      <section className="mb-8 p-4 bg-gray-800/80 border border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold text-accent mb-3">Advertising / Google AdSense</h2>
        <p className="text-gray-400 mb-3 text-sm">
          Set the AdSense client ID to enable Google Ads for end users (e.g. ca-pub-XXXXXXXXXXXXX)
        </p>
        <AdSenseControl />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Subjects" href="/admin/subject" />
        <DashboardCard title="Lectures" href="/admin/lectures" />
        <DashboardCard title="Notes" href="/admin/notes" />
        <DashboardCard title="Past Papers" href="/admin/pastpapers" />
        <DashboardCard title="Books" href="/admin/books" />
        <DashboardCard title="Orders" href="/admin/orders" />
        <DashboardCard title="Reviews" href="/admin/reviews" />
        <DashboardCard title="Announcements" href="/admin/announcements" />
      </div>
    </AdminLayout>
  );
}

function DashboardCard({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="bg-gray-800/90 border border-gray-700 p-5 rounded-lg shadow-md text-center hover:bg-gray-700 hover:border-cyan-400/50 transition flex flex-col items-center justify-center min-h-[110px]"
    >
      <h2 className="text-xl font-semibold text-accent">{title}</h2>
      <p className="text-sm text-gray-400 mt-2">Manage {title.toLowerCase()}</p>
    </a>
  );
}
