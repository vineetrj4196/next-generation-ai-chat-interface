"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { mockAiResponse } from "@/lib/mockAi";
import { Icon } from "@iconify/react";

export default function InputBar() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [attachments, setAttachments] = useState([]); // <-- NEW
  const recognitionRef = useRef(null);

  const { activeChatId, addMessageToActiveChat, createNewChat } = useChat();

  /* ------------------ Speech Recognition Setup ------------------ */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setListening(true);
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        setTimeout(() => sendMessage(transcript), 300);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    listening ? recognitionRef.current.stop() : recognitionRef.current.start();
  };

  /* ---------------------------- Send Message ---------------------------- */
  const sendMessage = async (messageText = text) => {
    const content = messageText.trim();
    const hasAttachments = attachments.length > 0;

    if (!content && !hasAttachments) return;

    setLoading(true);

    let chatId = activeChatId;
    if (!chatId) chatId = createNewChat();

    /* Send text message */
    if (content) {
      addMessageToActiveChat({ role: "user", content }, chatId);
    }

    /* Send attachments */
    if (hasAttachments) {
      for (const file of attachments) {
        const reader = new FileReader();
        reader.onload = () => {
          addMessageToActiveChat(
            {
              role: "user",
              type: "attachment",
              fileName: file.name,
              fileType: file.type,
              content: reader.result,
            },
            chatId
          );
        };
        reader.readAsDataURL(file);
      }

      setAttachments([]);
    }

    /* AI Response */
    if (content) {
      const aiText = await mockAiResponse(content);
      addMessageToActiveChat({ role: "assistant", content: aiText }, chatId);
    }

    setText("");
    setLoading(false);
  };

  return (
    <div className="bg-[var(--color-sidebar-bg)] border-t border-[var(--color-border)] p-4">
      <div className="mx-auto flex flex-col gap-2 max-w-4xl">

        {/* ------------------- ATTACHMENTS PREVIEW ------------------- */}
        {attachments.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border border-[var(--color-border)] px-3 py-2 rounded-lg bg-[var(--color-muted-bg)]"
              >
                <Icon icon="mdi:file-outline" width={20} />
                <span className="max-w-[120px] truncate text-sm">
                  {file.name}
                </span>

                <button
                  onClick={() =>
                    setAttachments(attachments.filter((_, i) => i !== index))
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon icon="mdi:close" width={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* -------------------------- INPUT BAR -------------------------- */}
        <div className="flex items-center gap-3">

          {/* FILE UPLOAD BUTTON */}
          <label
            htmlFor="fileInput"
            className="p-3 rounded-full border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-muted-bg)] transition-colors"
            title="Upload attachments"
          >
            <Icon icon="mdi:paperclip" width={22} />
          </label>

          <input
            id="fileInput"
            type="file"
            multiple
            accept="*/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (attachments.length + files.length > 3) {
                alert("You can upload a maximum of 3 attachments.");
                return;
              }
              setAttachments([...attachments, ...files]);
            }}
          />

          {/* TEXT INPUT */}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 border border-[var(--color-border)] px-4 py-3 rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="Type or speak your message..."
          />

          {/* MIC BUTTON */}
          <button
            onClick={startListening}
            className={`rounded-full p-3 border border-[var(--color-border)] transition-colors ${
              listening
                ? "bg-[var(--color-primary)] text-white animate-pulse"
                : "hover:bg-[var(--color-muted-bg)]"
            }`}
            title={listening ? "Listening..." : "Click to speak"}
          >
            <Icon
              icon={listening ? "mdi:microphone" : "mdi:microphone-outline"}
              width={22}
            />
          </button>

          {/* SEND BUTTON */}
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="bg-[var(--color-primary)] text-white rounded-lg px-4 py-2  transition-colors disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
