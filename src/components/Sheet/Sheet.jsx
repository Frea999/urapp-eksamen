import { useState } from "react";
import styles from "./Sheet.module.css";
import closeIcon from "../../assets/icons/close.svg";
import checkIcon from "../../assets/icons/check.svg";

const CLOSE_TIME = 250; // skal passe med animationen i Sheet.module.css

export default function Sheet({ title, onClose, onSave, children }) {
  const [closing, setClosing] = useState(false);

  function close(after) {
    if (closing) return;
    setClosing(true);
    setTimeout(after || onClose, CLOSE_TIME);
  }

  return (
    <div className={`${styles.background} ${closing ? styles.backgroundClosing : ""}`}>
      <div className={`${styles.sheet} ${closing ? styles.sheetClosing : ""}`}>
        <div className={styles.header}>
          <button className="circle-button" onClick={() => close()}>
            <img src={closeIcon} alt="Luk" />
          </button>
          <h2>{title}</h2>
          {onSave ? (
            <button className="circle-button orange-button" onClick={() => close(onSave)}>
              <img src={checkIcon} alt="Gem" />
            </button>
          ) : (
            <div className={styles.empty}></div>
          )}
        </div>
        {typeof children === "function" ? children(() => close()) : children}
      </div>
    </div>
  );
}
