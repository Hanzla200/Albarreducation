/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { CLASS_OPTIONS, createComment, getComments, getLectures } from "../../../services/contentService";
import { asArray, getField, getLectureLabel, getRelationField } from "../../../utils/strapi";

export default function StudentLecturesPage() {
  const [lectures, setLectures] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const [commentsByLecture, setCommentsByLecture] = useState<Record<string, any[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [commentError, setCommentError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLectures()
      .then(async (data) => {
        const list: any[] = asArray(data);
        setLectures(list);
        // Load initial comments for each lecture
        const initialComments: Record<string, any[]> = {};
        for (const l of list) {
          const id = String(l.id);
          initialComments[id] = asArray(await getComments(id));
        }
        setCommentsByLecture(initialComments);
      })
      .finally(() => setLoading(false));
  }, []);

  const submitComment = async (lectureId: string | number) => {
    const key = String(lectureId);
    const text = drafts[key] || "";
    if (!text.trim()) return;

    setCommentError("");
    try {
      const saved = await createComment(key, text.trim());
      setCommentsByLecture((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), saved],
      }));
      setDrafts((prev) => ({ ...prev, [key]: "" }));
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : "Unable to post comment.");
    }
  };

  const filtered = lectures.filter((lec: any) => {
    if (selectedClass === "All") return true;
    return getField(lec, "classlevel") === selectedClass;
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Student Portal</p>
        <h1 className="text-3xl font-bold text-accent mt-1">Video Lectures</h1>
        <p className="mt-1 text-gray-400">
          Watch comprehensive topic-by-topic lectures for Matric & FSC examinations.
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
        <p className="text-accent">Loading lectures...</p>
      ) : filtered.length === 0 ? (
        <div className="card">
          <p className="text-gray-400">No lectures found for the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((lecture: any, idx: number) => {
            const id = lecture.id ?? idx;
            const key = String(id);
            const label = getLectureLabel(lecture);
            const vurl = getField(lecture, "vediourls") ?? "";
            const level = getField(lecture, "classlevel") ?? "General";
            const sub = getRelationField(lecture, "subject", "subjectname") ?? getField(lecture, "subjectName") ?? "Subject";
            const comments = commentsByLecture[key] || [];

            return (
              <div key={id} className="card min-w-0 border border-gray-800 bg-gray-900/90 space-y-4">
                <div className="flex min-w-0 flex-col items-start justify-between gap-3 sm:flex-row">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-white">{label}</h2>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                      <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">{level}</span>
                      <span>Subject: {sub}</span>
                    </div>
                  </div>
                  {vurl && (
                    <a
                      href={vurl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn bg-cyan-600 hover:bg-cyan-500 text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <span>▶</span> Watch Video
                    </a>
                  )}
                </div>

                {/* Commenting area */}
                <div className="pt-3 border-t border-gray-800">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Discussion & Questions ({comments.length})
                  </h4>

                  <div className="space-y-2 mb-3">
                    {comments.map((c: any, i: number) => (
                      <div key={i} className="bg-gray-800/70 p-2.5 rounded-lg text-sm">
                        <div className="font-semibold text-cyan-300 text-xs">{c.userName || "Student"}</div>
                        <div className="text-gray-200 mt-0.5">{c.text}</div>
                        {getField(c, "reply") && (
                          <div className="mt-2 border-l-2 border-emerald-400 pl-2 text-emerald-200">
                            <span className="font-semibold text-xs">Admin reply: </span>
                            {getField(c, "reply")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                    <input
                      className="input min-w-0 flex-1 text-sm"
                      value={drafts[key] || ""}
                      onChange={(e) =>
                        setDrafts((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder="Ask a question or comment on this lecture..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitComment(id);
                      }}
                    />
                    <button
                      className="btn btn-primary w-full flex-none text-xs sm:w-auto"
                      onClick={() => submitComment(id)}
                    >
                      Post
                    </button>
                  </div>
                  {commentError && <p className="text-sm text-red-400">{commentError}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
