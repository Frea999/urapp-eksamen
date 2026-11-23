import { useEffect, useLayoutEffect, useRef } from "react";
import styles from "./NumberWheel.module.css";

const ITEM = 34;
const PAD = ITEM * 2;
const COPIES = 5; // et ur-hjul går rundt (23 -> 00), så tallene gentages

function mod(number, count) {
  return ((number % count) + count) % count;
}

export default function NumberWheel({ value, max, onChange, unit, loop, label }) {
  const count = max + 1;
  const copies = loop ? COPIES : 1;
  const total = count * copies;

  const scroller = useRef(null);
  const painted = useRef(new Set());
  const lastValue = useRef(value);
  const programmatic = useRef(false);
  const settleTimer = useRef(null);
  const drag = useRef(null);
  const wasDragged = useRef(false);
  const targetIndex = useRef(0);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  function paint() {
    const el = scroller.current;
    const position = el.scrollTop / ITEM;
    const next = new Set();
    const from = Math.max(0, Math.floor(position) - 3);
    const to = Math.min(total - 1, Math.ceil(position) + 3);

    for (let i = from; i <= to; i++) {
      const child = el.children[i + 1];
      if (!child) continue;
      const distance = Math.min(Math.abs(i - position), 3);
      child.style.opacity = String(1 - 0.28 * distance);
      child.style.transform = `scale(${1 - 0.15 * distance})`;
      child.style.color = distance < 0.5 ? "var(--on-accent)" : "";
      next.add(i);
    }

    for (const i of painted.current) {
      const child = el.children[i + 1];
      if (!next.has(i) && child) {
        child.style.opacity = "";
        child.style.transform = "";
        child.style.color = "";
      }
    }
    painted.current = next;
  }

  function nearestIndex(number) {
    const current = Math.round(scroller.current.scrollTop / ITEM);
    if (!loop) return number;
    const base = current - mod(current, count) + number;
    return [base - count, base, base + count]
      .filter((i) => i >= 0 && i < total)
      .sort((a, b) => Math.abs(a - current) - Math.abs(b - current))[0];
  }

  function goTo(index, emit) {
    const el = scroller.current;
    const number = mod(index, count);
    if (emit && number !== lastValue.current) {
      lastValue.current = number;
      onChangeRef.current(number);
    }
    programmatic.current = true;
    targetIndex.current = index;
    el.scrollTo({ top: index * ITEM, behavior: "smooth" });
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(settle, 400);
  }

  function settle() {
    const el = scroller.current;
    if (!el) return;
    programmatic.current = false;
    if (loop && !drag.current) {
      const index = Math.round(el.scrollTop / ITEM);
      if (index < count || index >= (copies - 1) * count) {
        el.scrollTop = (Math.floor(copies / 2) * count + mod(index, count)) * ITEM;
      }
    }
  }

  function handleScroll() {
    const el = scroller.current;
    paint();
    const number = mod(Math.round(el.scrollTop / ITEM), count);
    if (!programmatic.current && number !== lastValue.current) {
      lastValue.current = number;
      onChangeRef.current(number);
    }
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(settle, 140);
  }

  useLayoutEffect(() => {
    const el = scroller.current;
    el.scrollTop = (loop ? Math.floor(copies / 2) * count + value : value) * ITEM;
    paint();
    return () => clearTimeout(settleTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value === lastValue.current) return;
    lastValue.current = value;
    goTo(nearestIndex(value), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handlePointerDown(e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = scroller.current;
    wasDragged.current = false;
    drag.current = { y: e.clientY, top: el.scrollTop, moved: false };
    el.style.scrollSnapType = "none";
    el.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!drag.current) return;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dy) > 4) drag.current.moved = true;
    if (drag.current.moved) scroller.current.scrollTop = drag.current.top - dy;
  }

  function handlePointerUp() {
    if (!drag.current) return;
    const el = scroller.current;
    const moved = drag.current.moved;
    wasDragged.current = moved;
    drag.current = null;
    el.style.scrollSnapType = "";
    if (moved) el.scrollTo({ top: Math.round(el.scrollTop / ITEM) * ITEM, behavior: "smooth" });
  }

  function handleClick(e) {
    if (wasDragged.current) {
      wasDragged.current = false;
      return;
    }
    const el = scroller.current;
    const y = e.clientY - el.getBoundingClientRect().top + el.scrollTop;
    const index = Math.floor((y - PAD) / ITEM);
    if (index < 0 || index >= total) return;
    goTo(index, true);
  }

  function handleKeyDown(e) {
    const current = programmatic.current ? targetIndex.current : Math.round(scroller.current.scrollTop / ITEM);
    let target = null;
    if (e.key === "ArrowDown") target = current + 1;
    if (e.key === "ArrowUp") target = current - 1;
    if (e.key === "PageDown") target = current + 5;
    if (e.key === "PageUp") target = current - 5;
    if (e.key === "Home") target = loop ? current - mod(current, count) : 0;
    if (e.key === "End") target = loop ? current - mod(current, count) + max : max;
    if (target === null) return;
    e.preventDefault();
    if (!loop) target = Math.min(Math.max(target, 0), max);
    goTo(target, true);
  }

  const items = [];
  for (let i = 0; i < total; i++) {
    const number = i % count;
    items.push(
      <div key={i} className={styles.item} aria-hidden="true">
        {loop ? String(number).padStart(2, "0") : number}
      </div>
    );
  }

  return (
    <div className={`${styles.wheel} ${unit ? styles.withUnit : ""}`}>
      <div
        ref={scroller}
        className={styles.scroller}
        role="spinbutton"
        tabIndex={0}
        aria-label={label || unit}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.spacer}></div>
        {items}
        <div className={styles.spacer}></div>
      </div>
      {unit && <span className={styles.unit}>{unit}</span>}
    </div>
  );
}
