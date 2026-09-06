/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { createReview, deleteItem, getLectures, getReviews, updateItem } from "../../../services/contentService";
import { asArray, getField, getLectureLabel, getRelationField } from "../../../utils/strapi";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState("5");
  const [lectureId, setLectureId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | number | null>(null);

  const loadData = async () => {
    try {
      const [rData, lData] = await Promise.all([getReviews(), getLectures()]);
      setReviews(asArray(rData));
      setLectures(asArray(lData));
    } catch {
      setReviews([]);
      setLectures([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      return setError("Review text is required.");
    }

    setLoading(true);
    try {
      await createReview(text.trim(), rating, Number(lectureId) || undefined);
      setText("");
      setRating("5");
      setLectureId("");
      await loadData();
    } catch {
      setError("Failed to create review.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteItem("reviews", id);
      setReviews((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Failed to delete review.");
    }
  };

  const handleReply = async (id: number | string) => {
    const reply = replyDrafts[String(id)]?.trim();
    if (!reply) return;

    setReplyingId(id);
    try {
      await updateItem("reviews", id, { reply });
      setReplyDrafts((prev) => ({ ...prev, [String(id)]: "" }));
      await loadData();
    } catch {
      setError("Failed to save reply.");
    } finally {
      setReplyingId(null);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-accent">Student Reviews</h1>

      <form onSubmit={handleCreate} className="space-y-4 mb-6 max-w-xl bg-gray-850 p-4 rounded-xl border border-gray-750">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Student review / feedback text..."
          className="input w-full min-h-25"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select value={rating} onChange={(e) => setRating(e.target.value)} className="input w-full">
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>
          <select value={lectureId} onChange={(e) => setLectureId(e.target.value)} className="input w-full">
            <option value="">Select lecture (optional)</option>
            {lectures.map((lecture) => (
              <option key={lecture.id} value={lecture.id}>
                {getLectureLabel(lecture)}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Adding..." : "Add Review"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Student Comments and Reviews ({reviews.length})</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews found.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((rev, idx) => {
            const rText = getField(rev, "text") ?? "No review text";
            const rScore = getField(rev, "review") ?? 5;
            const reply = getField(rev, "reply");
            const author = getRelationField(rev, "users_permissions_user", "email") ?? getRelationField(rev, "users_permissions_user", "username");
            const id = rev.id ?? idx;

            return (
              <li key={id} className="border border-gray-800 p-4 rounded-xl bg-gray-900/80 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400 font-bold text-sm">
                      {"★".repeat(Math.min(5, Number(rScore) || 5))}
                    </span>
                    <span className="text-xs text-gray-400">({rScore}/5)</span>
                  </div>
                  <p className="text-gray-200 text-sm">{rText}</p>
                  {author && <p className="text-xs text-gray-500 mt-1">Posted by {author}</p>}
                  {reply && <p className="text-sm text-emerald-300 mt-2">Admin reply: {reply}</p>}
                  <div className="mt-3 flex gap-2">
                    <input
                      className="input text-sm flex-1"
                      value={replyDrafts[String(id)] || ""}
                      onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [String(id)]: e.target.value }))}
                      placeholder="Reply to this comment..."
                    />
                    <button
                      type="button"
                      onClick={() => handleReply(id)}
                      disabled={replyingId === id}
                      className="btn btn-primary text-xs"
                    >
                      {replyingId === id ? "Saving..." : "Reply"}
                    </button>
                  </div>
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
