"use client";

import { useState } from "react";

interface Props {
  plantId: string;
  plantName: string;
  onDeleted: () => void;
}

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

export function AdminDeleteButton({ plantId, plantName, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    if (!confirm) { setConfirm(true); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/delete-plant", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: plantId, password: ADMIN_KEY }),
      });
      if (res.ok) {
        onDeleted();
      } else {
        const d = await res.json().catch(() => ({}));
        alert("Error: " + (d.error ?? res.status));
      }
    } catch {
      alert("Something went wrong กรุณาลองใหม่");
    }
    setLoading(false);
    setConfirm(false);
  }

  if (confirm) {
    return (
      <div className="flex flex-col gap-1.5 rounded-xl bg-black/70 p-2 backdrop-blur-sm">
        <span className="text-[10px] text-red-300 font-medium">Delete "{plantName.slice(0,20)}" ?</span>
        <div className="flex gap-1.5">
          <button onClick={handleDelete} disabled={loading}
            className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Confirm"}
          </button>
          <button onClick={() => setConfirm(false)}
            className="rounded-full border border-white/30 px-3 py-1 text-[10px] text-white/70 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button onClick={handleDelete}
      className="flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1.5 text-[11px] font-medium text-white shadow-lg backdrop-blur-sm transition-all hover:bg-red-500 active:scale-95"
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>
      Delete
    </button>
  );
}
