import christmas from "./assets/sounds/christmas.mp3";
import forest from "./assets/sounds/forest.mp3";
import piano from "./assets/sounds/piano.mp3";
import sun from "./assets/sounds/sun.mp3";

const files = { Jul: christmas, Skov: forest, Klaver: piano, Sol: sun };

export const soundNames = ["Ingen", ...Object.keys(files)];

const PREVIEW_TIME = 4000;
let preview = null;

function stopPreview() {
  if (!preview) return;
  clearTimeout(preview.timeout);
  preview.audio.pause();
  preview = null;
}

export function startRinging(name) {
  if (!files[name]) return () => {};
  stopPreview();

  const audio = new Audio(files[name]);
  audio.loop = true;
  audio.play().catch(() => {});

  return () => audio.pause();
}

export function previewSound(name) {
  stopPreview();
  if (!files[name]) return;

  const audio = new Audio(files[name]);
  audio.play().catch(() => {});
  preview = { audio, timeout: setTimeout(stopPreview, PREVIEW_TIME) };
}
