import { useState } from "react";
import { Link } from "react-router";
import styles from "./DetailsPage.module.css";
import selectedIcon from "../assets/icons/selected.svg";
import bubbles from "../assets/effects/bubbles.png";
import hearts from "../assets/effects/hearts.png";
import leaves from "../assets/effects/leaves.png";
import crosses from "../assets/effects/crosses.png";
import lines from "../assets/effects/lines.png";
import bonds from "../assets/effects/bonds.png";
import animationBubbles from "../assets/effects/animation-bubbles.png";

const effects = [bubbles, hearts, leaves, crosses, lines, bonds];

export default function DetailsPage() {
  const [effect, setEffect] = useState(bubbles);
  const [animation, setAnimation] = useState(true);

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/rediger/farver" className={`pill-button ${styles.linkButton} ${styles.gray}`}>
          Tilbage
        </Link>
        <Link to="/rediger" className={`pill-button orange-button ${styles.linkButton}`}>
          Gem
        </Link>
      </div>

      <h1>Effekter</h1>
      <div className={styles.grid}>
        {effects.map((image) => (
          <button key={image} className={styles.effect} onClick={() => setEffect(image)}>
            <img src={image} alt="" />
            {effect === image && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          </button>
        ))}
      </div>

      <h1>Animation</h1>
      <div className={styles.grid}>
        <button className={styles.animation} onClick={() => setAnimation(true)}>
          <p>Animation</p>
          <div className={styles.preview}>
            <img src={animationBubbles} alt="" className={styles.floating} />
            {animation && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          </div>
        </button>
        <button className={styles.animation} onClick={() => setAnimation(false)}>
          <p>Ingen animation</p>
          <div className={styles.preview}>
            <img src={animationBubbles} alt="" />
            {!animation && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          </div>
        </button>
      </div>
    </main>
  );
}
