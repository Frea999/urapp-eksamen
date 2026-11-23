import { useEffect, useState } from "react";
import styles from "./StopwatchPage.module.css";

// Laver millisekunder om til "00.00,00" (minutter.sekunder,hundrededele)
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor(ms / 1000) % 60;
  const hundredths = Math.floor(ms / 10) % 100;
  return (
    String(minutes).padStart(2, "0") +
    "." +
    String(seconds).padStart(2, "0") +
    "," +
    String(hundredths).padStart(2, "0")
  );
}

export default function StopwatchPage() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  // Læg 10 millisekunder til hvert 10. millisekund mens uret kører
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTime((t) => t + 10);
    }, 10);
    return () => clearInterval(interval);
  }, [running]);

  function lapOrReset() {
    if (running) {
      setLaps([time, ...laps]);
    } else {
      setTime(0);
      setLaps([]);
    }
  }

  return (
    <main>
      <div className="top-buttons"></div>

      <p className={styles.time}>{formatTime(time)}</p>

      <div className={styles.buttons}>
        <button className="round-button" onClick={lapOrReset}>
          {running || time === 0 ? "Runde" : "Nulstil"}
        </button>

        <div className={styles.dots}>
          <span className={styles.dotWhite}></span>
          <span className={styles.dot}></span>
        </div>

        {running ? (
          <button className="round-button red" onClick={() => setRunning(false)}>
            Stop
          </button>
        ) : (
          <button className="round-button green" onClick={() => setRunning(true)}>
            Start
          </button>
        )}
      </div>

      <div className={styles.laps}>
        {laps.map((lap, index) => (
          <div key={index} className={styles.lap}>
            <span>Runde {laps.length - index}</span>
            <span>{formatTime(lap)}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
