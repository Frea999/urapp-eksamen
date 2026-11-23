import { useEffect, useState } from "react";

export default function useStoredState(key, startValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : startValue;
    } catch {
      return startValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ingen plads eller privat tilstand
    }
  }, [key, value]);

  return [value, setValue];
}
