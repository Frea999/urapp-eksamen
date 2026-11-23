import styles from "./StopwatchPage.module.css";
import { formatStopwatch } from "../../../utils";

export default function StopwatchPage({ stopwatch }) {
  const { time, running, lapTotals } = stopwatch;

  const splits = lapTotals.map((total, i) => total - (i > 0 ? lapTotals[i - 1] : 0));
  const currentLap = time - (lapTotals.length > 0 ? lapTotals[lapTotals.length - 1] : 0);
  const fastest = Math.min(...splits);
  const slowest = Math.max(...splits);
  const rows = [];
  if (time > 0) rows.push({ number: splits.length + 1, ms: currentLap, current: true });
  for (let i = splits.length - 1; i >= 0; i--) rows.push({ number: i + 1, ms: splits[i] });

  function lapOrReset() {
    if (running) stopwatch.lap();
    else stopwatch.reset();
  }

  function rowClass(row) {
    let name = styles.lap;
    if (!row.current && splits.length >= 2) {
      if (row.ms === fastest) name += " " + styles.fastest;
      else if (row.ms === slowest) name += " " + styles.slowest;
    }
    return name;
  }

  return (
    <main>
      <div className="top-buttons"></div>

      <p className={`${styles.time} ${running ? styles.timeRunning : ""}`}>{formatStopwatch(time)}</p>

      <div className={styles.buttons}>
        <button
          className={`round-button ${styles.button}`}
          onClick={lapOrReset}
          disabled={!running && time === 0}
        >
          <span key={running || time === 0 ? "lap" : "reset"} className={styles.fade}>
            {running || time === 0 ? "Runde" : "Nulstil"}
          </span>
        </button>

        <div className={styles.dots}>
          <span className={styles.dotWhite}></span>
          <span className={styles.dot}></span>
        </div>

        <button
          className={`round-button ${running ? "red" : "green"} ${styles.button}`}
          onClick={running ? stopwatch.stop : stopwatch.start}
        >
          <span key={running ? "stop" : "start"} className={styles.fade}>
            {running ? "Stop" : "Start"}
          </span>
        </button>
      </div>

      <div className={styles.laps}>
        {rows.map((row) => (
          <div key={row.number} className={rowClass(row)}>
            <span>Runde {row.number}</span>
            <span className={styles.lapTime}>{formatStopwatch(row.ms)}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
