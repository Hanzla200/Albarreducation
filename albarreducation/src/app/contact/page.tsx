"use client";
import { useState } from "react";
import { createContactMessage } from "../../services/contentService";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      await createContactMessage(name.trim(), email.trim(), message.trim());
      setStatus("🎉 Thanks! Your message has been sent successfully. We will reply soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("Unable to send your message right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Get in Touch</p>
        <h1 className="text-3xl font-bold text-accent mt-1">Contact Albar Education</h1>
        <p className="mt-1 text-gray-400">
          Have a question about matric/FSC lectures, book orders, or custom notes? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Send Us a Message</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Your Name</label>
              <input
                className="input w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student / Parent Name"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Your Email</label>
              <input
                type="email"
                className="input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Message</label>
              <textarea
                className="input w-full min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can Sir Sadam and the Albar Education team assist you?"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {status && (
              <p className="mt-3 p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-cyan-200 text-sm">
                {status}
              </p>
            )}
          </form>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-3">Official Channels</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.youtube.com/@sirsadam"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-cyan-400 hover:underline"
                >
                  <span>📺</span> YouTube: Sir Sadam
                </a>
              </li>
              <li>
                <a
                  href="https://whatsapp.com/channel/0029VaEdyBSG3R3p7BU1C02e"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:underline"
                >
                  <span>💬</span> WhatsApp Community Channel
                </a>
              </li>
              <li>
                <a
                  href="https://patreon.com/sirsadam"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-pink-400 hover:underline"
                >
                  <span>❤️</span> Patreon Supporter Page
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
