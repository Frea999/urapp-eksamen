import styles from "./Toggle.module.css";

export default function Toggle({ on, onClick }) {
  return (
    <button className={on ? styles.toggleOn : styles.toggle} onClick={onClick}>
      <span className={styles.thumb}></span>
    </button>
  );
}
