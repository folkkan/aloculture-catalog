"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import type { ReactNode } from "react";

// next-themes injects an inline <script> to set the theme class before
// hydration (avoids FOUC). React 19 emits a false-positive dev warning for
// any <script> rendered inside a component tree — see
// https://github.com/pacocoursey/next-themes/issues/387
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return;
    }
    originalError.apply(console, args);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  );
}
