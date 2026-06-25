"use client";

import { MessageSquare, Mail, Phone, Github, Linkedin, Code2, MessageCircle } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { socials } from "@/lib/data";

const links = [
  { href: socials.github, label: "GitHub", Icon: Github },
  { href: socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: socials.leetcode, label: "LeetCode", Icon: Code2 },
  { href: socials.whatsapp, label: "WhatsApp", Icon: MessageCircle },
];

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <SectionHeading icon={MessageSquare} eyebrow="Contact" title="Let's" highlight="Connect" />

      <Reveal className="surface gradient-ring mx-auto max-w-2xl rounded-3xl px-6 py-12 text-center sm:px-10 sm:py-14">
        <p className="mx-auto max-w-lg text-lg text-muted">
          Ready to collaborate on something exciting, or have an opportunity in mind? I&apos;m
          always happy to chat with fellow developers, recruiters, and tech enthusiasts.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={`mailto:${socials.email}`}
            className="inline-flex items-center gap-2.5 rounded-xl bg-brand-grad px-7 py-3.5 font-semibold text-[#04121a] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(45,212,191,0.4)]"
          >
            <Mail size={18} /> Email Me
          </a>
          <a
            href={`tel:${socials.phone}`}
            className="surface inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-teal"
          >
            <Phone size={18} /> Call Me
          </a>
        </div>

        <div className="mt-9 flex justify-center gap-3.5">
          {links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="surface grid h-14 w-14 place-items-center rounded-2xl text-xl transition-all duration-200 hover:-translate-y-1 hover:bg-brand-grad hover:text-[#04121a]"
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
