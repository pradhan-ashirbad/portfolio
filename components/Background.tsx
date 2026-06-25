"use client";

import { useEffect, useState } from "react";

interface Particle {
  left: string;
  delay: string;
  duration: string;
  color: string;
}

const COLORS = ["#2dd4bf", "#38bdf8", "#a855f7"];

export function Background() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const next: Particle[] = Array.from({ length: 36 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 12 + 12}s`,
      color: COLORS[i % COLORS.length],
    }));
    setParticles(next);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* aurora blobs */}
      <div className="absolute -left-24 -top-32 h-[480px] w-[480px] animate-drift rounded-full bg-brand-teal/40 blur-[90px]" />
      <div className="absolute -bottom-40 -right-28 h-[520px] w-[520px] animate-drift rounded-full bg-brand-violet/40 blur-[90px] [animation-delay:-7s]" />
      <div className="absolute left-[55%] top-[40%] h-[380px] w-[380px] animate-drift rounded-full bg-brand-sky/30 blur-[90px] [animation-delay:-14s]" />

      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-50 [mask-image:radial-gradient(circle_at_50%_35%,black,transparent_78%)]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 h-[3px] w-[3px] animate-float-up rounded-full opacity-50"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}
