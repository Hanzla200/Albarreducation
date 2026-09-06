/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { createAnnouncement, deleteItem, getAnnouncements } from "../../../services/contentService";
import { asArray, getField } from "../../../utils/strapi";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [news, setNews] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(asArray(data));
    } catch {
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!news.trim()) return setError("Announcement text is required.");

    setLoading(true);
    try {
      await createAnnouncement(news.trim());
      setNews("");
      await loadAnnouncements();
    } catch {
      setError("Failed to save announcement.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteItem("announcements", id);
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Failed to delete announcement.");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-accent">Manage Announcements</h1>

      <form onSubmit={handleCreate} className="space-y-4 mb-6 max-w-xl bg-gray-850 p-4 rounded-xl border border-gray-750">
        <textarea
          value={news}
          onChange={(e) => setNews(e.target.value)}
          placeholder="Type announcement message here..."
          className="input w-full min-h-[120px]"
        />
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Posting..." : "Create Announcement"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Live Announcements ({announcements.length})</h2>
      {announcements.length === 0 ? (
        <p className="text-gray-400">No announcements yet.</p>
      ) : (
        <ul className="space-y-3">
          {announcements.map((item, idx) => {
            const newsText = getField(item, "news") ?? "No text";
            const id = item.id ?? idx;

            return (
              <li key={id} className="border border-gray-800 p-4 rounded-xl bg-gray-900/80 flex items-start justify-between gap-4">
                <div>
                  <p className="text-gray-200 text-base">{newsText}</p>
                  <p className="text-xs text-gray-500 mt-2">ID: {id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(id)}
                  className="btn btn-secondary text-xs flex-none"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </AdminLayout>
  );
}
