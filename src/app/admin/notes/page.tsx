/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { CLASS_OPTIONS, createNote, deleteItem, getNotes, getSubjects } from "../../../services/contentService";
import { asArray, getField, getRelationField } from "../../../utils/strapi";

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [classLevel, setClassLevel] = useState(CLASS_OPTIONS[0]);
  const [subjectId, setSubjectId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [nData, sData] = await Promise.all([getNotes(), getSubjects()]);
      setNotes(asArray(nData));
      setSubjects(asArray(sData));
    } catch {
      setNotes([]);
      setSubjects([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      return setError("Note title is required.");
    }

    setLoading(true);
    try {
      await createNote(title.trim(), classLevel, Number(subjectId) || undefined, file || undefined);
      setTitle("");
      setClassLevel(CLASS_OPTIONS[0]);
      setSubjectId("");
      setFile(null);
      await loadData();
    } catch {
      setError("Failed to create note.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteItem("notes", id);
      setNotes((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Failed to delete note.");
    }
  };

  const filteredSubjects = subjects.filter((subject) => {
    const level = getField(subject, "classlevel");
    return !level || level === classLevel;
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-accent">Manage Notes</h1>

      <form onSubmit={handleCreate} className="space-y-4 mb-6 max-w-xl bg-gray-850 p-4 rounded-xl border border-gray-750">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title (e.g. Chapter 1: Formulas & Summary)"
          className="input w-full"
        />
        <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="input w-full">
          {CLASS_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="input w-full"
        >
          <option value="">Select subject (optional)</option>
          {filteredSubjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {getField(subject, "subjectname")}
            </option>
          ))}
        </select>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Notes PDF / Attachment (optional):</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="input w-full"
          />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Adding..." : "Create Note"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Notes List ({notes.length})</h2>
      {notes.length === 0 ? (
        <p className="text-gray-400">No notes found.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note, idx) => {
            const nTitle = getField(note, "title") ?? "Untitled";
            const nClass = getField(note, "classlevel") ?? "Not set";
            const nSub = getRelationField(note, "subject", "subjectname") ?? getField(note, "subjectName") ?? "None";
            const id = note.id ?? idx;

            return (
              <li key={id} className="border border-gray-800 p-4 rounded-xl bg-gray-900/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg text-white">{nTitle}</h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-400">
                    <span className="text-cyan-400">Class: {nClass}</span>
                    <span>Subject: {nSub}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(id)}
                  className="btn btn-secondary text-xs self-end md:self-center"
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
