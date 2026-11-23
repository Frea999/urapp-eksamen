import styles from "./Sheet.module.css";
import closeIcon from "../assets/icons/close.svg";
import checkIcon from "../assets/icons/check.svg";

// Et vindue der lægger sig over siden, fx "Tilføj alarm" eller "Lyd"
export default function Sheet({ title, onClose, onSave, children }) {
  return (
    <div className={styles.background}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <button className="circle-button" onClick={onClose}>
            <img src={closeIcon} alt="Luk" />
          </button>
          <h2>{title}</h2>
          {onSave ? (
            <button className="circle-button orange-button" onClick={onSave}>
              <img src={checkIcon} alt="Gem" />
            </button>
          ) : (
            <div className={styles.empty}></div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
