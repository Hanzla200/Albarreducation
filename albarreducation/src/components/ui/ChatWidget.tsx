"use client";
import { useState } from "react";

interface Message { role: "user" | "assistant" | "system"; content: string }

export default function ChatWidget({ context }: { context?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        messages: context ? [{ role: "system", content: context }, ...newMessages.map((m) => ({ role: m.role, content: m.content }))] : newMessages,
      };
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const aiText = data?.text || data?.error || JSON.stringify(data);
      setMessages((curr) => [...curr, { role: "assistant", content: aiText }]);
    } catch (err) {
      setMessages((curr) => [...curr, { role: "assistant", content: "Error: " + String(err) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow max-w-xl w-full">
      <div className="h-48 overflow-auto mb-3 space-y-2">
        {messages.length === 0 && <p className="text-gray-400">Ask about the lecture, notes, or study plan.</p>}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className={m.role === "user" ? "inline-block bg-blue-600 text-white px-3 py-1 rounded" : "inline-block bg-gray-700 text-white px-3 py-1 rounded"}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input className="flex-1 input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question about the lecture..." />
        <button className="btn" onClick={send} disabled={loading}>{loading ? "Sending..." : "Send"}</button>
      </div>
    </div>
  );
}
