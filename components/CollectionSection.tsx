"use client";

import { useState } from "react";
import type { Plant } from "@/lib/types";
import { SearchBar } from "./SearchBar";
import { ProductGrid } from "./ProductGrid";

export function CollectionSection({
  plants,
  groups,
}: {
  plants: Plant[];
  groups: string[];
}) {
  const [adminMode, setAdminMode] = useState(false);

  return (
    <>
      {/* Search — ลอยติดใต้ header (h-16 = top-16) */}
      <div className="sticky top-16 z-40 border-b border-ink/5 bg-canvas/85 backdrop-blur-xl backdrop-saturate-150 dark:border-cream/5 dark:bg-canvas-dark/85">
        <div className="shell py-3">
          <SearchBar plants={plants} onAdminMode={setAdminMode} />
        </div>
      </div>

      {/* Collection */}
      <section id="collection" className="shell scroll-mt-32 py-14 sm:py-20">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">The Collection</p>
            <h2 className="mt-4 font-display text-4xl font-light text-ink sm:text-5xl dark:text-ink-dark">
              Currently in the greenhouse
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {adminMode && (
              <span className="rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs font-medium text-red-400">
                🔐 Admin Mode
              </span>
            )}
            <p className="text-sm text-moss dark:text-cream/50">
              {plants.length} specimens available
            </p>
          </div>
        </div>

        <ProductGrid plants={plants} groups={groups} adminMode={adminMode} />
      </section>
    </>
  );
}
