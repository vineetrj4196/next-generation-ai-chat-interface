"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useChat } from "@/context/ChatContext";
import { mockAiResponse } from "@/lib/mockAi";

const helperQuestions = [
  "What can you do?",
  "Tell me a joke",
  "Give me a programming tip",
  "Explain a concept in simple words",
  "How do I improve my workflow?",
];

export default function CanvasView() {
  const { activeChat, addMessageToActiveChat, createNewChat } = useChat();

  const userName = "Manish"; 

  if (
    !activeChat ||
    (activeChat.messages[0]?.role === "system" &&
      activeChat.messages.length === 1)
  ) {
    const greetings = [
      `Hello, ${userName}! How can I help you today? 👋`,
      `Hey ${userName}, ready to explore something new? 🚀`,
      `Hi ${userName}! Let's start creating something awesome! 💡`,
    ];
    const msg = greetings[Math.floor(Math.random() * greetings.length)];

    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl p-10 shadow-sm">
          <h1 className="text-3xl font-semibold mb-3">{msg}</h1>
          <p className="text-[var(--color-muted)] mb-8 text-lg">
            You can start by picking one of the topics below 👇
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {helperQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={async () => {
                  let chatId = activeChat?.id;
                  if (!chatId) chatId = createNewChat();

                  addMessageToActiveChat({ role: "user", content: q }, chatId);

                  const aiText = await mockAiResponse(q);

                  addMessageToActiveChat(
                    { role: "assistant", content: aiText },
                    chatId
                  );
                }}
                className="px-5 py-2 bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)] transition-all rounded-full text-sm shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-4">
        {activeChat.messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-xl p-4 max-w-[75%] break-words ${
                m.role === "user"
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm"
              }`}
            >
              {m.type === "image" ? (
                <img
                  src={m.content}
                  alt="uploaded"
                  className="rounded-md max-w-full max-h-64"
                />
              ) : m.role === "user" ? (
                <span>{m.content}</span>
              ) : (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {m.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
