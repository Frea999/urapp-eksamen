import styles from "./RingOverlay.module.css";

export default function RingOverlay({ title, text, onStop, onSnooze }) {
  return (
    <div className={styles.background} role="alertdialog" aria-label={title}>
      <div className={styles.content}>
        <div className={styles.pulse}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v.6A6.5 6.5 0 0 1 18.5 10.5V15l2 3v1H3.5v-1l2-3v-4.5A6.5 6.5 0 0 1 10.5 4.1v-.6A1.5 1.5 0 0 1 12 2Zm-2.5 18h5a2.5 2.5 0 0 1-5 0Z" />
          </svg>
        </div>
        <p className={styles.title}>{title}</p>
        <p className={styles.text}>{text}</p>
      </div>
      <div className={styles.buttons}>
        {onSnooze && (
          <button className={`round-button ${styles.button}`} onClick={onSnooze}>
            Snooze
          </button>
        )}
        <button className={`round-button red ${styles.button}`} onClick={onStop}>
          Stop
        </button>
      </div>
    </div>
  );
}
