import Link from "next/link";
import GoogleAd from "../components/GoogleAd";

export const metadata = {
  title: "Albar Education | Matric & FSC Learning Platform",
  description:
    "Albar Education provides video lectures, notes, books, and past papers for Pakistani students of Matric (Class 9-10) and FSC (Class 11-12).",
};

const classes = [
  {
    name: "Class 9",
    desc: "Matric Part 1: Math, Physics, Chemistry, Biology & Computer",
    href: "/student/classes",
  },
  {
    name: "Class 10",
    desc: "Matric Part 2: Board Exam Preparation & Model Papers",
    href: "/student/classes",
  },
  {
    name: "Class 11",
    desc: "FSc Part 1 / ICS: Pre-Medical, Pre-Engineering & Computer Science",
    href: "/student/classes",
  },
  {
    name: "Class 12",
    desc: "FSc Part 2 / ICS: Calculus, Electromagnetism & Past Papers",
    href: "/student/classes",
  },
];

const features = [
  {
    icon: "🎯",
    title: "Punjab Board Syllabus",
    description:
      "Aligned with BISE Lahore, Rawalpindi, Faisalabad, Gujranwala, Multan, and all other Punjab educational boards.",
  },
  {
    icon: "🎥",
    title: "Topic-wise Video Lectures",
    description:
      "Clear, step-by-step conceptual lectures by experienced teachers like Sir Sadam for all difficult exercises.",
  },
  {
    icon: "📚",
    title: "Books & Solved Keybooks",
    description:
      "Order textbook solutions, objective MCQs guides, and theoretical materials with Cash on Delivery across Pakistan.",
  },
  {
    icon: "📄",
    title: "5-Year Past Papers",
    description:
      "Access categorized past papers by board, year, and subject to maximize your marks in board exams.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span>🇵🇰</span> Dedicated to Pakistani Students
          </div>

          <h1>Study Smarter for Matric &amp; FSC Board Exams</h1>

          <p>
            Albar Education delivers structured video lectures, chapter
            notes, textbooks, and past papers for Class 9, 10, 11, and 12
            across Pakistan.
          </p>

          <div className="hero-actions">
            <Link
              href="/student/classes"
              className="btn btn-primary text-base px-6 py-3"
            >
              Explore Classes 🚀
            </Link>

            <Link
              href="/student/lectures"
              className="btn btn-secondary text-base px-6 py-3"
            >
              Watch Lectures 📺
            </Link>

            <Link
              href="/student/pastpapers"
              className="btn btn-secondary text-base px-6 py-3"
            >
              Past Papers 📄
            </Link>
          </div>
        </div>
      </section>

      {/* Class Level Quick Select Cards */}
      <section className="space-y-6">
        <div className="section-title">
          <span className="eyebrow">Choose Your Level</span>
          <h2>Select Your Class to Start Learning</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classes.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="card border border-white/8 hover:border-cyan-400/50 p-6 flex flex-col justify-between group no-underline"
            >
              <div>
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase block mb-2">
                  Punjab Curriculum
                </span>

                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition">
                  {c.name}
                </h3>

                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center text-sm font-semibold text-cyan-400 group-hover:translate-x-1 transition">
                <span>View Study Material →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="space-y-6">
        <div className="section-title">
          <span className="eyebrow">Comprehensive Platform</span>
          <h2>Everything You Need to Ace Your Board Exams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card border border-white/8 p-6 space-y-3"
            >
              <div className="text-3xl">{feature.icon}</div>

              <h3 className="text-xl font-bold text-white">
                {feature.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <div className="section-title">
          <span className="eyebrow">Simple Workflow</span>
          <h2>How Albar Education Accelerates Your Studies</h2>
        </div>

        <div className="work-grid">
          <article className="work-card">
            <span className="work-step">1</span>

            <h3>Pick Class &amp; Subject</h3>

            <p>
              Select your class (9, 10, 11, 12) and subject like Mathematics
              or Physics to access organized topics.
            </p>
          </article>

          <article className="work-card">
            <span className="work-step">2</span>

            <h3>Watch &amp; Practice</h3>

            <p>
              Watch step-by-step video solutions, read concise formula
              summaries, and review solved short questions.
            </p>
          </article>

          <article className="work-card">
            <span className="work-step">3</span>

            <h3>Solve Past Papers</h3>

            <p>
              Test your knowledge with 5-year Punjab board past papers and
              prepare effectively for your board examinations.
            </p>
          </article>
        </div>
      </section>

      {/* Community & Advertisement */}
      <section className="ad-chat-section space-y-6">
        <div className="section-title">
          <span className="eyebrow">Student Community</span>
          <h2>Learn, Practice &amp; Stay Connected</h2>
        </div>

        <div className="ad-chat-grid">
          <div className="card border border-cyan-500/30 bg-cyan-950/20 p-6 space-y-3">
            <h3 className="text-lg font-bold text-white">
              Need Personal Mentorship?
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Connect directly with Sir Sadam on YouTube and join our
              official WhatsApp student study group.
            </p>

            <a
              href="https://whatsapp.com/channel/0029VaEdyBSG3R3p7BU1C02e"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary text-xs w-full py-2.5"
            >
              Join WhatsApp Group 💬
            </a>
            <a
              href="https://www.youtube.com/@sirsadam"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary text-xs w-full py-2.5"
            >
              Join our youtube channel 💬
            </a>
            <a
              href="https://patreon.com/sirsadam"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary text-xs w-full py-2.5"
            >
              Join us patreon 💬
            </a>
          </div>

          <div className="card">
            <GoogleAd />
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="footer-cta">
        <div className="cta-card p-8 sm:p-12">
          <h2>Ready to Supercharge Your Academic Success?</h2>

          <p>
            Join thousands of Pakistani students studying smarter with Albar
            Education. Create a free account today to track your progress and
            order books.
          </p>

          <div className="hero-actions">
            <Link
              href="/register"
              className="btn btn-primary text-base px-6 py-3"
            >
              Create Free Student Account
            </Link>

            <Link
              href="/login"
              className="btn btn-secondary text-base px-6 py-3"
            >
              Student Login
            </Link>
          </div>

          <div className="footer-links">
            <a
              href="https://www.youtube.com/@sirsadam"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              YouTube: Sir Sadam
            </a>

            <a
              href="https://whatsapp.com/channel/0029VaEdyBSG3R3p7BU1C02e"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              WhatsApp Community
            </a>

            <a
              href="https://patreon.com/sirsadam"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Patreon
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}