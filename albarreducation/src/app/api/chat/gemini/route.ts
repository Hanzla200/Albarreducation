import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_INSTRUCTION = `
- Mathematics
- Physics
- Chemistry
- Biology
- Computer Science
- English
- Pakistan Studies
- General Knowledge
You are Albar Education AI, but you are a general educational AI assistant.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        {
          error: "No messages were provided.",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing.");

      return NextResponse.json(
        {
          error:
            "Gemini API key is missing. Add GEMINI_API_KEY to your .env.local file.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Keep only valid messages.
     */
    const validMessages = messages
      .filter(
        (message) =>
          message &&
          (message.role === "user" ||
            message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0
      )
      .slice(-20);

    if (validMessages.length === 0) {
      return NextResponse.json(
        {
          error: "Please enter a question.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Gemini expects:
     *
     * user      -> user
     * assistant -> model
     */
    const contents = validMessages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: message.content.trim(),
        },
      ],
    }));

    /*
     * Gemini conversation must begin with a user message.
     */
    if (contents[0].role !== "user") {
      return NextResponse.json(
        {
          error: "Conversation must begin with a user message.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Create Gemini client.
     */
    const ai = new GoogleGenAI({
      apiKey,
    });

    /*
     * Send conversation to Gemini.
     */
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",

      contents,

      config: {
        systemInstruction: SYSTEM_INSTRUCTION,

        temperature: 0.4,

        maxOutputTokens: 2048,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      console.error(
        "Gemini returned an empty response:",
        response
      );

      return NextResponse.json(
        {
          error: "Gemini returned an empty response.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      text,
      provider: "gemini",
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to contact Gemini.",
      },
      {
        status: 500,
      }
    );
  }
}