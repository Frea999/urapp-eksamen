import { Link } from "react-router";
import Toggle from "../../../components/Toggle/Toggle";
import styles from "./ThemePage.module.css";
import { themes, originalTheme } from "../../../themes";

export default function ThemePage({ theme, setTheme }) {
  function chooseTheme(newTheme) {
    if (!newTheme.ready) return;

    if (newTheme.original) {
      setTheme(null);
    } else if (theme && theme.name === newTheme.name) {
      setTheme(null);
    } else {
      setTheme(newTheme);
    }
  }

  return (
    <main>
      <div className="top-buttons">
        <Link to="/rediger/farver" className={`pill-button ${styles.linkButton}`}>
          Design selv
        </Link>
      </div>

      <h1 className={styles.title}>Tema</h1>

      {theme && theme.name === "Eget design" && (
        <div className={styles.own}>
          <p>Du bruger dit eget design</p>
          <button className="pill-button" onClick={() => setTheme(null)}>
            Slå fra
          </button>
        </div>
      )}

      {[originalTheme, ...themes].map((item) => (
        <div
          key={item.name}
          className={styles.theme}
          style={{ backgroundColor: item.color, backgroundImage: item.banner ? `url("${item.banner}")` : "none" }}
        >
          <div className={item.darkText ? styles.darkText : styles.whiteText}>
            <p className={styles.name}>{item.name}</p>
            <p>Tema</p>
          </div>
          <Toggle on={item.original ? theme === null : theme !== null && theme.name === item.name} onClick={() => chooseTheme(item)} />
        </div>
      ))}

    </main>
  );
}
