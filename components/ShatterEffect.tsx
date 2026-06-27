"use client";

import { useEffect, useRef } from "react";

interface Vec {
  x: number;
  y: number;
}

interface Line {
  p: Vec; // a point on the line
  n: Vec; // unit normal
  angle: number;
  mid: Vec;
}

interface Crack {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  born: number;
}

interface Shard {
  local: Vec[]; // polygon points relative to centroid
  bbox: { minX: number; minY: number; maxX: number; maxY: number };
  cx: number;
  cy: number;
  vx: number;
  vy: number;
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

// ---- geometry helpers (pure) ----
const sdist = (v: Vec, L: Line) => (v.x - L.p.x) * L.n.x + (v.y - L.p.y) * L.n.y;

// Clip a convex polygon to one half-plane of a line (Sutherland–Hodgman).
const clip = (poly: Vec[], L: Line, side: number): Vec[] => {
  const res: Vec[] = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const nxt = poly[(i + 1) % poly.length];
    const dc = sdist(cur, L) * side;
    const dn = sdist(nxt, L) * side;
    if (dc >= 0) res.push(cur);
    if (dc >= 0 !== dn >= 0) {
      const t = dc / (dc - dn);
      res.push({ x: cur.x + (nxt.x - cur.x) * t, y: cur.y + (nxt.y - cur.y) * t });
    }
  }
  return res;
};

const polyArea = (poly: Vec[]) => {
  let s = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    s += a.x * b.y - b.x * a.y;
  }
  return Math.abs(s / 2);
};

const lineFromSeg = (a: Vec, b: Vec): Line => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    p: a,
    n: { x: -dy / len, y: dx / len },
    angle: Math.atan2(dy, dx),
    mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
  };
};

const sameLine = (a: Line, b: Line) => {
  let da = Math.abs(a.angle - b.angle) % Math.PI;
  da = Math.min(da, Math.PI - da);
  if (da > 0.22) return false; // within ~12.6°
  const off = Math.abs((b.p.x - a.p.x) * a.n.x + (b.p.y - a.p.y) * a.n.y);
  return off < 36; // and within 36px
};

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
          cracks.push({ x1: last.x, y1: last.y, x2: e.clientX, y2: e.clientY, born: now });
          if (cracks.length > 80) cracks.shift();
        }
      }
      last = { x: e.clientX, y: e.clientY, t: now };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Build shards by slicing the viewport along the actual mouse cut paths.
    const buildShardsFromCuts = (cuts: Crack[]) => {
      shards = [];

      // 1. Primary cut lines from the user's strokes (deduped).
      const primary: Line[] = [];
      for (const c of cuts) {
        if (Math.hypot(c.x2 - c.x1, c.y2 - c.y1) < 12) continue;
        const L = lineFromSeg({ x: c.x1, y: c.y1 }, { x: c.x2, y: c.y2 });
        if (primary.some((p) => sameLine(p, L))) continue;
        primary.push(L);
        if (primary.length >= 14) break;
      }

      // 2. Splinter lines clustered around each cut, so glass fractures along the path.
      const lines: Line[] = [...primary];
      for (const p of primary) {
        const off = (18 + Math.random() * 42) * (Math.random() < 0.5 ? -1 : 1);
        lines.push({
          p: { x: p.p.x + p.n.x * off, y: p.p.y + p.n.y * off },
          n: p.n,
          angle: p.angle,
          mid: p.mid,
        });
        const ang = p.angle + (0.14 + Math.random() * 0.32) * (Math.random() < 0.5 ? -1 : 1);
        const dir = { x: Math.cos(ang), y: Math.sin(ang) };
        lines.push({ p: p.mid, n: { x: -dir.y, y: dir.x }, angle: ang, mid: p.mid });
        if (lines.length >= 32) break;
      }

      // 3. If there were barely any cuts, add a few through the cursor so it still shatters.
      if (primary.length < 2) {
        for (let k = 0; k < 4; k++) {
          const ang = Math.random() * Math.PI;
          const dir = { x: Math.cos(ang), y: Math.sin(ang) };
          lines.push({ p: { x: originX, y: originY }, n: { x: -dir.y, y: dir.x }, angle: ang, mid: { x: originX, y: originY } });
        }
      }

      // 4. Slice the full-screen rectangle by every line into convex pieces.
      let polys: Vec[][] = [[
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: h },
        { x: 0, y: h },
      ]];
      for (const L of lines) {
        const out: Vec[][] = [];
        for (const poly of polys) {
          const pos = clip(poly, L, 1);
          const neg = clip(poly, L, -1);
          if (pos.length >= 3) out.push(pos);
          if (neg.length >= 3) out.push(neg);
        }
        polys = out;
        if (polys.length > 520) break;
      }

      // 5. Blast center = average of where the cuts happened.
      let bx = 0;
      let by = 0;
      if (cuts.length) {
        for (const c of cuts) {
          bx += (c.x1 + c.x2) / 2;
          by += (c.y1 + c.y2) / 2;
        }
        bx /= cuts.length;
        by /= cuts.length;
      } else {
        bx = originX;
        by = originY;
      }

      for (const poly of polys) {
        if (polyArea(poly) < 120) continue;
        let cx = 0;
        let cy = 0;
        for (const v of poly) {
          cx += v.x;
          cy += v.y;
        }
        cx /= poly.length;
        cy /= poly.length;
        const local = poly.map((v) => ({ x: v.x - cx, y: v.y - cy }));
        const xs = local.map((p) => p.x);
        const ys = local.map((p) => p.y);
        const dx = cx - bx;
        const dy = cy - by;
        const dist = Math.hypot(dx, dy) || 1;
        const tint = TINTS[(Math.random() * TINTS.length) | 0];
        shards.push({
          local,
          bbox: { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) },
          cx,
          cy,
          vx: (dx / dist) * (0.05 + Math.random() * 0.13) + (Math.random() - 0.5) * 0.04,
          vy: -0.05 - Math.random() * 0.12,
          vrot: (Math.random() - 0.5) * 0.006,
          delay: Math.min(dist * 0.3, 220) + Math.random() * 50,
          r: tint[0],
          g: tint[1],
          b: tint[2],
        });
      }
    };

    const startShatter = () => {
      phase = "shatter";
      shatterStart = performance.now();
      originX = mx || w / 2;
      originY = my || h / 2;
      const cuts = cracks.slice();
      buildShardsFromCuts(cuts);
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

    const drawShards = (now: number) => {
      const t = now - shatterStart;

      if (t < 200) {
        const fa = (1 - t / 200) * 0.5;
        ctx.fillStyle = `rgba(235,255,252,${fa})`;
        ctx.fillRect(0, 0, w, h);
      }

      if (root) {
        if (t < 320) {
          const s = (1 - t / 320) * 9;
          root.style.transform = `translate(${(Math.random() - 0.5) * s}px, ${(Math.random() - 0.5) * s}px)`;
        } else {
          root.style.transform = "none";
        }
      }

      const fadeStart = SHATTER_DUR * 0.55;
      for (const sh of shards) {
        const lt = t - sh.delay;
        if (lt <= 0) {
          drawShard(sh, sh.cx, sh.cy, 0, 1);
          continue;
        }
        const px = sh.cx + sh.vx * lt;
        const py = sh.cy + sh.vy * lt + 0.5 * GRAVITY * lt * lt;
        const rot = sh.vrot * lt;
        let alpha = 1;
        if (t > fadeStart) alpha = Math.max(0, 1 - (t - fadeStart) / (SHATTER_DUR - fadeStart));
        drawShard(sh, px, py, rot, alpha);
      }
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
          speedEMA *= 0.9;
        }
        if (charge >= 1) startShatter();
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
