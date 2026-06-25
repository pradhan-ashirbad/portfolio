"use client";

import Image from "next/image";
import { User, GraduationCap, Laptop, LineChart, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Counter } from "./Counter";
import { stats } from "@/lib/data";

const chips = [
  { icon: GraduationCap, label: "Parul University" },
  { icon: Laptop, label: "Full-Stack & AI" },
  { icon: LineChart, label: "Data & Analytics" },
  { icon: MapPin, label: "India" },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <SectionHeading icon={User} eyebrow="About Me" title="A bit about" highlight="who I am" />

      <Reveal className="surface rounded-3xl p-6 backdrop-blur-md sm:p-10">
        <div className="grid items-center gap-10 md:grid-cols-[300px_1fr]">
          <div className="relative mx-auto h-[260px] w-[260px]">
            <div className="absolute -inset-2.5 animate-spin-slow rounded-[26px] bg-brand-grad opacity-70 blur-[6px]" />
            <Image
              src="/profile.jpg"
              alt="Ashirbad Pradhan"
              fill
              sizes="260px"
              priority
              className="relative z-[1] rounded-[22px] border-[3px] border-[var(--bg-soft)] object-cover"
            />
          </div>

          <div>
            <p className="text-muted">
              I&apos;m a passionate{" "}
              <strong className="text-[var(--text)]">
                Computer Science student at Parul University
              </strong>{" "}
              (CGPA: 8.13) who loves turning complex problems into clean, working software. My
              curiosity drives me across the stack — from algorithms and data structures to
              full web apps and AI-powered automation.
            </p>
            <p className="mt-4 text-muted">
              I enjoy building things people actually use: file tools, management dashboards,
              bots, and data visualizations. I care about thoughtful UX, performance, and code
              that bridges functionality with delightful interaction.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {chips.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="surface inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-muted"
                >
                  <Icon size={15} className="text-brand-teal" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="surface rounded-2xl px-4 py-7 text-center">
              <div className="gradient-text font-display text-4xl font-bold">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="mt-1.5 text-xs uppercase tracking-wider text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
