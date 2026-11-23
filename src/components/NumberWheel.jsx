import styles from "./NumberWheel.module.css";

// En kolonne med tal som i iPhone-uret. Klik på et tal over eller under for at vælge det.
export default function NumberWheel({ value, max, onChange, unit, loop }) {
  const rows = [];

  for (let offset = -3; offset <= 3; offset++) {
    let number = value + offset;

    // Ur-tid går rundt (23 -> 00), men en tidtagning stopper ved 0
    if (loop) {
      if (number < 0) number = number + max + 1;
      if (number > max) number = number - max - 1;
    } else if (number < 0 || number > max) {
      rows.push(<div key={offset} className={styles.row}></div>);
      continue;
    }

    const text = loop ? String(number).padStart(2, "0") : number;

    rows.push(
      <button
        key={offset}
        className={`${styles.row} ${styles["distance" + Math.abs(offset)]}`}
        onClick={() => onChange(number)}
      >
        {text}
        {offset === 0 && unit && <span className={styles.unit}>{unit}</span>}
      </button>
    );
  }

  return <div className={styles.wheel}>{rows}</div>;
}
