import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Variegata Atelier";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Variegated Alocasia, curated for collectors`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "A curated atelier of rare variegated Alocasia — tissue culture, potted specimens and corms, grown in semi-hydroponic culture. Worldwide collector shipping.",
  keywords: [
    "variegated Alocasia",
    "Alocasia ด่าง",
    "rare aroids",
    "tissue culture plants",
    "collector Alocasia",
    "Dragon Tooth variegata",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Variegated Alocasia`,
    description:
      "Rare variegated Alocasia, curated for collectors. Grown in semi-hydroponic culture.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Variegated Alocasia`,
    description: "Rare variegated Alocasia, curated for collectors.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0F0D" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
