"use client";

import { useEffect, useRef } from "react";

interface Crack {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  born: number;
}

interface Shard {
  local: { x: number; y: number }[]; // points relative to centroid
  bbox: { minX: number; minY: number; maxX: number; maxY: number };
  cx: number; // current centroid x
  cy: number; // current centroid y
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  delay: number;
  r: number;
  g: number;
  b: number;
}

type Phase = "idle" | "charging" | "shatter" | "cooldown";

const SPEED_TH = 1.3; // px/ms — how fast counts as "vigorous"
const GAIN = 0.0016; // charge per ms while slicing
const DECAY = 0.0011; // charge drained per ms when not slicing
const CRACK_LIFE = 1100; // ms
const SHATTER_DUR = 1650; // ms shards fall
const COOLDOWN = 1200; // ms after restore before it can trigger again
const GRAVITY = 0.0024; // px/ms^2

const TINTS = [
  [180, 226, 236],
  [150, 210, 245],
  [196, 174, 246],
];

export function ShatterEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.getElementById("shatter-root");

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let phase: Phase = "idle";
    let charge = 0;
    let cracks: Crack[] = [];
    let shards: Shard[] = [];
    let shatterStart = 0;
    let cooldownStart = 0;
    let originX = 0;
    let originY = 0;

    let last: { x: number; y: number; t: number } | null = null;
    let speedEMA = 0;
    let lastMoveT = 0;
    let mx = 0;
    let my = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      mx = e.clientX;
      my = e.clientY;
      lastMoveT = now;
      if (last) {
        const dt = Math.min(Math.max(now - last.t, 1), 64);
        const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
        const speed = dist / dt;
        speedEMA = speedEMA * 0.65 + speed * 0.35;
        if (
          (phase === "idle" || phase === "charging") &&
          speedEMA > SPEED_TH &&
          dist > 4
        ) {
          cracks.push({
            x1: last.x,
            y1: last.y,
            x2: e.clientX,
            y2: e.clientY,
            born: now,
          });
          if (cracks.length > 60) cracks.shift();
        }
      }
      last = { x: e.clientX, y: e.clientY, t: now };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const buildShards = () => {
      shards = [];
      const cols = Math.max(7, Math.round(w / 150));
      const rows = Math.max(5, Math.round(h / 150));
      const cw = w / cols;
      const ch = h / rows;
      const jx = cw * 0.45;
      const jy = ch * 0.45;
      const pts: { x: number; y: number }[][] = [];
      for (let r = 0; r <= rows; r++) {
        pts[r] = [];
        for (let c = 0; c <= cols; c++) {
          const edge = r === 0 || c === 0 || r === rows || c === cols;
          pts[r][c] = {
            x: c * cw + (edge ? 0 : (Math.random() - 0.5) * jx),
            y: r * ch + (edge ? 0 : (Math.random() - 0.5) * jy),
          };
        }
      }
      const addTri = (
        a: { x: number; y: number },
        b: { x: number; y: number },
        cc: { x: number; y: number }
      ) => {
        const cx = (a.x + b.x + cc.x) / 3;
        const cy = (a.y + b.y + cc.y) / 3;
        const local = [a, b, cc].map((p) => ({ x: p.x - cx, y: p.y - cy }));
        const xs = local.map((p) => p.x);
        const ys = local.map((p) => p.y);
        const dirX = cx - originX;
        const dirY = cy - originY;
        const dist = Math.hypot(dirX, dirY) || 1;
        const tint = TINTS[(Math.random() * TINTS.length) | 0];
        shards.push({
          local,
          bbox: {
            minX: Math.min(...xs),
            minY: Math.min(...ys),
            maxX: Math.max(...xs),
            maxY: Math.max(...ys),
          },
          cx,
          cy,
          vx: (dirX / dist) * (0.04 + Math.random() * 0.12) + (Math.random() - 0.5) * 0.05,
          vy: -0.12 - Math.random() * 0.12, // small initial pop up before gravity
          rot: 0,
          vrot: (Math.random() - 0.5) * 0.006,
          delay: Math.min(dist * 0.35, 240) + Math.random() * 60,
          r: tint[0],
          g: tint[1],
          b: tint[2],
        });
      };
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p00 = pts[r][c];
          const p10 = pts[r][c + 1];
          const p11 = pts[r + 1][c + 1];
          const p01 = pts[r + 1][c];
          addTri(p00, p10, p11);
          addTri(p00, p11, p01);
        }
      }
    };

    const startShatter = () => {
      phase = "shatter";
      shatterStart = performance.now();
      originX = mx || w / 2;
      originY = my || h / 2;
      buildShards();
      cracks = [];
      if (root) {
        root.style.transition = "opacity 0.28s ease, transform 0.1s ease, filter 0.28s ease";
        root.style.opacity = "0.1";
      }
    };

    const restore = () => {
      phase = "cooldown";
      cooldownStart = performance.now();
      charge = 0;
      shards = [];
      if (root) {
        root.style.transition = "opacity 0.55s ease, transform 0.55s ease, filter 0.55s ease";
        root.style.opacity = "1";
        root.style.transform = "scale(1.03)";
        root.style.filter = "blur(6px)";
        requestAnimationFrame(() => {
          root.style.transform = "none";
          root.style.filter = "none";
        });
      }
    };

    const drawCracks = (now: number) => {
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (const cr of cracks) {
        const age = (now - cr.born) / CRACK_LIFE;
        if (age >= 1) continue;
        const a = 1 - age;
        ctx.strokeStyle = `hsla(178, 95%, 70%, ${a})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(190, 95%, 60%, ${a})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cr.x1, cr.y1);
        ctx.lineTo(cr.x2, cr.y2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";
    };

    const drawChargeHint = () => {
      // faint pulsing vignette while charging up
      if (charge <= 0.05) return;
      const g = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.35,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.75
      );
      g.addColorStop(0, "rgba(45,212,191,0)");
      g.addColorStop(1, `rgba(45,212,191,${0.18 * charge})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const drawShards = (now: number) => {
      const t = now - shatterStart;

      // initial white flash
      if (t < 200) {
        const fa = (1 - t / 200) * 0.5;
        ctx.fillStyle = `rgba(235,255,252,${fa})`;
        ctx.fillRect(0, 0, w, h);
      }

      // screen shake during early shatter
      if (root) {
        if (t < 320) {
          const s = (1 - t / 320) * 9;
          root.style.transform = `translate(${(Math.random() - 0.5) * s}px, ${(Math.random() - 0.5) * s}px)`;
        } else {
          root.style.transform = "none";
        }
      }

      for (const sh of shards) {
        const lt = t - sh.delay;
        if (lt <= 0) {
          // not launched yet — draw in place, full opacity
          drawShard(sh, sh.cx, sh.cy, 0, 1);
          continue;
        }
        // integrate motion (analytic so it's frame-rate independent)
        const px = sh.cx + sh.vx * lt;
        const py = sh.cy + sh.vy * lt + 0.5 * GRAVITY * lt * lt;
        const rot = sh.vrot * lt;
        const fadeStart = SHATTER_DUR * 0.55;
        let alpha = 1;
        if (t > fadeStart) alpha = Math.max(0, 1 - (t - fadeStart) / (SHATTER_DUR - fadeStart));
        drawShard(sh, px, py, rot, alpha);
      }
    };

    const drawShard = (sh: Shard, px: number, py: number, rot: number, alpha: number) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.translate(px, py);
      if (rot) ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(sh.local[0].x, sh.local[0].y);
      for (let i = 1; i < sh.local.length; i++) ctx.lineTo(sh.local[i].x, sh.local[i].y);
      ctx.closePath();
      const grad = ctx.createLinearGradient(sh.bbox.minX, sh.bbox.minY, sh.bbox.maxX, sh.bbox.maxY);
      grad.addColorStop(0, `rgba(${sh.r},${sh.g},${sh.b},${0.22 * alpha})`);
      grad.addColorStop(1, `rgba(${sh.r},${sh.g},${sh.b},${0.05 * alpha})`);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(225,250,255,${0.5 * alpha})`;
      ctx.stroke();
      ctx.restore();
    };

    let raf = 0;
    let lastFrame = performance.now();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min(Math.max(now - lastFrame, 1), 64);
      lastFrame = now;

      if (phase === "idle" || phase === "charging") {
        const slicing = speedEMA > SPEED_TH && now - lastMoveT < 90;
        if (slicing) {
          phase = "charging";
          const over = Math.min((speedEMA - SPEED_TH) / SPEED_TH + 1, 2.6);
          charge = Math.min(1, charge + GAIN * dt * over);
        } else {
          charge = Math.max(0, charge - DECAY * dt);
          if (charge === 0) phase = "idle";
          if (!slicing) speedEMA *= 0.9;
        }
        if (charge >= 1) {
          startShatter();
        }
      } else if (phase === "shatter") {
        if (now - shatterStart >= SHATTER_DUR) restore();
      } else if (phase === "cooldown") {
        if (now - cooldownStart >= COOLDOWN) {
          phase = "idle";
          if (root) {
            root.style.transition = "";
            root.style.opacity = "";
            root.style.transform = "";
            root.style.filter = "";
          }
        }
      }

      ctx.clearRect(0, 0, w, h);
      if (phase === "shatter") {
        drawShards(now);
      } else {
        drawChargeHint();
        drawCracks(now);
        cracks = cracks.filter((c) => now - c.born < CRACK_LIFE);
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      if (root) {
        root.style.transition = "";
        root.style.opacity = "";
        root.style.transform = "";
        root.style.filter = "";
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1600]"
    />
  );
}
