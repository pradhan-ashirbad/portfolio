"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  t: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    const LIFE = 360; // ms a point stays in the trail
    const MAX = 50; // cap stored points
    let points: Point[] = [];

    const onMove = (e: MouseEvent) => {
      points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (points.length > MAX) points.shift();
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Build a smooth path through the points using midpoint quadratics.
    const tracePath = () => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
    };

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);

      const now = performance.now();
      while (points.length && now - points[0].t > LIFE) points.shift();
      if (points.length < 2) return;

      const head = points[points.length - 1];
      const tail = points[0];

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalCompositeOperation = "lighter";

      // gradient runs from the (faded) tail to the (bright) head
      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      grad.addColorStop(0, "hsla(280, 90%, 62%, 0)"); // violet, transparent
      grad.addColorStop(0.45, "hsla(220, 92%, 62%, 0.45)"); // sky
      grad.addColorStop(1, "hsla(172, 95%, 60%, 0.95)"); // teal, bright

      // Pass 1 — soft wide glow
      ctx.shadowBlur = 18;
      ctx.shadowColor = "hsla(190, 95%, 60%, 0.9)";
      ctx.strokeStyle = grad;
      ctx.lineWidth = 13;
      tracePath();
      ctx.stroke();

      // Pass 2 — bright thin core
      const core = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      core.addColorStop(0, "rgba(255,255,255,0)");
      core.addColorStop(0.6, "rgba(214,250,245,0.55)");
      core.addColorStop(1, "rgba(240,255,252,0.98)");
      ctx.shadowBlur = 8;
      ctx.shadowColor = "hsla(172, 95%, 65%, 1)";
      ctx.strokeStyle = core;
      ctx.lineWidth = 3;
      tracePath();
      ctx.stroke();

      // Glowing tip at the cursor
      ctx.beginPath();
      ctx.fillStyle = "rgba(245,255,252,0.95)";
      ctx.shadowBlur = 16;
      ctx.shadowColor = "hsla(172, 95%, 65%, 1)";
      ctx.arc(head.x, head.y, 2.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
    />
  );
}
