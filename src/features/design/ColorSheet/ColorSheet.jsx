import { useState } from "react";
import Sheet from "../../../components/Sheet/Sheet";
import ColorWheel from "../ColorWheel/ColorWheel";
import styles from "./ColorSheet.module.css";
import { hexToHsv, hsvToHex } from "../../../themes";

export default function ColorSheet({ title, color, onSave, onClose }) {
  const start = hexToHsv(color);
  const [hue, setHue] = useState(start.h);
  const [saturation, setSaturation] = useState(start.s);
  const [brightness, setBrightness] = useState(start.v);

  const chosen = hsvToHex(hue, saturation, brightness);

  function save() {
    onSave(chosen);
    onClose();
  }

  return (
    <Sheet title={title} onClose={onClose} onSave={save}>
      <ColorWheel
        hue={hue}
        saturation={saturation}
        brightness={brightness}
        color={chosen}
        onChange={(h, s) => {
          setHue(h);
          setSaturation(s);
        }}
      />

      <div className={styles.card}>
        <label className={styles.row}>
          <span>Lysstyrke</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(brightness)}
            className={styles.slider}
            style={{ "--tint": hsvToHex(hue, saturation, 100) }}
            onChange={(e) => setBrightness(Number(e.target.value))}
          />
        </label>
        <div className={styles.row}>
          <span>Valgt farve</span>
          <span className={styles.value}>
            {chosen.toUpperCase()}
            <span className={styles.swatch} style={{ backgroundColor: chosen }}></span>
          </span>
        </div>
      </div>
    </Sheet>
  );
}
