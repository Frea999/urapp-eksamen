import { useEffect, useState } from "react";
import NumberWheel from "../components/NumberWheel";
import OptionList from "../components/OptionList";
import styles from "./TimersPage.module.css";
import cancelIcon from "../assets/icons/cancel.svg";
import playIcon from "../assets/icons/play.svg";
import playSmallIcon from "../assets/icons/play-small.svg";
import chevronIcon from "../assets/icons/chevron.svg";

// Laver sekunder om til "00:06:00"
function formatClock(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds / 60) % 60;
  const s = seconds % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

export default function TimersPage() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(6);
  const [seconds, setSeconds] = useState(0);
  const [description, setDescription] = useState("Tidtagning");
  const [sound, setSound] = useState("Rejse");
  const [openList, setOpenList] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [recent, setRecent] = useState([360, 600]); // seneste tidtagninger i sekunder

  // status er "idle" (vælg tid), "running", "paused" eller "done"
  const [status, setStatus] = useState("idle");
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Tæl ned med ét sekund ad gangen
  useEffect(() => {
    if (status !== "running" || timeLeft === 0) return;
    const timeout = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timeout);
  }, [status, timeLeft]);

  function start(time) {
    if (time === 0) return;
    setTotalTime(time);
    setTimeLeft(time);
    setStatus("running");
    setEditMode(false);
    if (!recent.includes(time)) setRecent([time, ...recent]);
  }

  const isDone = status !== "idle" && timeLeft === 0;

  // Nedtælling (kører, pause og færdig)
  if (status !== "idle") {
    const circle = 2 * Math.PI * 140;
    const progress = timeLeft / totalTime;

    return (
      <main>
        <div className="top-buttons"></div>
        <h1 className="page-title">Tidtagninger</h1>

        <div className={styles.ring}>
          <svg width="286" height="286" viewBox="0 0 286 286">
            <circle
              cx="143"
              cy="143"
              r="140"
              fill="none"
              strokeWidth="6"
              stroke={isDone ? "#63cf65" : "#ff9f43"}
              strokeDasharray={circle}
              strokeDashoffset={isDone ? 0 : circle * (1 - progress)}
              transform="rotate(-90 143 143)"
            />
          </svg>
          <div className={styles.ringText}>
            <span className={styles.clock}>{formatClock(timeLeft)}</span>
            <span className={styles.gray}>{isDone ? description + " færdig" : description}</span>
          </div>
        </div>

        <div className={styles.countdownButtons}>
          <button className={`round-button ${styles.small}`} onClick={() => setStatus("idle")}>
            Annuller
          </button>
          {isDone && (
            <button className={`round-button green ${styles.small}`} onClick={() => start(totalTime)}>
              Start
            </button>
          )}
          {!isDone && status === "running" && (
            <button className={`round-button ${styles.small} ${styles.orange}`} onClick={() => setStatus("paused")}>
              Pause
            </button>
          )}
          {!isDone && status === "paused" && (
            <button className={`round-button green ${styles.small}`} onClick={() => setStatus("running")}>
              Fortsæt
            </button>
          )}
        </div>

        {isDone && <p className={styles.doneText}>Tiden er gået</p>}
      </main>
    );
  }

  // Vælg tid
  return (
    <main>
      <div className="top-buttons">
        <button className="pill-button" onClick={() => setEditMode(!editMode)}>
          {editMode ? "OK" : "Rediger"}
        </button>
      </div>
      <h1 className="page-title">Tidtagninger</h1>

      <div className={styles.picker}>
        <div className={styles.highlight}></div>
        <NumberWheel value={hours} max={23} onChange={setHours} unit="timer" />
        <NumberWheel value={minutes} max={59} onChange={setMinutes} unit="min." />
        <NumberWheel value={seconds} max={59} onChange={setSeconds} unit="sek." />
      </div>

      <div className={styles.buttons}>
        <button
          className={`round-button ${styles.medium}`}
          onClick={() => {
            setHours(0);
            setMinutes(0);
            setSeconds(0);
          }}
        >
          <img src={cancelIcon} alt="Nulstil" />
        </button>
        <button
          className={`round-button green ${styles.medium}`}
          onClick={() => start(hours * 3600 + minutes * 60 + seconds)}
        >
          <img src={playIcon} alt="Start" className={styles.play} />
        </button>
      </div>

      <div className={styles.card}>
        <button className={styles.row} onClick={() => setOpenList("description")}>
          <span>Beskrivelse</span>
          <span className={styles.darkGray}>{description}</span>
        </button>
        <button className={styles.row} onClick={() => setOpenList("sound")}>
          <span>Lyd</span>
          <span className={styles.gray}>
            {sound} <img src={chevronIcon} alt="" />
          </span>
        </button>
      </div>

      <div className={styles.recent}>
        <h2>Seneste</h2>
        {recent.map((time) => (
          <div key={time} className={styles.recentRow}>
            <div>
              <p className={styles.recentTime}>
                {Math.floor(time / 60)}.{String(time % 60).padStart(2, "0")}
              </p>
              <p className={styles.recentLabel}>{Math.floor(time / 60)} min.</p>
            </div>
            {editMode ? (
              <button className={styles.deleteButton} onClick={() => setRecent(recent.filter((t) => t !== time))}>
                –
              </button>
            ) : (
              <button className={`round-button green ${styles.tiny}`} onClick={() => start(time)}>
                <img src={playSmallIcon} alt="Start" className={styles.play} />
              </button>
            )}
          </div>
        ))}
      </div>

      {openList === "description" && (
        <OptionList
          title="Timerbeskrivelse"
          options={["Tidtagning", "Madlavning", "Pause", "Træning"]}
          selected={description}
          onSelect={setDescription}
          onClose={() => setOpenList(null)}
        />
      )}

      {openList === "sound" && (
        <OptionList
          title="Lyd"
          options={["Ingen", "Rejse", "Radar", "Signal", "Bølger"]}
          selected={sound}
          onSelect={setSound}
          onClose={() => setOpenList(null)}
        />
      )}
    </main>
  );
}
