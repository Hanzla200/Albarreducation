"use client";

import { useState } from "react";
import { getStoredUser } from "../lib/auth";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function GeminiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage() {
    const question = input.trim();

    if (!question || loading) {
      return;
    }

    /*
     * Require login.
     */
    const user = getStoredUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    /*
     * Create user message.
     */
    const userMessage: Message = {
      role: "user",
      content: question,
    };

    /*
     * Include previous conversation.
     */
    const updatedMessages: Message[] = [
      ...messages,
      userMessage,
    ];

    /*
     * Show user message immediately.
     */
    setMessages(updatedMessages);

    setInput("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/chat/gemini", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "AI request failed."
        );
      }

      if (!data?.text) {
        throw new Error(
          "AI returned an empty response."
        );
      }

      /*
       * Add AI response.
       */
      const assistantMessage: Message = {
        role: "assistant",
        content: data.text,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();

      sendMessage();
    }
  }

  return (
    <div className="gemini-chat">
      <div className="chat-body max-h-[55vh] min-h-0 overflow-y-auto">
        {messages.length > 0 && (
          <div className="chat-thread">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-message ${message.role}`}
              >
                <div className="chat-message-role">
                  {message.role === "user" ? "You" : "Albar AI"}
                </div>
                <div className="chat-message-content">{message.content}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant">
                <div className="chat-message-role">Albar AI</div>
                <div className="chat-message-content">Thinking...</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="chat-error">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-row">

        <input
          className="chat-input"
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button
          type="button"
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={
            loading ||
            !input.trim()
          }
        >
          {loading ? "Thinking..." : "Send"}
        </button>

      </div>
    </div>
  );
}