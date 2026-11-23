import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import NumberWheel from "../../../components/NumberWheel/NumberWheel";
import OptionList from "../../../components/OptionList/OptionList";
import styles from "./TimersPage.module.css";
import cancelIcon from "../../../assets/icons/cancel.svg";
import playIcon from "../../../assets/icons/play.svg";
import playSmallIcon from "../../../assets/icons/play-small.svg";
import chevronIcon from "../../../assets/icons/chevron.svg";
import { describeDuration, formatClock, formatDayTime, formatRecent } from "../../../utils";
import { previewSound, soundNames } from "../../../sound";

const RADIUS = 140;
const CIRCLE = 2 * Math.PI * RADIUS;

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v.6A6.5 6.5 0 0 1 18.5 10.5V15l2 3v1H3.5v-1l2-3v-4.5A6.5 6.5 0 0 1 10.5 4.1v-.6A1.5 1.5 0 0 1 12 2Zm-2.5 18h5a2.5 2.5 0 0 1-5 0Z" />
    </svg>
  );
}

const MotionDiv = motion.div;

export default function TimersPage({ timer }) {
  const { pick, setPick, status, totalMs, leftMs, endAt } = timer;
  const [openList, setOpenList] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const active = status !== "idle";
  const isDone = status === "done";
  const pickedSeconds = pick.h * 3600 + pick.m * 60 + pick.s;
  const progress = totalMs > 0 ? leftMs / totalMs : 1;
  const secondsLeft = Math.ceil(leftMs / 1000);

  function start(seconds) {
    setEditMode(false);
    timer.start(seconds);
  }

  function reset() {
    setPick({ h: 0, m: 0, s: 0 });
  }

  let mainLabel = <img src={playIcon} alt="Start" className={styles.play} />;
  let mainClass = "green";
  let mainAction = () => start(pickedSeconds);
  if (status === "running") {
    mainLabel = "Pause";
    mainClass = styles.orange;
    mainAction = timer.pause;
  } else if (status === "paused") {
    mainLabel = "Fortsæt";
    mainClass = "green";
    mainAction = timer.resume;
  } else if (isDone) {
    mainLabel = "Start";
    mainClass = "green";
    mainAction = () => start(totalMs / 1000);
  }

  return (
    <main>
      <div className="top-buttons">
        <button
          className={`pill-button ${styles.fadeOut} ${active ? styles.hidden : ""}`}
          onClick={() => setEditMode(!editMode)}
          disabled={active}
          tabIndex={active ? -1 : 0}
        >
          {editMode ? "OK" : "Rediger"}
        </button>
      </div>
      <h1 className="page-title">Tidtagninger</h1>

      <div className={`${styles.stage} ${active ? styles.active : ""}`}>
        <div className={styles.picker} inert={active}>
          <div className={styles.highlight}></div>
          <NumberWheel
            value={pick.h}
            max={23}
            unit="timer"
            label="Timer"
            onChange={(h) => setPick((p) => ({ ...p, h }))}
          />
          <NumberWheel
            value={pick.m}
            max={59}
            unit="min."
            label="Minutter"
            onChange={(m) => setPick((p) => ({ ...p, m }))}
          />
          <NumberWheel
            value={pick.s}
            max={59}
            unit="sek."
            label="Sekunder"
            onChange={(s) => setPick((p) => ({ ...p, s }))}
          />
        </div>

        <div className={`${styles.ring} ${isDone ? styles.ringDone : ""}`} aria-hidden={!active}>
          <svg width="286" height="286" viewBox="0 0 286 286">
            <circle cx="143" cy="143" r={RADIUS} fill="none" strokeWidth="6" className={styles.track} />
            <circle
              cx="143"
              cy="143"
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className={styles.progress}
              style={{ stroke: isDone ? "var(--green)" : "var(--accent)" }}
              strokeDasharray={CIRCLE}
              strokeDashoffset={isDone ? 0 : CIRCLE * (1 - progress)}
              transform="rotate(-90 143 143)"
            />
          </svg>
          <div className={styles.ringText}>
            <span className={styles.clock}>{formatClock(isDone ? 0 : secondsLeft)}</span>
            <span className={`${styles.endsAt} ${status === "running" ? "" : styles.hidden}`}>
              <BellIcon /> {endAt ? formatDayTime(new Date(endAt)) : ""}
            </span>
            <span className={styles.gray}>{isDone ? timer.description + " færdig" : timer.description}</span>
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        {active ? (
          <button key="cancel" className={`round-button ${styles.button} ${styles.fade}`} onClick={timer.cancel}>
            Annuller
          </button>
        ) : (
          <button
            key="reset"
            className={`round-button ${styles.button} ${styles.fade}`}
            onClick={reset}
            disabled={pickedSeconds === 0}
          >
            <img src={cancelIcon} alt="Nulstil" />
          </button>
        )}
        <button
          className={`round-button ${mainClass} ${styles.button}`}
          onClick={mainAction}
          disabled={!active && pickedSeconds === 0}
        >
          <span key={status} className={styles.fade}>
            {mainLabel}
          </span>
        </button>
      </div>

      <div className={styles.card}>
        <button className={styles.row} onClick={() => setOpenList("description")}>
          <span>Beskrivelse</span>
          <span className={styles.darkGray}>{timer.description}</span>
        </button>
        <button className={styles.row} onClick={() => setOpenList("sound")}>
          <span>Lyd</span>
          <span className={styles.gray}>
            {timer.sound} <img src={chevronIcon} alt="" />
          </span>
        </button>
      </div>

      <div className={`${styles.collapse} ${active ? styles.collapsed : ""}`} inert={active}>
        <div className={styles.recent}>
          {timer.recent.length > 0 && <h2>Seneste</h2>}
          <AnimatePresence initial={false}>
            {timer.recent.map((time) => (
              <MotionDiv
                key={time}
                className={styles.recentRow}
                exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, borderBottomWidth: 0 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  className={styles.recentInfo}
                  onClick={() => setPick({ h: Math.floor(time / 3600), m: Math.floor(time / 60) % 60, s: time % 60 })}
                  aria-label={`Vælg ${describeDuration(time)}`}
                >
                  <span className={styles.recentTime}>{formatRecent(time)}</span>
                  <span className={styles.recentLabel}>{describeDuration(time)}</span>
                </button>
                {editMode ? (
                  <button
                    className={styles.deleteButton}
                    onClick={() => timer.setRecent((list) => list.filter((t) => t !== time))}
                    aria-label="Slet"
                  >
                    –
                  </button>
                ) : (
                  <button className={`round-button green ${styles.tiny}`} onClick={() => start(time)}>
                    <img src={playSmallIcon} alt="Start" className={styles.play} />
                  </button>
                )}
              </MotionDiv>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {openList === "description" && (
        <OptionList
          title="Timerbeskrivelse"
          options={["Tidtagning", "Madlavning", "Pause", "Træning"]}
          selected={timer.description}
          onSelect={timer.setDescription}
          onClose={() => setOpenList(null)}
        />
      )}

      {openList === "sound" && (
        <OptionList
          title="Lyd"
          options={soundNames}
          selected={timer.sound}
          onSelect={(sound) => {
            timer.setSound(sound);
            previewSound(sound);
          }}
          onClose={() => setOpenList(null)}
        />
      )}
    </main>
  );
}
