"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const ids = ["hero", "about", "projects", "skills", "contact"];
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      let current = "hero";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 160) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = resolvedTheme !== "light";

  return (
    <header className="fixed inset-x-0 top-4 z-[1000] flex justify-center px-4">
      <nav
        className={`surface-strong flex w-full max-w-5xl items-center justify-between rounded-2xl py-2.5 pl-5 pr-2.5 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled ? "shadow-[0_20px_50px_rgba(0,0,0,0.45)]" : ""
        }`}
      >
        <a href="#hero" className="flex items-center gap-2.5 font-display font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-grad font-extrabold text-[#04121a] shadow-[0_6px_18px_rgba(45,212,191,0.35)]">
            AP
          </span>
          <span className="hidden sm:inline">Ashirbad</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-[var(--text)]" : "text-muted hover:text-[var(--text)]"
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded bg-brand-grad"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="surface grid h-10 w-10 place-items-center rounded-xl transition-colors hover:bg-brand-grad hover:text-[#04121a]"
          >
            {mounted && (isDark ? <Moon size={18} /> : <Sun size={18} />)}
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="surface grid h-10 w-10 place-items-center rounded-xl transition-colors hover:bg-brand-grad hover:text-[#04121a] md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ duration: 0.18 }}
              className="surface-strong absolute right-4 top-[calc(100%+10px)] flex w-52 origin-top-right flex-col gap-1 rounded-2xl p-3 backdrop-blur-xl md:hidden"
              style={{ background: "var(--bg-soft)" }}
            >
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3.5 py-3 text-sm font-medium text-muted transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
