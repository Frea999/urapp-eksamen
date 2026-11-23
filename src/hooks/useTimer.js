import { useEffect, useRef, useState } from "react";
import useStoredState from "./useStoredState";
import { startRinging } from "../sound";

export default function useTimer(userId) {
  const [pick, setPick] = useState({ h: 0, m: 6, s: 0 });
  const [description, setDescription] = useState("Tidtagning");
  const [sound, setSound] = useState("Klaver");
  const [recent, setRecent] = useStoredState(`ur-recent-${userId}`, []);

  const [status, setStatus] = useState("idle");
  const [totalMs, setTotalMs] = useState(0);
  const [leftMs, setLeftMs] = useState(0);
  const [endAt, setEndAt] = useState(0);
  const stopRing = useRef(null);

  function silence() {
    if (stopRing.current) stopRing.current();
    stopRing.current = null;
  }

  useEffect(() => silence, []);

  useEffect(() => {
    if (status !== "running") return;
    const interval = setInterval(() => {
      const left = endAt - Date.now();
      if (left > 0) {
        setLeftMs(left);
      } else {
        clearInterval(interval);
        setLeftMs(0);
        setStatus("done");
        stopRing.current = startRinging(sound);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [status, endAt, sound]);

  function start(seconds) {
    if (seconds <= 0) return;
    silence();
    setTotalMs(seconds * 1000);
    setLeftMs(seconds * 1000);
    setEndAt(Date.now() + seconds * 1000);
    setStatus("running");
    setRecent((list) => (list.includes(seconds) ? list : [seconds, ...list].slice(0, 10)));
  }

  function pause() {
    setLeftMs(Math.max(0, endAt - Date.now()));
    setStatus("paused");
  }

  function resume() {
    setEndAt(Date.now() + leftMs);
    setStatus("running");
  }

  function cancel() {
    silence();
    setStatus("idle");
  }

  return {
    pick,
    setPick,
    description,
    setDescription,
    sound,
    setSound,
    recent,
    setRecent,
    status,
    totalMs,
    leftMs,
    endAt,
    start,
    pause,
    resume,
    cancel,
  };
}
