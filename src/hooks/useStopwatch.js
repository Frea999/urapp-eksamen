import { useEffect, useRef, useState } from "react";

export default function useStopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [lapTotals, setLapTotals] = useState([]);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    let frame;
    function tick() {
      setTime(performance.now() - startedAt.current);
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  function start() {
    startedAt.current = performance.now() - time;
    setRunning(true);
  }

  function stop() {
    setTime(performance.now() - startedAt.current);
    setRunning(false);
  }

  function lap() {
    setLapTotals((list) => [...list, performance.now() - startedAt.current]);
  }

  function reset() {
    setTime(0);
    setLapTotals([]);
  }

  return { time, running, lapTotals, start, stop, lap, reset };
}
