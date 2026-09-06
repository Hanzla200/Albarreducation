import Link from "next/link";
import GeminiChat from "../../components/GeminiChat";
import GoogleAd from "../../components/GoogleAd";

export const metadata = {
  title: "AI Study Chat | Albar Education",
  description:
    "Ask questions and get answers from Albar Education AI.",
};

export default function ChatPage() {
  return (
    <main className="page-shell">

      <header className="topbar">

        <div className="brand">
          Albar Education
        </div>

        <nav className="topnav">

          <Link href="/">
            Home
          </Link>

          <Link href="/login">
            Login
          </Link>

          <Link href="/register">
            Register
          </Link>

        </nav>

      </header>

      <section className="section">

        <div className="section-title">

          <span className="eyebrow">
            AI Study Assistant
          </span>

          <h1>
            Ask Albar AI
          </h1>

          <p>
            Get help with Mathematics, Physics,
            Chemistry, Computer Science,
            Programming and more.
          </p>

        </div>

        <div className="chat-page-grid">

          <div className="chat-main card">
            <GeminiChat />
          </div>

          <div className="chat-side card">

            <div className="ad-card">
              <GoogleAd />
            </div>

            <div
              className="chat-info card"
              style={{
                marginTop: "1rem",
              }}
            >

              <h3>
                How to use Albar AI
              </h3>

              <p>
                Ask your question naturally.
                You can also ask follow-up questions
                because the conversation history is
                sent to Gemini.
              </p>

              <div className="mt-4 space-y-2 text-sm">

                <p>✓ Mathematics</p>
                <p>✓ Physics</p>
                <p>✓ Chemistry</p>
                <p>✓ Biology</p>
                <p>✓ Computer Science</p>
                <p>✓ Programming</p>
                <p>✓ Artificial Intelligence</p>
                <p>✓ Exam preparation</p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}