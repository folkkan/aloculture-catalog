"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Plant } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const BADGE_STYLES: Record<string, { bg: string; label: string }> = {
  "New":      { bg: "bg-emerald-500", label: "NEW" },
  "Hot":      { bg: "bg-red-500",     label: "HOT" },
  "Rare":     { bg: "bg-purple-500",  label: "RARE" },
  "Last one": { bg: "bg-amber-500",   label: "LAST ONE" },
};

export function ProductCard({ plant, index, priority }: {
  plant: Plant; index: number; priority?: boolean;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const hasMultiple = plant.images.length > 1;
  const current = plant.images[imgIndex];
  const badge = plant.badge ? BADGE_STYLES[plant.badge] : null;

  return (
    <Link
      href={`/plants/${plant.id}`}
      className="group block rounded-[6px] transition-colors duration-300 active:bg-ink/5 dark:active:bg-cream/5 sm:active:bg-transparent"
      aria-label={plant.name}
    >
      <figure
        className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-cream/30 dark:bg-surface-dark"
        onMouseEnter={() => hasMultiple && setImgIndex(i => (i + 1) % plant.images.length)}
        onMouseLeave={() => setImgIndex(0)}
      >
        {current ? (
          <Image
            src={`/api/image?url=${encodeURIComponent(current.url)}`}
            alt={plant.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-700 ease-smooth group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-sm italic text-moss dark:text-cream/40">no photo</span>
          </div>
        )}

        {/* specimen number */}
        <span className="absolute left-3 top-3 font-sans text-[10px] tracking-eyebrow text-white/60 mix-blend-screen">
          {String(index + 1).padStart(3, "0")}
        </span>

        {/* Badge */}
        {badge && (
          <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg ${badge.bg}`}>
            {badge.label}
          </span>
        )}

        {/* ปุ่มเลื่อนรูปบนมือถือ — แยกออกจากการกดเข้าดูต้น */}
        {hasMultiple && (
          <button
            type="button"
            aria-label="ดูรูปถัดไป"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setImgIndex(i => (i + 1) % plant.images.length);
            }}
            className="absolute bottom-0 right-0 flex h-14 w-14 items-center justify-center text-white/80 sm:hidden"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </span>
          </button>
        )}

        {/* dot indicators */}
        {hasMultiple && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
            {plant.images.map((_, i) => (
              <span key={i} className={`block h-1 rounded-full transition-all duration-300 ${i === imgIndex ? "w-3 bg-white" : "w-1 bg-white/50"}`} />
            ))}
          </div>
        )}
      </figure>

      {/* ---- ข้อมูลต้น: ชื่อ → ราคา (ราคาอยู่ใต้ชื่อ) ---- */}
      <div className="px-1 pb-2 pt-4 sm:px-0 sm:pb-0">
        <h3 className="font-display text-xl leading-snug text-ink sm:text-lg dark:text-ink-dark">
          {plant.name}
        </h3>

        <p className="mt-1.5 font-sans text-base font-medium tabular-nums text-forest sm:text-sm sm:text-ink/80 dark:text-cream dark:sm:text-cream/80">
          {formatPrice(plant.price, plant.currency)}
        </p>

        {plant.variety && (
          <p className="mt-1 truncate text-sm italic text-moss sm:text-xs dark:text-cream/50">
            {plant.variety}
          </p>
        )}

        {/* แถบ "ดูรายละเอียด" เฉพาะมือถือ — พื้นที่กดสูง 44px ตามมาตรฐานนิ้วโป้ง */}
        <span className="mt-3 flex h-11 items-center justify-center rounded-full border border-ink/10 text-sm text-ink/70 sm:hidden dark:border-cream/10 dark:text-cream/70">
          ดูรายละเอียด →
        </span>
      </div>
    </Link>
  );
}
