"use client";
import Link from "next/link";
import { CLASS_OPTIONS } from "../../../services/contentService";

const classDescriptions: Record<string, string> = {
  "Class 9": "Matric Part 1: Real and complex numbers, matrices, kinematics, chemistry basics & programming.",
  "Class 10": "Matric Part 2: Quadratic equations, harmonic motion, chemical equilibrium & board past papers.",
  "Class 11": "FSc Part 1 / ICS: Trigonometry, vectors, stoichiometry, cell biology and computer networks.",
  "Class 12": "FSc Part 2 / ICS: Calculus, electromagnetism, organic chemistry, genetics & C++ programming.",
};

export default function StudentClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Class Navigator</p>
        <h1 className="text-3xl font-bold text-accent mt-1">Select Your Class Level</h1>
        <p className="mt-1 text-gray-400 max-w-2xl">
          Choose your grade level to access organized video lectures, revision notes, textbooks, and past papers tailored to Punjab Curriculum.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CLASS_OPTIONS.map((className) => {
          const desc = classDescriptions[className] || "Study materials, lectures, and past papers.";
          const isMatricOrFsc = className.includes("9") || className.includes("10") || className.includes("11") || className.includes("12");

          return (
            <div
              key={className}
              className="card border border-white/[0.08] hover:border-cyan-400/40 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
                    Punjab Board
                  </span>
                  {isMatricOrFsc && (
                    <span className="bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      Board Exam Prep
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">{className}</h2>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800/80 flex flex-wrap gap-2">
                <Link
                  href="/student/lectures"
                  className="rounded-lg bg-cyan-500/10 border border-cyan-500/25 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
                >
                  Lectures
                </Link>
                <Link
                  href="/student/notes"
                  className="rounded-lg bg-blue-500/10 border border-blue-500/25 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition"
                >
                  Notes
                </Link>
                <Link
                  href="/student/pastpapers"
                  className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
                >
                  Past Papers
                </Link>
                <Link
                  href="/student/books"
                  className="rounded-lg bg-purple-500/10 border border-purple-500/25 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition"
                >
                  Books
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
