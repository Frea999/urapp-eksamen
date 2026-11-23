import { useState } from "react";
import { Link } from "react-router";
import Toggle from "../components/Toggle";
import styles from "./ThemePage.module.css";
import ocean from "../assets/themes/ocean.png";
import hearts from "../assets/themes/hearts.png";
import leaves from "../assets/themes/leaves.png";
import ribbons from "../assets/themes/ribbons.png";
import crosses from "../assets/themes/crosses.png";
import web from "../assets/themes/web.png";

const themes = [
  { name: "Hav", color: "#488eff", image: ocean, darkText: true },
  { name: "Hjerter", color: "#fa86c4", image: hearts, darkText: true },
  { name: "Blade", color: "#4a8626", image: leaves, darkText: true },
  { name: "Bånd", color: "#449793", image: ribbons, darkText: true },
  { name: "Kryds", color: "#270404", image: crosses, darkText: false },
  { name: "Spind", color: "#2c2c2c", image: web, darkText: false },
];

export default function ThemePage() {
  const [selectedTheme, setSelectedTheme] = useState(null);

  function chooseTheme(name) {
    // Klik på det valgte tema igen for at slå det fra
    setSelectedTheme(selectedTheme === name ? null : name);
  }

  return (
    <main>
      <div className="top-buttons">
        <Link to="/rediger/farver" className={`pill-button ${styles.linkButton}`}>
          Design selv
        </Link>
      </div>

      <h1 className={styles.title}>Tema</h1>

      {themes.map((theme) => (
        <div
          key={theme.name}
          className={styles.theme}
          style={{ backgroundColor: theme.color, backgroundImage: `url(${theme.image})` }}
        >
          <div className={theme.darkText ? styles.darkText : styles.whiteText}>
            <p className={styles.name}>{theme.name}</p>
            <p>Tema</p>
          </div>
          <Toggle on={selectedTheme === theme.name} onClick={() => chooseTheme(theme.name)} />
        </div>
      ))}
    </main>
  );
}
