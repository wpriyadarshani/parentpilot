"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/parenting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col">

        {/* Header */}
        <header className="border-b bg-white px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">
            ParentPilot
          </h1>

          <p className="text-sm text-gray-500">
            Your AI parenting copilot
          </p>
        </header>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">

          {messages.length === 0 && (
            <div className="mt-20 text-center">

              <h2 className="text-3xl font-bold text-gray-900">
                How can I help?
              </h2>

              <p className="mt-3 text-gray-500">
                Tell me what's happening with your child.
              </p>

              <div className="mx-auto mt-8 grid max-w-lg gap-3 sm:grid-cols-2">

                <button
                  onClick={() =>
                    setMessage(
                      "My 4 year old is having a tantrum because I turned off the TV."
                    )
                  }
                  className="rounded-xl border bg-blue-600 text-white p-4 text-left hover:bg-gray-100"
                >
                  🚨 My child is having a tantrum
                </button>

                <button
                  onClick={() =>
                    setMessage(
                      "My child refuses to go to bed every night."
                    )
                  }
                  className="rounded-xl border bg-blue-600 text-white p-4 text-left hover:bg-gray-100"
                >
                  😴 My child won't sleep
                </button>

                <button
                  onClick={() =>
                    setMessage(
                      "My child is extremely picky about food."
                    )
                  }
                  className="rounded-xl border bg-blue-600 text-white p-4 text-left hover:bg-gray-100"
                >
                  🍎 My child won't eat
                </button>

                <button
                  onClick={() =>
                    setMessage(
                      "Give me a fun activity for my 4 year old."
                    )
                  }
                  className="rounded-xl border bg-blue-600 text-white p-4 text-left hover:bg-gray-100"
                >
                  🎨 Give me an activity
                </button>

              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900 shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-3 text-gray-500 shadow-sm">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="border-t bg-white p-4"
        >
          <div className="flex gap-3">

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's happening with your child?"
              className="flex-1 rounded-xl border text-gray-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white disabled:opacity-50"
            >
              Send
            </button>

          </div>
        </form>

      </div>
    </main>
  );
}