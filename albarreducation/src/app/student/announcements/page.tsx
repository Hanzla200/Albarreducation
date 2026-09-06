/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getAnnouncements } from "../../../services/contentService";
import { asArray, getField } from "../../../utils/strapi";

export default function StudentAnnouncementsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncements()
      .then((data) => setItems(asArray(data)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Notice Board</p>
        <h1 className="text-3xl font-bold text-accent mt-1">Announcements & News</h1>
        <p className="mt-1 text-gray-400">
          Official platform updates, examination date-sheets, and syllabus notifications.
        </p>
      </div>

      {loading ? (
        <p className="text-accent">Loading announcements...</p>
      ) : items.length === 0 ? (
        <div className="card">
          <p className="text-gray-400">No announcements posted at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item: any, idx: number) => {
            const news = getField(item, "news") ?? "No text";
            const id = item.id ?? idx;
            const createdAt = getField(item, "createdAt") || new Date().toISOString();
            const dateStr = new Date(createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={id}
                className="card border-l-4 border-yellow-500 bg-gray-900/90 p-5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-yellow-400 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span>📢</span> Official Announcement
                  </span>
                  <span className="text-gray-400 font-normal">{dateStr}</span>
                </div>
                <p className="text-gray-100 text-base leading-relaxed">{news}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
