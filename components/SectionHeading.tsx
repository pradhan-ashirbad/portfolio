"use client";

import { Reveal } from "./Reveal";
import type { LucideIcon } from "lucide-react";

export function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <span className="surface inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
        <Icon className="h-3.5 w-3.5" />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl md:text-[2.7rem]">
        {title} <span className="gradient-text">{highlight}</span>
      </h2>
      {subtitle ? (
        <p className="mt-3 text-muted">{subtitle}</p>
      ) : null}
    </Reveal>
  );
}
