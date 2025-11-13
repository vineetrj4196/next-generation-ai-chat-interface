"use client";

import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const createNewChat = () => {
    const id = uuid();
    const helperMsg = {
      role: "system",
      content: "Welcome! Choose a question below to start the chat.",
    };

    const newChat = {
      id,
      title: "New Chat",
      messages: [helperMsg],
      pinned: false,
      lastSnippet: "",
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);

    return id;
  };

  const addMessageToActiveChat = (msg, targetId = activeChatId) => {
    if (!targetId) return; // handle if ID missing (e.g., still setting)
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== targetId) return chat;

        const isFirstUserMessage =
          chat.messages.filter((m) => m.role === "user").length === 0 &&
          msg.role === "user";

        const newTitle = isFirstUserMessage
          ? msg.content.split(" ").slice(0, 2).join(" ").trim() || "New Chat"
          : chat.title;

        return {
          ...chat,
          title: newTitle,
          messages: [...chat.messages, msg],
          lastSnippet: msg.content.slice(0, 120),
        };
      })
    );
  };

  const renameChat = (id, title) =>
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, title } : chat))
    );

  const togglePin = (id) =>
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, pinned: !chat.pinned } : chat
      )
    );

  const removeChat = (id) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (id === activeChatId) setActiveChatId(null);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        setActiveChatId,
        createNewChat,
        addMessageToActiveChat,
        renameChat,
        togglePin,
        removeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
