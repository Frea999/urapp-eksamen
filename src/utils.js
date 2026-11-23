export function pad(number) {
  return String(number).padStart(2, "0");
}

export function formatClock(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds / 60) % 60;
  const s = seconds % 60;
  return pad(h) + ":" + pad(m) + ":" + pad(s);
}

export function formatStopwatch(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor(ms / 1000) % 60;
  const hundredths = Math.floor(ms / 10) % 100;
  return pad(minutes) + "." + pad(seconds) + "," + pad(hundredths);
}

export function formatDayTime(date) {
  return pad(date.getHours()) + "." + pad(date.getMinutes());
}

export function formatRecent(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds / 60) % 60;
  const s = seconds % 60;
  return h > 0 ? `${h}.${pad(m)}.${pad(s)}` : `${m}.${pad(s)}`;
}

export function describeDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds / 60) % 60;
  const s = seconds % 60;
  const parts = [];
  if (h) parts.push(`${h} t.`);
  if (m) parts.push(`${m} min.`);
  if (s) parts.push(`${s} sek.`);
  return parts.join(" ");
}

export const dayLetters = ["M", "T", "O", "T", "F", "L", "S"];
const dayNames = ["man", "tirs", "ons", "tors", "fre", "lør", "søn"];

export function repeatLabel(days) {
  if (days.length === 0) return "";
  if (days.length === 7) return "hver dag";
  return [...days]
    .sort((a, b) => a - b)
    .map((d) => dayNames[d])
    .join(" ");
}

export function weekdayIndex(date) {
  return (date.getDay() + 6) % 7;
}
