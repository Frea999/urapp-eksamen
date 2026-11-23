import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { discardUnusedBackground, uploadBackground } from "../../../images";
import ColorSheet from "../ColorSheet/ColorSheet";
import styles from "./ColorsPage.module.css";
import closeIcon from "../../../assets/icons/close.svg";
import selectedIcon from "../../../assets/icons/selected.svg";
import { themes, isLight } from "../../../themes";

const backgroundColors = themes.map((theme) => theme.color);
const accentColors = ["#ff9f43", ...backgroundColors];

function CustomColorButton({ color, presets, selected = true, onClick }) {
  const custom = selected && !presets.includes(color);
  return (
    <button
      className={styles.textButton}
      style={custom ? { backgroundColor: color, color: isLight(color) ? "#39393d" : "#f7f7f7" } : undefined}
      onClick={onClick}
    >
      Vælg en farve
      {custom && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
    </button>
  );
}

export default function ColorsPage({ design, setDesign, imageUrl, activeImage }) {
  const { user } = useAuth();
  const [picking, setPicking] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function chooseColor(color) {
    discardUnusedBackground(design.image, activeImage);
    setDesign({ ...design, color: color, image: null });
  }

  async function chooseFile(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const path = await uploadBackground(user.id, file);
      discardUnusedBackground(design.image, activeImage);
      setDesign({ ...design, image: path });
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  }

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
            onClick={() => chooseColor(color)}
          >
            {!design.image && design.color === color && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          </button>
        ))}
        <CustomColorButton
          color={design.color}
          presets={backgroundColors}
          selected={!design.image}
          onClick={() => setPicking("color")}
        />
        <label className={styles.textButton}>
          {design.image && imageUrl ? (
            <img src={imageUrl} alt="Dit billede" className={styles.photo} />
          ) : (
            <span className={styles.photoText}>{uploading ? "Uploader..." : "Vælg et billede"}</span>
          )}
          {design.image && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          <input className={styles.fileInput} type="file" accept="image/*" disabled={uploading} onChange={chooseFile} />
        </label>
      </div>
      {error && <p className={styles.error}>{error}</p>}

      <h1>Accent farve</h1>
      <div className={styles.grid}>
        {accentColors.map((color) => (
          <button
            key={color}
            className={styles.color}
            style={{ backgroundColor: color }}
            onClick={() => setDesign({ ...design, accent: color })}
          >
            {design.accent === color && <img src={selectedIcon} alt="Valgt" className={styles.check} />}
          </button>
        ))}
        <CustomColorButton color={design.accent} presets={accentColors} onClick={() => setPicking("accent")} />
      </div>

      {picking && (
        <ColorSheet
          title={picking === "color" ? "Baggrund" : "Accent farve"}
          color={design[picking]}
          onSave={(color) => (picking === "color" ? chooseColor(color) : setDesign({ ...design, accent: color }))}
          onClose={() => setPicking(null)}
        />
      )}
    </main>
  );
}
