import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

export const useChatStore = create(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      activeChat: null,

      createNewChat: () => {
        const id = uuid();
        const newChat = { id, title: "New Chat", messages: [] };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: id,
          activeChat: newChat,
        }));
      },

      setActiveChatId: (id) => {
        const chat = get().chats.find((c) => c.id === id) || null;
        set({ activeChatId: id, activeChat: chat });
      },

      addMessageToActiveChat: (msg) => {
        const { chats, activeChatId } = get();
        if (!activeChatId) return;

        const updated = chats.map((chat) => {
          if (chat.id !== activeChatId) return chat;
          const messages = [...chat.messages, msg];
          const lastSnippet = msg.content.slice(0, 120);
          return { ...chat, messages, lastSnippet };
        });

        set({
          chats: updated,
          activeChat: updated.find((x) => x.id === activeChatId) || null,
        });
      },

      togglePin: (id) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === id ? { ...c, pinned: !c.pinned } : c
          ),
        })),

      renameChat: (id, title) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        })),

      removeChat: (id) =>
        set((state) => {
          const next = state.chats.filter((c) => c.id !== id);
          const activeId = state.activeChatId === id ? next[0]?.id : state.activeChatId;
          const activeChat = next.find((c) => c.id === activeId) || null;
          return { chats: next, activeChatId: activeId, activeChat };
        }),
    }),
    { name: "next-ai-canvas" }
  )
);
