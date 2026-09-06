/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { CLASS_OPTIONS, getNotes } from "../../../services/contentService";
import { asArray, getField, getMediaUrl, getRelationField } from "../../../utils/strapi";
import { getStoredUser } from "../../../lib/auth";

export default function StudentNotesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStoredUser()) {
      window.location.href = "/login";
      return;
    }

    getNotes()
      .then((data) => setItems(asArray(data)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((note) => {
    if (selectedClass === "All") return true;
    return getField(note, "classlevel") === selectedClass;
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Study Materials</p>
        <h1 className="text-3xl font-bold text-accent mt-1">Revision Notes</h1>
        <p className="mt-1 text-gray-400">
          Handwritten formulas, chapter summaries, and solved short questions.
        </p>
      </div>

      {/* Class Level Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 font-medium">Filter by Class:</span>
        <button
          onClick={() => setSelectedClass("All")}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            selectedClass === "All"
              ? "bg-cyan-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All Classes
        </button>
        {CLASS_OPTIONS.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedClass(c)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              selectedClass === c
                ? "bg-cyan-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-accent">Loading notes...</p>
      ) : filtered.length === 0 ? (
        <div className="card">
          <p className="text-gray-400">No notes available for the selected filter.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((item: any, idx: number) => {
            const title = getField(item, "title") ?? "Untitled Note";
            const level = getField(item, "classlevel") ?? "General";
            const sub = getRelationField(item, "subject", "subjectname") ?? getField(item, "subjectName") ?? "";
            const mediaUrl = getMediaUrl(getField(item, "media"));

            return (
              <div
                key={item.id ?? idx}
                className="card border border-gray-800 bg-gray-900/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      {level}
                    </span>
                    {sub && <span className="text-xs text-gray-400 font-medium">Subject: {sub}</span>}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-xs text-cyan-400 font-medium">Verified Punjab Syllabus</span>
                  {mediaUrl ? (
                    <a href={mediaUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline">
                      Open File ↗
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500">File unavailable</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
