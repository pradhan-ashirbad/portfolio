# Ashirbad Pradhan — Portfolio

A modern, interactive developer portfolio built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## ✨ Features

- Animated aurora background, grid overlay, floating particles, and a cursor spotlight
- Scroll-progress bar, sticky glass navbar with active-section tracking, and a mobile menu
- Light / dark theme toggle (persisted via `next-themes`)
- Hero with a typewriter effect and staggered entrance animations
- Animated stat counters that count up on scroll
- Filterable projects grid with 3D tilt-on-hover cards (12+ projects)
- Skills section with a marquee tech ticker
- Fully responsive and accessible (respects `prefers-reduced-motion`)

## 🧱 Tech Stack

| Area       | Tech                                  |
| ---------- | ------------------------------------- |
| Framework  | Next.js 15 (App Router), React 18     |
| Language   | TypeScript                            |
| Styling    | Tailwind CSS                          |
| Animation  | Framer Motion                         |
| Icons      | lucide-react                          |
| Theming    | next-themes                           |

## 🚀 Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## ▲ Deploy on Vercel

This project is a standard Next.js app — deploying is zero-config:

1. Push this branch to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js. Click **Deploy**.

No environment variables are required.

## 📁 Structure

```
app/            # App Router entry (layout, page, global styles)
components/     # UI + interactive components
lib/data.ts     # Projects, skills, stats, and social links (edit content here)
public/         # Static assets (profile image)
```

To update content, edit `lib/data.ts`.
