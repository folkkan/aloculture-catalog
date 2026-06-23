const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Variegata Atelier";
const LINE = process.env.NEXT_PUBLIC_LINE_URL;
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_URL;
const FACEBOOK = process.env.NEXT_PUBLIC_FACEBOOK_URL;

export function Footer() {
  const channels = [
    { label: "Line", href: LINE },
    { label: "WhatsApp", href: WHATSAPP },
    { label: "Facebook", href: FACEBOOK },
  ].filter((c) => c.href);

  return (
    <footer id="atelier" className="mt-32 border-t border-ink/10 dark:border-cream/10">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.5fr_1fr]">
        <div className="max-w-md">
          <p className="font-display text-2xl leading-snug text-ink dark:text-ink-dark">
            {SITE_NAME}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-moss dark:text-cream/60">
            Rare variegated Alocasia, grown in Thailand.
          </p>
        </div>

        <div>
          <p className="eyebrow">Enquire</p>
          <ul className="mt-4 space-y-2">
            {channels.length === 0 && (
              <li className="text-sm text-moss dark:text-cream/50">
                Set contact channels in .env
              </li>
            )}
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink/80 underline-offset-4 transition-colors hover:text-forest hover:underline dark:text-cream/80 dark:hover:text-cream"
                >
                  {c.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-ink/5 py-6 text-xs text-moss sm:flex-row sm:items-center sm:justify-between dark:border-cream/5 dark:text-cream/40">
        <span>
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </span>
        <span>Grown in semi-hydroponic culture · Thailand</span>
      </div>
    </footer>
  );
}
