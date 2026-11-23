import { useEffect, useRef, useState } from "react";
import { startRinging } from "../sound";
import { weekdayIndex } from "../utils";

export default function useAlarmRinger(alarms, setAlarms) {
  const [ringing, setRinging] = useState(null);
  const alarmsRef = useRef(alarms);
  const snoozed = useRef([]);
  const fired = useRef({});
  const stopRing = useRef(null);

  useEffect(() => {
    alarmsRef.current = alarms;
  }, [alarms]);

  useEffect(() => {
    function ring(alarm) {
      if (stopRing.current) stopRing.current();
      stopRing.current = startRinging(alarm.sound);
      setRinging(alarm);
    }

    const interval = setInterval(() => {
      const now = new Date();

      const due = snoozed.current.find((item) => item.until <= now.getTime());
      if (due) {
        snoozed.current = snoozed.current.filter((item) => item !== due);
        ring(due.alarm);
        return;
      }

      const minuteKey = `${now.toDateString()} ${now.getHours()}:${now.getMinutes()}`;
      for (const alarm of alarmsRef.current) {
        if (!alarm.on || alarm.hour !== now.getHours() || alarm.minute !== now.getMinutes()) continue;
        const days = alarm.days || [];
        if (days.length > 0 && !days.includes(weekdayIndex(now))) continue;
        if (fired.current[alarm.id] === minuteKey) continue;

        fired.current[alarm.id] = minuteKey;
        if (days.length === 0) {
          setAlarms((list) => list.map((a) => (a.id === alarm.id ? { ...a, on: false } : a)));
        }
        ring(alarm);
        break;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (stopRing.current) stopRing.current();
    };
  }, [setAlarms]);

  function stop() {
    if (stopRing.current) stopRing.current();
    stopRing.current = null;
    setRinging(null);
  }

  function snooze() {
    if (ringing) {
      snoozed.current.push({ alarm: ringing, until: Date.now() + ringing.snoozeTime * 60000 });
    }
    stop();
  }

  return { ringing, stop, snooze };
}
