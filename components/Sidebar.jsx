"use client";

import { useState, useMemo } from "react";
import { useChat } from "@/context/ChatContext";
import ChatListItem from "./ChatListItem";
import { Icon } from "@iconify/react";
import ProfileFooter from "./upgardePlans";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const { chats, createNewChat } = useChat();

  const pinned = useMemo(() => chats.filter((c) => c.pinned), [chats]);
  const others = useMemo(() => chats.filter((c) => !c.pinned), [chats]);

  const filterChats = (list) =>
    search
      ? list.filter(
          (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            (c.lastSnippet || "").toLowerCase().includes(search.toLowerCase())
        )
      : list;

  return (
    <aside
      className={`transition-all h-screen flex flex-col justify-between
        ${open ? "w-80" : "w-16"}
        bg-[var(--color-sidebar-bg)]
        text-[var(--color-sidebar-text)]
        border-r border-[var(--color-border)]`}
    >
      <div>
        <div
          className={`flex items-center p-4 border-b ${
            open ? "justify-between" : "justify-center"
          } gap-2`}
        >
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(!open)}>
              <Icon
                icon={open ? "gala:menu-left" : "gala:menu-right"}
                width={24}
                height={24}
              />
            </button>
            {open && <h2 className="font-semibold text-lg">Chats</h2>}
          </div>
          {open && (
            <button
              onClick={createNewChat}
              className="bg-[var(--color-primary)] text-white rounded px-3 py-1 hover:opacity-90"
            >
              + New Chat
            </button>
          )}
        </div>

        {open ? (
          <div className="p-3">
            <input
              className="w-full border border-[var(--color-border)] px-3 py-2 rounded text-sm bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center p-2 gap-2">
            <button
              onClick={createNewChat}
              className="hover:bg-[var(--color-sidebar-hover)] rounded p-2"
              title="New Chat"
            >
              <Icon icon="mdi:plus" width={24} height={24} />
            </button>
            <button
              className="hover:bg-[var(--color-sidebar-hover)] rounded p-2"
              title="Search"
            >
              <Icon icon="mdi:magnify" width={24} height={24} />
            </button>
          </div>
        )}

        {open && (
          <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-3">
            {chats.length === 0 ? (
              <div className="text-center text-[var(--color-muted)] py-4">
                No chats available. Start a new chat!
              </div>
            ) : (
              <>
                {filterChats(pinned).length > 0 && (
                  <>
                    <div className="px-3 py-1 text-xs text-gray-500 uppercase">
                      Pinned
                    </div>
                    {filterChats(pinned).map((chat) => (
                      <ChatListItem key={chat.id} chat={chat} compact={!open} />
                    ))}
                    <hr className="my-2 border-[var(--color-border)]" />
                  </>
                )}

                {filterChats(others).length > 0 ? (
                  filterChats(others).map((chat) => (
                    <ChatListItem key={chat.id} chat={chat} compact={!open} />
                  ))
                ) : (
                  <div className="text-center text-[var(--color-muted)] py-4">
                    No chats found matching "
                    <span className="font-semibold">{search}</span>"
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <ProfileFooter open={open} />
    </aside>
  );
}
