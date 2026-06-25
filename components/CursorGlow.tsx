"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;

    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    };
    const leave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300 will-change-transform"
      style={{
        background:
          "radial-gradient(circle, rgba(45,212,191,0.16), transparent 65%)",
        marginLeft: "-170px",
        marginTop: "-170px",
      }}
    />
  );
}
