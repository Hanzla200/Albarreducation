/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { CLASS_OPTIONS, createPastPaper, deleteItem, getPastPapers, getSubjects } from "../../../services/contentService";
import { asArray, getField, getRelationField } from "../../../utils/strapi";

const BOARD_OPTIONS = [
  "BISE Lahore",
  "BISE Rawalpindi",
  "BISE Faisalabad",
  "BISE Gujranwala",
  "BISE Multan",
  "BISE Sargodha",
  "BISE Bahawalpur",
  "BISE DG Khan",
  "BISE Sahiwal",
];

export default function AdminPastPapersPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [boards, setBoards] = useState(BOARD_OPTIONS[0]);
  const [classLevel, setClassLevel] = useState(CLASS_OPTIONS[0]);
  const [subjectId, setSubjectId] = useState("");
  const [year, setYear] = useState("2024");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [pData, sData] = await Promise.all([getPastPapers(), getSubjects()]);
      setPapers(asArray(pData));
      setSubjects(asArray(sData));
    } catch {
      setPapers([]);
      setSubjects([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !boards) {
      return setError("Title and board are required.");
    }

    setLoading(true);
    try {
      await createPastPaper(
        title.trim(),
        boards,
        classLevel,
        Number(subjectId) || undefined,
        file || undefined,
        Number(year) || undefined
      );
      setTitle("");
      setBoards(BOARD_OPTIONS[0]);
      setClassLevel(CLASS_OPTIONS[0]);
      setSubjectId("");
      setYear("2024");
      setFile(null);
      await loadData();
    } catch {
      setError("Failed to create past paper.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteItem("past-papers", id);
      setPapers((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Failed to delete past paper.");
    }
  };

  const filteredSubjects = subjects.filter((subject) => {
    const level = getField(subject, "classlevel");
    return !level || level === classLevel;
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-accent">Manage Past Papers</h1>

      <form onSubmit={handleCreate} className="space-y-4 mb-6 max-w-xl bg-gray-850 p-4 rounded-xl border border-gray-750">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Past paper title (e.g. Mathematics Past Paper 2024 Group 1)"
          className="input w-full"
        />
        <select
          value={boards}
          onChange={(e) => setBoards(e.target.value)}
          className="input w-full"
        >
          {BOARD_OPTIONS.map((board) => (
            <option key={board} value={board}>{board}</option>
          ))}
        </select>
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
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year (e.g. 2024)"
          className="input w-full"
        />
        <div>
          <label className="text-xs text-gray-400 block mb-1">Past Paper PDF file (optional):</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="input w-full"
          />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Adding..." : "Create Past Paper"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Past Papers List ({papers.length})</h2>
      {papers.length === 0 ? (
        <p className="text-gray-400">No past papers found.</p>
      ) : (
        <ul className="space-y-3">
          {papers.map((paper, idx) => {
            const pTitle = getField(paper, "title") ?? "Untitled";
            const pBoard = getField(paper, "boards") ?? "Unknown Board";
            const pClass = getField(paper, "classlevel") ?? "Not set";
            const pYear = getField(paper, "year") ?? "N/A";
            const pSub = getRelationField(paper, "subject", "subjectname") ?? getField(paper, "subjectName") ?? "None";
            const id = paper.id ?? idx;

            return (
              <li key={id} className="border border-gray-800 p-4 rounded-xl bg-gray-900/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg text-white">{pTitle}</h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-400">
                    <span className="text-cyan-400 font-medium">{pBoard}</span>
                    <span>Class: {pClass}</span>
                    <span>Year: {pYear}</span>
                    <span>Subject: {pSub}</span>
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
