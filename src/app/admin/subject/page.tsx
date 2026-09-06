/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { CLASS_OPTIONS, createSubject, deleteItem, getSubjects } from "../../../services/contentService";
import { asArray, getField } from "../../../utils/strapi";

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [subjectname, setsubjectname] = useState("");
  const [classLevel, setClassLevel] = useState(CLASS_OPTIONS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const data = await getSubjects();
      setSubjects(asArray(data));
    } catch {
      setSubjects([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!subjectname.trim()) {
      setError("Subject name is required.");
      return;
    }

    setLoading(true);
    try {
      await createSubject(subjectname.trim(), classLevel);
      setsubjectname("");
      setClassLevel(CLASS_OPTIONS[0]);
      await loadData();
    } catch {
      setError("Failed to create subject.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteItem("subjects", id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete subject.");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-accent">Manage Subjects</h1>

      <form onSubmit={handleCreate} className="space-y-4 mb-6 max-w-xl bg-gray-850 p-4 rounded-xl border border-gray-750">
        <input
          type="text"
          placeholder="Subject Name (e.g. Mathematics, Physics)"
          value={subjectname}
          onChange={(e) => setsubjectname(e.target.value)}
          className="input w-full"
        />
        <select
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value)}
          className="input w-full"
        >
          {CLASS_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Adding..." : "Add Subject"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Existing Subjects ({subjects.length})</h2>
      {subjects.length === 0 ? (
        <p className="text-gray-400">No subjects yet.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((sub, idx) => {
            const name = getField(sub, "subjectname") ?? "Untitled";
            const level = getField(sub, "classlevel") ?? "Not set";
            const id = sub.id ?? idx;
            return (
              <div key={id} className="border border-gray-800 p-4 rounded-xl bg-gray-900/80 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-white text-lg">{name}</p>
                  <p className="text-sm text-cyan-400 mt-1">Class: {level}</p>
                </div>
                <button
                  onClick={() => handleDelete(id)}
                  className="btn btn-secondary mt-3 text-xs self-end"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
