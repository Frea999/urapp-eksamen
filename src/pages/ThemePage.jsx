import { Link } from "react-router";
import Toggle from "../components/Toggle";
import styles from "./ThemePage.module.css";
import { themes } from "../themes";

export default function ThemePage({ theme, setTheme }) {
  function chooseTheme(newTheme) {
    // Temaer uden færdigt design gør ikke noget endnu
    if (!newTheme.ready) return;

    // Klik på det valgte tema igen for at gå tilbage til det sorte standard-design
    if (theme && theme.name === newTheme.name) {
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

      {themes.map((item) => (
        <div
          key={item.name}
          className={styles.theme}
          style={{ backgroundColor: item.color, backgroundImage: `url(${item.banner})` }}
        >
          <div className={item.darkText ? styles.darkText : styles.whiteText}>
            <p className={styles.name}>{item.name}</p>
            <p>Tema</p>
          </div>
          <Toggle on={theme !== null && theme.name === item.name} onClick={() => chooseTheme(item)} />
        </div>
      ))}

      {theme && theme.name === "Eget design" && (
        <div className={styles.own}>
          <p>Du bruger dit eget design</p>
          <button className="pill-button" onClick={() => setTheme(null)}>
            Slå fra
          </button>
        </div>
      )}
    </main>
  );
}
