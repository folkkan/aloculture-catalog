"use client";

import { useMemo, useState, useCallback } from "react";
import type { Plant } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { AdminDeleteButton } from "./AdminBar";

export function ProductGrid({
  plants: initialPlants,
  groups,
  adminMode = false,
}: {
  plants: Plant[];
  groups: string[];
  adminMode?: boolean;
}) {
  const [active, setActive] = useState<string>("All");
  const [plants, setPlants] = useState(initialPlants);

  const filtered = useMemo(() => {
    if (active === "All") return plants;
    return plants.filter((p) => p.group === active);
  }, [plants, active]);

  const handleDeleted = useCallback((id: string) => {
    setPlants(prev => prev.filter(p => p.id !== id));
  }, []);

  const filters = ["All", ...groups];

  return (
    <div>
      {groups.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-x-6 gap-y-3">
          {filters.map((g) => (
            <button key={g} type="button" onClick={() => setActive(g)}
              className={`relative pb-1 text-sm transition-colors duration-300 ${active === g ? "text-forest dark:text-cream" : "text-moss hover:text-ink dark:text-cream/50 dark:hover:text-cream/90"}`}
            >
              {g}
              {active === g && <span className="absolute inset-x-0 -bottom-px h-px bg-forest dark:bg-cream"/>}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-20 text-center font-display text-xl italic text-moss dark:text-cream/40">
          No specimens in this group yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plant, i) => (
            <div
              key={plant.id}
              className="animate-fade-up relative"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <ProductCard plant={plant} index={i} priority={i < 3} />
              {adminMode && (
                <div className="absolute left-3 top-3 z-10">
                  <AdminDeleteButton
                    plantId={plant.id}
                    plantName={plant.name}
                    onDeleted={() => handleDeleted(plant.id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
