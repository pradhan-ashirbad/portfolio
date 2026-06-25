"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { FolderGit2, Github, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { projects, type Project, type ProjectCategory } from "@/lib/data";

const FILTERS: { key: "all" | ProjectCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web Apps" },
  { key: "ai", label: "AI & Data" },
  { key: "tools", label: "Tools & Bots" },
];

function TiltCard({ project }: { project: Project }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 200,
    damping: 18,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35 }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="gradient-ring surface group relative flex flex-col rounded-3xl p-7 [transform-style:preserve-3d] hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--border)] bg-gradient-to-br from-brand-teal/20 to-brand-violet/20 text-2xl">
          <span aria-hidden>{project.emoji}</span>
        </div>
        <span className="text-[0.7rem] font-bold uppercase tracking-wider text-brand-teal">
          {project.badge}
        </span>
      </div>

      <h3 className="font-display text-xl font-bold">{project.title}</h3>
      <p className="mt-2.5 flex-grow text-sm text-muted">{project.description}</p>

      <div className="my-5 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-lg border border-brand-sky/20 bg-brand-sky/10 px-2.5 py-1 text-xs font-medium text-brand-sky"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex gap-5 border-t border-[var(--border)] pt-4">
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-brand-teal"
          >
            <ArrowUpRight size={16} /> Live Demo
          </a>
        )}
        {project.code && (
          <a
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-brand-teal"
          >
            <Github size={16} /> Code
          </a>
        )}
      </div>
    </motion.article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(filter));

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <SectionHeading
        icon={FolderGit2}
        eyebrow="Portfolio"
        title="Featured"
        highlight="Projects"
        subtitle="A selection of things I've designed, built, and shipped — from live web apps to automation bots."
      />

      <Reveal className="mb-12 flex flex-wrap justify-center gap-2.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              filter === f.key
                ? "bg-brand-grad text-[#04121a]"
                : "surface text-muted hover:text-[var(--text)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </Reveal>

      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <TiltCard key={p.title} project={p} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
