import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 py-10 text-center text-sm text-muted">
      <p className="flex flex-wrap items-center justify-center gap-1.5">
        Designed &amp; built by Ashirbad Pradhan with
        <Heart size={14} className="fill-brand-pink text-brand-pink" />
        <span aria-hidden>·</span>
        <span>© {new Date().getFullYear()}</span>
      </p>
      <p className="mt-1.5 text-xs text-muted/70">
        Built with Next.js, Tailwind CSS &amp; Framer Motion.
      </p>
    </footer>
  );
}
