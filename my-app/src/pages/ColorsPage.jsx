import { useState } from "react";
import { Link } from "react-router";
import styles from "./ColorsPage.module.css";
import closeIcon from "../assets/icons/close.svg";
import selectedIcon from "../assets/icons/selected.svg";

const backgroundColors = ["#488eff", "#fa86c4", "#4a8626", "#270404", "#2c2c2c", "#449793"];
const accentColors = ["#ff9f43", ...backgroundColors];

export default function ColorsPage() {
  const [background, setBackground] = useState("#488eff");
  const [accent, setAccent] = useState("#ff9f43");

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/rediger" className="circle-button">
          <img src={closeIcon} alt="Luk" />
        </Link>
        <Link to="/rediger/detaljer" className={`pill-button orange-button ${styles.linkButton}`}>
          Næste
        </Link>
      </div>

      <h1>Baggrund</h1>
      <div className={styles.grid}>
        {backgroundColors.map((color) => (
          <button
            key={color}
            className={styles.color}
            style={{ backgroundColor: color }}
            onClick={() => setBackground(color)}
          >
            {background === color && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          </button>
        ))}
        <button className={styles.textButton}>Vælg en farve</button>
        <button className={styles.textButton}>Vælg et billed</button>
      </div>

      <h1>Accent farve</h1>
      <div className={styles.grid}>
        {accentColors.map((color) => (
          <button
            key={color}
            className={styles.color}
            style={{ backgroundColor: color }}
            onClick={() => setAccent(color)}
          >
            {accent === color && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          </button>
        ))}
        <button className={styles.textButton}>Vælg en farve</button>
      </div>
    </main>
  );
}
