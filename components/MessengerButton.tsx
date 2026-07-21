"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";

interface Props {
  plantId: string;
  plantName: string;
  plantUrl: string;
  selectedImageUrl?: string;
  plantSku?: string;
  plantVariety?: string;
  price?: number;
  currency?: string;
  unitIndex?: number; // 1-based: ต้นที่เลือกอยู่
  unitTotal?: number; // จำนวนต้นทั้งหมด (= จำนวนรูป)
}

type ShareDataX = {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
};

const MESSENGER_PAGE = process.env.NEXT_PUBLIC_MESSENGER_PAGE ?? "folkkan";

function isThaiUser(): boolean {
  if (typeof navigator === "undefined") return true;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Asia/Bangkok") return true;
    const lang = (navigator.language || "").toLowerCase();
    if (lang.startsWith("th")) return true;
    const langs = navigator.languages || [];
    if (langs.some((l) => (l || "").toLowerCase().startsWith("th"))) return true;
    return false;
  } catch {
    return true;
  }
}

async function fetchImageBlob(url: string): Promise<Blob | null> {
  const sameOrigin =
    url.startsWith("/") ||
    (typeof window !== "undefined" && url.startsWith(window.location.origin));
  const candidates = sameOrigin
    ? [url]
    : [`/api/image?url=${encodeURIComponent(url)}`, url];
  for (const c of candidates) {
    try {
      const res = await fetch(c);
      if (res.ok) {
        const blob = await res.blob();
        if (blob && blob.size > 0) return blob;
      }
    } catch {
      /* ลอง candidate ถัดไป */
    }
  }
  return null;
}

export function MessengerButton({
  plantId,
  plantName,
  plantUrl,
  selectedImageUrl,
  plantSku,
  plantVariety,
  price,
  currency,
  unitIndex,
  unitTotal,
}: Props) {
  const [busy, setBusy] = useState(false);

  function buildMessage(): string {
    const th = isThaiUser();
    const priceStr =
      typeof price === "number" ? formatPrice(price, currency ?? "THB") : "";
    const hasUnits = typeof unitTotal === "number" && unitTotal > 1;

    if (th) {
      return [
        `🌿 สนใจต้นนี้ครับ`,
        plantVariety ? `${plantName} (${plantVariety})` : plantName,
        plantSku ? `รหัส: ${plantSku}` : "",
        hasUnits
          ? `ต้นที่ ${unitIndex}/${unitTotal}${priceStr ? " · ราคา " + priceStr : ""}`
          : priceStr
          ? `ราคา ${priceStr}`
          : "",
        `ยังมีไหมครับ?`,
        plantUrl,
      ]
        .filter(Boolean)
        .join("\n");
    }

    return [
      `🌿 Interested in this plant`,
      plantVariety ? `${plantName} (${plantVariety})` : plantName,
      plantSku ? `Code: ${plantSku}` : "",
      hasUnits
        ? `Unit ${unitIndex}/${unitTotal}${priceStr ? " · " + priceStr : ""}`
        : priceStr
        ? priceStr
        : "",
      `Is this still available?`,
      plantUrl,
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    const text = buildMessage();
    const nav =
      typeof navigator !== "undefined"
        ? (navigator as Navigator & {
            canShare?: (data?: ShareDataX) => boolean;
            share?: (data?: ShareDataX) => Promise<void>;
          })
        : undefined;

    try {
      if (selectedImageUrl && nav?.canShare) {
        const blob = await fetchImageBlob(selectedImageUrl);
        if (blob) {
          const filename =
            plantName.replace(/\s+/g, "-") + "-" + (unitIndex ?? 1) + ".jpg";
          const file = new File([blob], filename, {
            type: blob.type || "image/jpeg",
          });
          if (nav.canShare({ files: [file] }) && nav.share) {
            try {
              await nav.share({ files: [file], text, title: plantName });
              return;
            } catch (err) {
              if (err instanceof Error && err.name === "AbortError") return;
            }
          }
        }
      }

      if (nav?.share) {
        try {
          await nav.share({ text, title: plantName });
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
        }
      }

      try {
        await navigator.clipboard?.writeText(text);
      } catch {
        /* เงียบไว้ */
      }
      window.open(
        `https://m.me/${MESSENGER_PAGE}`,
        "_blank",
        "noopener,noreferrer",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#0866FF] px-8 py-4 text-sm font-medium text-white shadow-lg shadow-[#0866FF]/20 transition-all duration-300 ease-smooth hover:bg-[#0557e0] hover:shadow-[#0866FF]/30 active:scale-[0.98] disabled:opacity-70"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.37 5.507 3.52 7.25v3.507l3.256-1.812c.87.244 1.79.375 2.724.375 5.523 0 10-4.145 10-9.243S17.523 2 12 2Zm.99 12.44-2.548-2.72-4.97 2.72 5.47-5.806 2.61 2.72 4.906-2.72-5.469 5.806Z" />
      </svg>
      {busy ? "Opening…" : "Inquire About This Plant"}
    </button>
  );
}
