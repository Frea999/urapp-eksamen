import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./Floating.module.css";

const Shape = motion.span;

function random(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// direction: -1 = op, 1 = ned. blink = står stille og toner ind og ud. slash = tegnes som et hug og viskes ud
const kinds = {
  bubbles: {
    seed: 7,
    direction: -1,
    rotate: 0,
    sway: [6, 24],
    height: 1,
    groups: [
      { count: 30, size: [5, 9], duration: [50, 65] },
      { count: 24, size: [14, 28], duration: [30, 40] },
      { count: 14, size: [34, 54], duration: [16, 22] },
    ],
  },
  leaves: {
    seed: 11,
    direction: 1,
    rotate: 28,
    sway: [10, 38],
    height: 0.5,
    groups: [
      { count: 30, size: [10, 17], duration: [50, 65] },
      { count: 24, size: [24, 38], duration: [30, 40] },
      { count: 14, size: [58, 78], duration: [16, 22] },
    ],
  },
  ribbons: {
    seed: 31,
    direction: -1,
    rotate: 0,
    flip: [3, 5.5],
    sway: [0, 0],
    height: 3,
    groups: [
      { count: 30, size: [6, 10], duration: [50, 65] },
      { count: 24, size: [12, 20], duration: [30, 40] },
      { count: 14, size: [24, 34], duration: [16, 22] },
      { count: 5, size: [44, 60], duration: [11, 15] },
    ],
  },
  crosses: {
    seed: 41,
    direction: 0,
    rotate: 0,
    blink: true,
    sway: [0, 0],
    height: 1,
    groups: [
      { count: 30, size: [10, 16], duration: [2.5, 5] },
      { count: 24, size: [22, 34], duration: [3, 6] },
      { count: 14, size: [44, 70], duration: [4, 7] },
    ],
  },
  webs: {
    seed: 53,
    direction: 0,
    rotate: 0,
    slash: true,
    sway: [0, 0],
    height: 0.025,
    groups: [
      { count: 24, size: [60, 120], duration: [1.3, 2.6] },
      { count: 18, size: [120, 200], duration: [1.6, 3] },
      { count: 8, size: [200, 300], duration: [2, 3.6] },
    ],
  },
  hearts: {
    seed: 23,
    direction: -1,
    rotate: 0,
    flip: [2.5, 4.5],
    sway: [0, 0],
    height: 1,
    groups: [
      { count: 30, size: [8, 14], duration: [50, 65] },
      { count: 24, size: [20, 34], duration: [30, 40] },
      { count: 14, size: [44, 64], duration: [16, 22] },
    ],
  },
};

function makeShapes({ seed, rotate, flip, sway, blink, slash, groups }) {
  const rand = random(seed);
  return groups
    .flatMap(({ count, size: [minSize, maxSize], duration: [minTime, maxTime] }) =>
      Array.from({ length: count }, (_, i) => ({
        size: minSize + rand() * (maxSize - minSize),
        left: ((i + rand()) / count) * 100,
        duration: minTime + rand() * (maxTime - minTime),
        phase: rand(),
        sway: sway[0] + rand() * (sway[1] - sway[0]),
        swayDuration: 4 + rand() * 5,
        angle: slash ? (rand() < 0.75 ? -1 : 1) * (25 + rand() * 40) : blink ? rand() * 90 : rotate ? (rand() - 0.5) * 120 : 0,
        flipDuration: flip ? flip[0] + rand() * (flip[1] - flip[0]) : 0,
      })),
    )
    .map((shape, id) => ({ ...shape, id }));
}

const shapesByKind = Object.fromEntries(Object.entries(kinds).map(([name, kind]) => [name, makeShapes(kind)]));

const GAP = 8;
const MAX_APP_WIDTH = 430; // skal passe med bredden i Floating.module.css

function useLayerSize() {
  const read = () => ({ width: Math.min(window.innerWidth, MAX_APP_WIDTH), height: window.innerHeight });
  const [size, setSize] = useState(read);
  useEffect(() => {
    const update = () => setSize(read());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

// Hvor langt formen rækker ud fra midten (vandret og lodret). Drejede former (blade) fylder mere, fordi hjørnerne stikker ud
function extent(kind, shape) {
  const { rotate, height } = kinds[kind];
  const half = shape.size / 2;
  return rotate
    ? { x: half * Math.hypot(1, height), y: half * Math.hypot(1, height) }
    : { x: half, y: half * height };
}

function scatter(kind, width, height) {
  const { seed, rotate, blink, slash, height: ratio } = kinds[kind];
  const rand = random(seed + 100);
  const placed = [];
  [...shapesByKind[kind]]
    .sort((a, b) => b.size - a.size)
    .forEach((shape) => {
      const radius = (shape.size / 2) * (rotate || blink ? Math.hypot(1, ratio) : slash ? 1 : Math.max(1, ratio));
      if (width < radius * 2 || height < radius * 2) return;

      if (slash) {
        const rad = (shape.angle * Math.PI) / 180;
        const halfW = (shape.size / 2) * Math.abs(Math.cos(rad));
        const halfH = (shape.size / 2) * Math.abs(Math.sin(rad));
        let best = null;
        for (let attempt = 0; attempt < 14; attempt++) {
          const x = halfW + rand() * Math.max(0, width - halfW * 2);
          const y = halfH + rand() * Math.max(0, height - halfH * 2);
          const gap = placed.reduce((min, p) => Math.min(min, Math.hypot(p.x - x, p.y - y)), Infinity);
          if (!best || gap > best.gap) best = { x, y, gap };
        }
        placed.push({ ...shape, x: best.x, y: best.y, radius });
        return;
      }

      for (let attempt = 0; attempt < 60; attempt++) {
        const x = radius + rand() * (width - radius * 2);
        const y = radius + rand() * (height - radius * 2);
        if (placed.every((p) => Math.hypot(p.x - x, p.y - y) >= p.radius + radius + GAP)) {
          placed.push({ ...shape, x, y, radius });
          break;
        }
      }
    });
  return placed;
}

export default function Floating({ kind, still = false }) {
  const frozen = useReducedMotion() || still;
  const { width, height: layerHeight } = useLayerSize();
  const { direction, rotate, flip, blink, slash, height } = kinds[kind];
  const placed = useMemo(
    () => (frozen || blink || slash ? scatter(kind, width, layerHeight) : []),
    [frozen, blink, slash, kind, width, layerHeight],
  );

  if (slash && !frozen) {
    return (
      <div className={styles.layer} aria-hidden="true">
        {placed.map((s) => (
          <Shape
            key={s.id}
            className={`${styles.shape} ${styles[kind]}`}
            style={{
              width: s.size,
              height: s.size * height,
              left: s.x - s.size / 2,
              top: s.y - (s.size * height) / 2,
              rotate: s.angle,
            }}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{
              clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0 0 100%)", "inset(0 0 0 100%)"],
            }}
            transition={{
              duration: s.duration,
              times: [0, 0.05, 0.2, 0.36, 1],
              delay: -s.phase * s.duration,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (blink && !frozen) {
    return (
      <div className={styles.layer} aria-hidden="true">
        {placed.map((s) => (
          <Shape
            key={s.id}
            className={`${styles.shape} ${styles[kind]}`}
            style={{
              width: s.size,
              height: s.size * height,
              left: s.x - s.size / 2,
              top: s.y - (s.size * height) / 2,
              rotate: s.angle,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.6] }}
            transition={{
              duration: s.duration,
              times: [0, 0.35, 0.6, 1],
              delay: -s.phase * s.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (frozen) {
    return (
      <div className={styles.layer} aria-hidden="true">
        {placed.map((s) => (
          <span
            key={s.id}
            className={`${styles.shape} ${styles[kind]}`}
            style={{
              width: s.size,
              height: s.size * height,
              left: s.x - s.size / 2,
              top: s.y - (s.size * height) / 2,
              transform: `rotate(${s.angle}deg)`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.layer} aria-hidden="true">
      {shapesByKind[kind].map((s) => {
        // Formen holder sig helt inden for siden (også når den vugger) og er helt uden for skærmen, når den starter og slutter
        const reach = extent(kind, s);
        const margin = reach.x + s.sway;
        const left = margin + (s.left / 100) * Math.max(0, width - margin * 2);
        const travel = direction * (layerHeight + reach.y * 2);
        return (
          <Shape
            key={s.id}
            className={`${styles.shape} ${styles[kind]} ${direction < 0 ? styles.rising : styles.falling}`}
            style={{ width: s.size, height: s.size * height, left: left - s.size / 2 }}
            initial={{ x: 0, y: 0, rotate: s.angle }}
            animate={{
              ...(s.sway && { x: [0, s.sway, -s.sway, 0] }),
              ...(flip && { rotateY: [0, 360] }),
              y: travel,
              ...(rotate && { rotate: [s.angle - rotate, s.angle + rotate, s.angle - rotate] }),
            }}
            transition={{
              y: { duration: s.duration, delay: -s.phase * s.duration, repeat: Infinity, ease: "linear" },
              x: { duration: s.swayDuration, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: s.swayDuration, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: s.flipDuration, repeat: Infinity, ease: "linear" },
            }}
          />
        );
      })}
    </div>
  );
}
