"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useChat } from "@/context/ChatContext";
import { mockAiResponse } from "@/lib/mockAi";
import { useEffect, useRef } from "react";

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
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);

  if (
    !activeChat ||
    (activeChat.messages[0]?.role === "system" &&
      activeChat.messages.length === 1)
  ) {
    const greetings = [
      `Hello, ${userName}! How can I help you today? `,
      `Hey ${userName}, ready to explore something new? `,
      `Hi ${userName}! Let's start creating something awesome! `,
    ];
    const msg = greetings[Math.floor(Math.random() * greetings.length)];

    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl p-10 shadow-sm">
          <h1 className="text-3xl font-semibold mb-3">{msg}</h1>
          <p className="text-[var(--color-muted)] mb-8 text-lg">
            You can start by picking one of the topics below
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
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-120px)] flex flex-col">
      <div
        ref={scrollRef}
        className="flex-1 bg-[var(--color-background)] border border-[var(--color-border)]
                 rounded-2xl p-6 shadow-sm space-y-4 overflow-y-auto"
      >
        {activeChat.messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-xl p-4 max-w-[75%] break-words ${
                m.role === "user"
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : ""
              }`}
            >
              {/* FILE + MESSAGE RENDERING LOGIC */}
              {(() => {
                const content = m.content || "";

                // ----- PDF DETECTION -----
                if (content.startsWith("data:application/pdf")) {
                  return (
                    <div className="p-2">
                      <p className="font-semibold mb-2">📄 PDF Attachment</p>

                      <embed
                        src={content}
                        type="application/pdf"
                        className="w-full h-64 rounded-lg border"
                      />

                      <a
                        href={content}
                        download={`file-${Date.now()}.pdf`}
                        className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                      >
                        Download PDF
                      </a>
                    </div>
                  );
                }

                // ----- IMAGE DETECTION -----
                if (content.startsWith("data:image/")) {
                  return (
                    <img
                      src={content}
                      alt="uploaded"
                      className="rounded-md max-w-full max-h-64"
                    />
                  );
                }

                // ----- USER TEXT -----
                if (m.role === "user") {
                  return <span>{content}</span>;
                }

                // ----- ASSISTANT MARKDOWN -----
                return (
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {content}
                  </ReactMarkdown>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
