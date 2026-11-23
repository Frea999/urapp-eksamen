import { Link } from "react-router";
import styles from "./DetailsPage.module.css";
import selectedIcon from "../assets/icons/selected.svg";
import animationBubbles from "../assets/effects/animation-bubbles.png";
import { effects, makeOwnTheme } from "../themes";

export default function DetailsPage({ design, setDesign, setTheme }) {
  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/rediger/farver" className={`pill-button ${styles.linkButton} ${styles.gray}`}>
          Tilbage
        </Link>
        <Link
          to="/rediger"
          className={`pill-button orange-button ${styles.linkButton}`}
          onClick={() => setTheme(makeOwnTheme(design))}
        >
          Gem
        </Link>
      </div>

      <h1>Effekter</h1>
      <div className={styles.grid}>
        {effects.map((effect) => (
          <button key={effect.name} className={styles.effect} onClick={() => setDesign({ ...design, effect: effect })}>
            <img src={effect.image} alt={effect.name} />
            {design.effect.name === effect.name && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          </button>
        ))}
      </div>

      <h1>Animation</h1>
      <div className={styles.grid}>
        <button className={styles.animation} onClick={() => setDesign({ ...design, animation: true })}>
          <p>Animation</p>
          <div className={styles.preview}>
            <img src={animationBubbles} alt="" className={styles.floating} />
            {design.animation && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          </div>
        </button>
        <button className={styles.animation} onClick={() => setDesign({ ...design, animation: false })}>
          <p>Ingen animation</p>
          <div className={styles.preview}>
            <img src={animationBubbles} alt="" />
            {!design.animation && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          </div>
        </button>
      </div>
    </main>
  );
}
