export type ProjectCategory = "web" | "ai" | "tools";

export interface Project {
  title: string;
  emoji: string;
  badge: string;
  description: string;
  tech: string[];
  categories: ProjectCategory[];
  live?: string;
  code?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "CompresX",
    emoji: "🗜️",
    badge: "Live",
    description:
      "A fast, privacy-first image & file compression tool that runs entirely in the browser. Drag in files and shrink their size dramatically while keeping quality crisp — nothing is uploaded, everything is processed client-side.",
    tech: ["TypeScript", "React", "Vite", "Vercel"],
    categories: ["web", "tools"],
    live: "https://compres-x.vercel.app/",
    code: "https://github.com/pradhan-ashirbad/CompresX",
    featured: true,
  },
  {
    title: "Medikat",
    emoji: "💊",
    badge: "Live",
    description:
      "A modern pharmacy management platform for browsing medicines, tracking inventory, and streamlining orders. Built to simplify a pharmacy's day-to-day operations with a clean, responsive interface.",
    tech: ["TypeScript", "Next.js", "React", "Vercel"],
    categories: ["web"],
    live: "https://pharmacy-six-gamma.vercel.app/",
    code: "https://github.com/pradhan-ashirbad/pharmacy",
    featured: true,
  },
  {
    title: "WhatsApp Reminder Bot",
    emoji: "🤖",
    badge: "Bot",
    description:
      'A self-deployable WhatsApp bot that becomes your personal reminder assistant. Just message "remind me" with the task and time — it parses it, schedules the job, and pings you back on WhatsApp at exactly the right moment.',
    tech: ["Node.js", "WhatsApp API", "Cron Jobs", "NLP Parsing"],
    categories: ["tools", "ai"],
    code: "https://github.com/pradhan-ashirbad",
    live: "https://wa.me/917991050178?text=remind%20me",
    featured: true,
  },
  {
    title: "Algorithm Visualizer",
    emoji: "📊",
    badge: "Live",
    description:
      "An interactive playground that brings algorithms to life with real-time animations for sorting, searching, and pathfinding — making complex concepts intuitive, visual, and genuinely fun to explore.",
    tech: ["JavaScript", "HTML5 Canvas", "CSS3", "Algorithms"],
    categories: ["web", "ai"],
    live: "https://pradhan-ashirbad.github.io/Algorithm-Visualizer/",
    code: "https://github.com/pradhan-ashirbad/Algorithm-Visualizer",
  },
  {
    title: "Chess Game with AI",
    emoji: "♟️",
    badge: "Live",
    description:
      "A polished chess game with an intelligent AI opponent. Smooth piece animations, legal-move validation, and a strategic engine deliver an engaging single-player experience for players of all levels.",
    tech: ["JavaScript", "Game Logic", "Minimax AI", "CSS3"],
    categories: ["ai", "web"],
    live: "https://pradhan-ashirbad.github.io/chess_game/",
    code: "https://github.com/pradhan-ashirbad/chess_game",
  },
  {
    title: "Analitco",
    emoji: "📈",
    badge: "Data",
    description:
      "A data analytics tool that turns raw datasets into clear, interactive insights and charts. Built in Python to surface trends at a glance and make sense of data without the spreadsheet headache.",
    tech: ["Python", "Pandas", "Data Viz", "Analytics"],
    categories: ["ai"],
    code: "https://github.com/pradhan-ashirbad/analitco",
  },
  {
    title: "DocuTech",
    emoji: "📄",
    badge: "Web",
    description:
      "A document management and processing platform for uploading, organizing, and working with documents in the browser — a clean, type-safe codebase focused on a smooth, productive workflow.",
    tech: ["TypeScript", "React", "Node.js"],
    categories: ["web", "tools"],
    code: "https://github.com/pradhan-ashirbad/DocuTech",
  },
  {
    title: "OMR Scanner",
    emoji: "📝",
    badge: "Tool",
    description:
      "An Optical Mark Recognition tool that reads and auto-evaluates answer sheets from images — instantly scoring bubble-style tests and removing hours of manual grading.",
    tech: ["JavaScript", "Image Processing", "Computer Vision"],
    categories: ["ai", "tools"],
    code: "https://github.com/pradhan-ashirbad/omr",
  },
  {
    title: "InstaLuckyDraw",
    emoji: "🎁",
    badge: "Tool",
    description:
      "A giveaway tool that picks fair, random winners from Instagram participants — perfect for creators and brands running contests who want a transparent, repeatable draw.",
    tech: ["TypeScript", "React", "REST API"],
    categories: ["web", "tools"],
    code: "https://github.com/pradhan-ashirbad/InstaLuckyDraw",
  },
  {
    title: "Text Summarizer",
    emoji: "✂️",
    badge: "AI",
    description:
      "An app that condenses long articles and documents into concise, readable summaries — helping you grasp the key points in seconds instead of minutes.",
    tech: ["JavaScript", "NLP", "AI"],
    categories: ["ai", "tools"],
    code: "https://github.com/pradhan-ashirbad/summerizer",
  },
  {
    title: "Interior Design Studio",
    emoji: "🛋️",
    badge: "Web",
    description:
      "An interactive interior-design showcase web app with a sleek, visual layout for presenting spaces, themes, and design ideas in an engaging, responsive gallery.",
    tech: ["JavaScript", "HTML5", "CSS3"],
    categories: ["web"],
    code: "https://github.com/pradhan-ashirbad/InteriorDesign",
  },
  {
    title: "Krushi Servekhyana",
    emoji: "🌾",
    badge: "Web",
    description:
      "An agriculture survey and data-collection web app that digitizes crop and field information — built to bring practical, accessible tech to farmers and rural communities.",
    tech: ["JavaScript", "Web App", "Forms & Data"],
    categories: ["web", "ai"],
    code: "https://github.com/pradhan-ashirbad/krushi-servekhyana",
  },
];

export interface SkillGroup {
  title: string;
  icon: string; // lucide icon name key resolved in component
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    icon: "code",
    skills: ["C++", "Python", "JavaScript", "TypeScript"],
  },
  {
    title: "Web & Frameworks",
    icon: "layout",
    skills: ["HTML5", "CSS3", "React", "Next.js", "Node.js", "Tailwind CSS"],
  },
  {
    title: "Data & Analytics",
    icon: "bar-chart",
    skills: ["Power BI", "SQL", "Data Visualization", "Pandas"],
  },
  {
    title: "Tools & Concepts",
    icon: "wrench",
    skills: ["Git", "GitHub", "Vercel", "Problem Solving", "Data Structures & Algorithms"],
  },
];

export const stats = [
  { value: 90, suffix: "+", label: "Problems Solved", decimals: 0 },
  { value: 12, suffix: "+", label: "Projects Built", decimals: 0 },
  { value: 8.13, suffix: "", label: "CGPA", decimals: 2 },
];

export const socials = {
  email: "pradhanashirbad786@gmail.com",
  phone: "+917991050178",
  whatsapp: "https://wa.me/917991050178",
  github: "https://github.com/pradhan-ashirbad",
  linkedin: "https://linkedin.com/in/ashirbad-pradhan-509817254/",
  leetcode: "https://leetcode.com/u/ashirbadpradhan/",
};
