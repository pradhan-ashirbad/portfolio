"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Send, Github, Linkedin, Code2, Mail, ArrowDown } from "lucide-react";
import { socials } from "@/lib/data";

const ROLES = [
  "interactive web apps",
  "AI-powered tools",
  "data visualizations",
  "automation bots",
  "delightful experiences",
];

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(words[0]);
      return;
    }
    const word = words[i % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && text === "") {
      setDeleting(false);
      setI((p) => (p + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            deleting ? word.slice(0, prev.length - 1) : word.slice(0, prev.length + 1)
          );
        },
        deleting ? 38 : 75
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, i, words]);

  return text;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  const typed = useTypewriter(ROLES);

  return (
    <section
      id="hero"
      className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 pt-24 text-center"
    >
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.span
          variants={item}
          className="surface mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm text-muted"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          Available for opportunities &amp; collaborations
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-[2.6rem] font-bold leading-[1.05] sm:text-6xl md:text-[5rem]"
        >
          Hi, I&apos;m <span className="gradient-text">Ashirbad Pradhan</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 font-display text-lg font-semibold sm:text-2xl"
        >
          I build <span className="gradient-text">{typed}</span>
          <span className="ml-0.5 inline-block h-[1.05em] w-0.5 animate-pulse bg-brand-teal align-[-2px]" />
        </motion.p>

        <motion.p variants={item} className="mx-auto mt-5 max-w-xl text-muted">
          Computer Science student crafting interactive web apps, AI-powered tools, and
          data-driven experiences — turning ideas into elegant, working products.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2.5 rounded-xl bg-brand-grad px-7 py-3.5 font-semibold text-[#04121a] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(45,212,191,0.4)]"
          >
            <Rocket size={18} className="transition-transform group-hover:-rotate-12" /> View My Work
          </a>
          <a
            href="#contact"
            className="surface inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-teal"
          >
            <Send size={18} /> Get In Touch
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-9 flex items-center justify-center gap-3.5">
          {[
            { href: socials.github, label: "GitHub", Icon: Github },
            { href: socials.linkedin, label: "LinkedIn", Icon: Linkedin },
            { href: socials.leetcode, label: "LeetCode", Icon: Code2 },
            { href: `mailto:${socials.email}`, label: "Email", Icon: Mail },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className="surface grid h-11 w-11 place-items-center rounded-xl transition-all duration-200 hover:-translate-y-1 hover:bg-brand-grad hover:text-[#04121a]"
            >
              <Icon size={19} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted"
      >
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="flex flex-col items-center gap-1"
        >
          Scroll
          <ArrowDown size={16} />
        </motion.span>
      </a>
    </section>
  );
}
