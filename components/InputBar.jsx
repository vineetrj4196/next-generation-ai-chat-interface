"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { mockAiResponse } from "@/lib/mockAi";
import { Icon } from "@iconify/react";

export default function InputBar() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const recognitionRef = useRef(null);

  const { activeChatId, addMessageToActiveChat, createNewChat } = useChat();

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

  const sendMessage = async (messageText = text) => {
    const content = messageText.trim();
    if (!content && !selectedImage) return;

    setLoading(true);

    let chatId = activeChatId;
    if (!chatId) chatId = createNewChat();

    if (content) {
      addMessageToActiveChat({ role: "user", content }, chatId);
    }

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        addMessageToActiveChat(
          { role: "user", content: reader.result, type: "image" },
          chatId
        );
      };
      reader.readAsDataURL(selectedImage);
      setSelectedImage(null);
    }

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
        {selectedImage && (
          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="preview"
              className="max-h-40 rounded-md"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <label
            htmlFor="fileInput"
            className="p-3 rounded-full border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-muted-bg)] transition-colors"
            title="Upload Image"
          >
            <Icon icon="mdi:paperclip" width={22} />
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={(e) => e.target.files[0] && setSelectedImage(e.target.files[0])}
          />

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

          <button
            onClick={startListening}
            className={`rounded-full p-3 border border-[var(--color-border)] transition-colors ${
              listening ? "bg-[var(--color-primary)] text-white animate-pulse" : "hover:bg-[var(--color-muted-bg)]"
            }`}
            title={listening ? "Listening..." : "Click to speak"}
          >
            <Icon icon={listening ? "mdi:microphone" : "mdi:microphone-outline"} width={22} />
          </button>

          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="bg-[var(--color-primary)] text-white rounded-lg px-4 py-2 hover:bg-[var(--color-secondary)] transition-colors disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
