import { useRef } from "react";
import styles from "./ColorWheel.module.css";

export default function ColorWheel({ hue, saturation, brightness, color, onChange }) {
  const wheel = useRef(null);
  const dragging = useRef(false);

  function pick(e) {
    const rect = wheel.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const distance = Math.hypot(dx, dy) / (rect.width / 2);
    onChange(Math.round((angle + 360) % 360), Math.round(Math.min(distance, 1) * 100));
  }

  function handlePointerDown(e) {
    dragging.current = true;
    wheel.current.setPointerCapture(e.pointerId);
    pick(e);
  }

  function handlePointerMove(e) {
    if (dragging.current) pick(e);
  }

  function handleKeyDown(e) {
    const steps = { ArrowRight: [5, 0], ArrowLeft: [-5, 0], ArrowUp: [0, 5], ArrowDown: [0, -5] };
    const step = steps[e.key];
    if (!step) return;
    e.preventDefault();
    onChange((Math.round(hue) + step[0] + 360) % 360, Math.min(100, Math.max(0, Math.round(saturation) + step[1])));
  }

  const radians = (hue * Math.PI) / 180;
  const distance = saturation / 2;
  const left = 50 + distance * Math.sin(radians);
  const top = 50 - distance * Math.cos(radians);

  return (
    <div
      ref={wheel}
      className={styles.wheel}
      role="slider"
      tabIndex={0}
      aria-label="Farve og mætning"
      aria-valuetext={`Farvetone ${Math.round(hue)} grader, mætning ${Math.round(saturation)} procent`}
      aria-valuenow={Math.round(hue)}
      aria-valuemin={0}
      aria-valuemax={359}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.shade} style={{ opacity: 1 - brightness / 100 }}></div>
      <div className={styles.marker} style={{ left: `${left}%`, top: `${top}%`, backgroundColor: color }}></div>
    </div>
  );
}
