/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { CLASS_OPTIONS, createBook, deleteItem, getBooks, getSubjects } from "../../../services/contentService";
import { asArray, getField, getRelationField } from "../../../utils/strapi";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [classLevel, setClassLevel] = useState(CLASS_OPTIONS[0]);
  const [subjectId, setSubjectId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [bData, sData] = await Promise.all([getBooks(), getSubjects()]);
      setBooks(asArray(bData));
      setSubjects(asArray(sData));
    } catch {
      setBooks([]);
      setSubjects([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !price.trim()) {
      return setError("Title and price are required.");
    }

    setLoading(true);
    try {
      await createBook(title.trim(), price.trim(), classLevel, Number(subjectId) || undefined, file || undefined);
      setTitle("");
      setPrice("");
      setClassLevel(CLASS_OPTIONS[0]);
      setSubjectId("");
      setFile(null);
      await loadData();
    } catch {
      setError("Failed to create book.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteItem("books", id);
      setBooks((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Failed to delete book.");
    }
  };

  const filteredSubjects = subjects.filter((subject) => {
    const level = getField(subject, "classlevel");
    return !level || level === classLevel;
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-accent">Manage Books</h1>

      <form onSubmit={handleCreate} className="space-y-4 mb-6 max-w-xl bg-gray-850 p-4 rounded-xl border border-gray-750">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Book title (e.g. Class 9 Mathematics)"
          className="input w-full"
        />
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (in PKR, e.g. 450)"
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
          <label className="text-xs text-gray-400 block mb-1">Book PDF / Cover file (optional):</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="input w-full"
          />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Uploading..." : "Create Book"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Books List ({books.length})</h2>
      {books.length === 0 ? (
        <p className="text-gray-400">No books found.</p>
      ) : (
        <ul className="space-y-3">
          {books.map((book, idx) => {
            const bTitle = getField(book, "title") ?? "Untitled";
            const bPrice = getField(book, "price") ?? "N/A";
            const bClass = getField(book, "classlevel") ?? "Not set";
            const bSub = getRelationField(book, "subject", "subjectname") ?? getField(book, "subjectName") ?? "None";
            const id = book.id ?? idx;

            return (
              <li key={id} className="border border-gray-800 p-4 rounded-xl bg-gray-900/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg text-white">{bTitle}</h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm">
                    <span className="text-cyan-400 font-medium">Price: PKR {bPrice}</span>
                    <span className="text-gray-400">Class: {bClass}</span>
                    <span className="text-gray-400">Subject: {bSub}</span>
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
