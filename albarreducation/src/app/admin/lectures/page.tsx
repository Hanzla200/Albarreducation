/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { CLASS_OPTIONS, createLecture, deleteItem, getLectures, getSubjects } from "../../../services/contentService";
import { asArray, getField, getLectureLabel, getRelationField } from "../../../utils/strapi";

export default function AdminLecturesPage() {
  const [lectures, setLectures] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [classLevel, setClassLevel] = useState(CLASS_OPTIONS[0]);
  const [subjectId, setSubjectId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [lectureRes, subjectRes] = await Promise.all([getLectures(), getSubjects()]);
      setLectures(asArray(lectureRes));
      setSubjects(asArray(subjectRes));
    } catch {
      setLectures([]);
      setSubjects([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !videoUrl.trim()) {
      setError("Title and video URL are required.");
      return;
    }

    setLoading(true);
    try {
      await createLecture(title.trim(), videoUrl.trim(), classLevel, Number(subjectId) || undefined);
      setTitle("");
      setVideoUrl("");
      setClassLevel(CLASS_OPTIONS[0]);
      setSubjectId("");
      await loadData();
    } catch {
      setError("Failed to create lecture.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteItem("lectures", id);
      setLectures((current) => current.filter((lec) => lec.id !== id));
    } catch {
      setError("Failed to delete lecture.");
    }
  };

  const filteredSubjects = subjects.filter((subject) => {
    const level = getField(subject, "classlevel");
    return !level || level === classLevel;
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-accent">Manage Lectures</h1>

      <form onSubmit={handleCreate} className="space-y-4 mb-6 max-w-xl bg-gray-850 p-4 rounded-xl border border-gray-750">
        <input
          type="text"
          placeholder="Lecture Title (e.g. Chapter 1: Matrices & Determinants)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full"
        />
        <input
          type="text"
          placeholder="Video URL (YouTube or embed link)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
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
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Adding..." : "Add Lecture"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Lectures ({lectures.length})</h2>
      {lectures.length === 0 ? (
        <p className="text-gray-400">No lectures available yet.</p>
      ) : (
        <ul className="space-y-3">
          {lectures.map((lec, idx) => {
            const label = getLectureLabel(lec);
            const vurl = getField(lec, "vediourls") ?? "N/A";
            const level = getField(lec, "classlevel") ?? "Not set";
            const subName = getRelationField(lec, "subject", "subjectname") ?? getField(lec, "subjectName") ?? "None";
            const id = lec.id ?? idx;

            return (
              <li key={id} className="border border-gray-800 p-4 rounded-xl flex justify-between items-center bg-gray-900/80">
                <div className="space-y-1">
                  <p className="font-semibold text-white text-lg">{label}</p>
                  <p className="text-cyan-400 text-sm">Video: <a href={vurl} target="_blank" rel="noreferrer" className="underline hover:text-cyan-300">{vurl}</a></p>
                  <p className="text-gray-400 text-xs">Class: {level} | Subject: {subName}</p>
                </div>
                <button onClick={() => handleDelete(id)} className="btn btn-secondary text-xs">
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
