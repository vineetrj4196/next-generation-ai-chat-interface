"use client";

import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Icon } from "@iconify/react";

export default function ChatListItem({ chat, compact }) {
  const { setActiveChatId, togglePin, renameChat, removeChat, activeChatId } =
    useChat();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [renameText, setRenameText] = useState(chat.title);

  const openModal = (action) => {
    setModalAction(action);
    setModalOpen(true);
    if (action === "rename") setRenameText(chat.title);
  };

  const confirmAction = () => {
    if (modalAction === "pin") togglePin(chat.id);
    if (modalAction === "delete") removeChat(chat.id);
    if (modalAction === "rename" && renameText.trim() !== "")
      renameChat(chat.id, renameText.trim());

    setModalOpen(false);
    setModalAction(null);
  };

  return (
    <>
      <div
        onClick={() => setActiveChatId(chat.id)}
        className={`group flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all
          ${
            activeChatId === chat.id
              ? "bg-[var(--color-sidebar-hover)]"
              : "hover:bg-[var(--color-sidebar-hover)]"
          }
        `}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <div className="truncate font-medium text-[var(--color-foreground)]">
              {chat.title || "Untitled Chat"}
            </div>
            {chat.pinned && (
              <Icon
                icon="mdi:pin"
                className="text-[var(--color-primary)] w-4 h-4"
              />
            )}
          </div>
          {chat.lastSnippet && (
            <div className="text-xs text-[var(--color-muted)] truncate  gap-2">
              {chat.lastSnippet}
            </div>
          )}
        </div>

        {!compact && (
          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal("pin");
              }}
              title="Pin/Unpin"
              className="text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            >
              <Icon icon="mage:pin" width={18} height={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal("rename");
              }}
              title="Rename"
              className="text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            >
              <Icon icon="flowbite:edit-outline" width={18} height={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal("delete");
              }}
              title="Delete"
              className="text-[var(--color-muted)] hover:text-red-500"
            >
              <Icon
                icon="material-symbols:delete-outline-rounded"
                width={18}
                height={18}
              />
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[var(--color-background)] text-[var(--color-foreground)] p-6 rounded-xl shadow-lg w-96 max-w-full">
            {modalAction === "rename" ? (
              <>
                <h2 className="text-lg font-semibold mb-3">Rename Chat</h2>
                <input
                  type="text"
                  value={renameText}
                  onChange={(e) => setRenameText(e.target.value)}
                  className="w-full border border-[var(--color-border)] px-3 py-2 rounded bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] mb-4"
                />
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-3">
                  {modalAction === "pin"
                    ? `Do you want to ${
                        chat.pinned ? "unpin" : "pin"
                      } this chat?`
                    : "Delete this chat?"}
                </h2>
                <p className="mb-4 text-sm text-[var(--color-muted)]">
                  Chat: {chat.title}
                </p>
              </>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded border border-[var(--color-border)]"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded text-white ${
                  modalAction === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
                }`}
              >
                {modalAction === "rename"
                  ? "Save"
                  : modalAction === "delete"
                  ? "Delete"
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
