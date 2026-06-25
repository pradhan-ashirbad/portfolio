"use client";

import { motion } from "framer-motion";
import { Layers, Code2, LayoutTemplate, BarChart3, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { staggerContainer, staggerItem } from "./Reveal";
import { skillGroups } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  code: Code2,
  layout: LayoutTemplate,
  "bar-chart": BarChart3,
  wrench: Wrench,
};

const MARQUEE = [
  "C++",
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "Power BI",
  "SQL",
  "Git",
  "Vercel",
  "Pandas",
  "HTML5",
  "CSS3",
];

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <SectionHeading
        icon={Layers}
        eyebrow="Skills"
        title="My"
        highlight="Tech Stack"
        subtitle="The tools and technologies I use to design, build, and ship products."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-5 sm:grid-cols-2"
      >
        {skillGroups.map((group) => {
          const Icon = ICONS[group.icon] ?? Code2;
          return (
            <motion.div
              key={group.title}
              variants={staggerItem}
              className="surface gradient-ring rounded-3xl p-7"
            >
              <h3 className="mb-5 flex items-center gap-3 font-display text-lg font-bold">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-teal/20 to-brand-violet/20 text-brand-teal">
                  <Icon size={20} />
                </span>
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`surface inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-teal hover:text-brand-teal ${
                      skill === "Power BI" ? "ring-1 ring-brand-violet/40" : ""
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-sky" />
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* marquee ticker */}
      <div className="relative mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-4">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="surface whitespace-nowrap rounded-full px-5 py-2 text-sm text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
