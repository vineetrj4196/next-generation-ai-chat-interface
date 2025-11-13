"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

const plans = [
  {
    name: "Free",
    points: 50,
    features: ["Basic access", "Limited chats", "Community support"],
  },
  {
    name: "Go Plus",
    points: 200,
    features: ["All Free features", "Faster response", "Extra points"],
    recommended: true,
  },
  {
    name: "Pro",
    points: 500,
    features: ["All Go Plus features", "Priority support", "Unlimited chats"],
  },
];

export default function ProfileFooter({ open }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState("");

  return (
    <>
      {/* Profile Footer */}
      <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)]">
        {open ? (
          <div className="flex items-center gap-2">
            <Icon icon="gg:profile" width={28} height={28} />
            <span className="font-medium truncate">Vineet RJ</span>
          </div>
        ) : (
          <Icon icon="gg:profile" width={28} height={28} />
        )}
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[var(--color-primary)] text-white text-sm px-3 py-1 rounded hover:bg-[var(--color-secondary)] transition"
        >
          Upgrade
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[var(--color-background)] rounded-2xl shadow-xl w-full max-w-4xl p-6 relative">
            {/* Top Cancel Button */}
            <button
              onClick={() => {
                setModalOpen(false);
                setComingSoon("");
              }}
              className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              title="Close"
            >
              <Icon icon="mdi:close" width={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">
              Choose Your Plan
            </h2>

            <div className="flex flex-wrap gap-6 justify-center">
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className="flex-1 min-w-[220px] max-w-xs border border-[var(--color-border)] rounded-2xl p-5 bg-[var(--color-background)] shadow hover:shadow-xl transition relative flex flex-col justify-between"
                >
                  {/* Recommended Badge */}
                  {plan.recommended && (
                    <span className="absolute top-3 right-3 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded-full font-semibold shadow">
                      Recommended
                    </span>
                  )}

                  {/* Plan Header */}
                  <div className="mb-4">
                    <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                    <span className="text-sm text-[var(--color-muted)]">
                      {plan.points} points
                    </span>
                  </div>

                  {/* Plan Features */}
                  <ul className="text-[var(--color-foreground)] text-sm space-y-2 mb-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[var(--color-primary)]">✔</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  <button
                    onClick={() => setComingSoon(plan.name)}
                    className={`mt-auto w-full text-center py-2 rounded-lg font-medium transition ${
                      plan.recommended
                        ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
                        : "border border-[var(--color-border)] hover:bg-[var(--color-muted)]"
                    }`}
                  >
                    {plan.recommended ? "Upgrade Now" : "Select Plan"}
                  </button>

                  {/* Optional small text */}
                  <p className="mt-2 text-xs text-[var(--color-muted)] text-center">
                    Click to select this plan and unlock features.
                  </p>
                </div>
              ))}
            </div>

            {/* Coming Soon Message */}
            {comingSoon && (
              <div className="mt-6 text-center text-[var(--color-primary)] font-semibold text-lg">
                {comingSoon} plan - Coming Soon! 🚀
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
