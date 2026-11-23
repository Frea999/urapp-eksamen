import ocean from "./assets/themes/ocean.svg";
import hearts from "./assets/themes/hearts.svg";
import leaves from "./assets/themes/leaves.svg";
import ribbons from "./assets/themes/ribbons.png";
import crosses from "./assets/themes/crosses.svg";
import web from "./assets/themes/web.svg";
import bubblesBackground from "./assets/backgrounds/bubbles.png";
import leavesBackground from "./assets/backgrounds/leaves.png";
import bubblesEffect from "./assets/effects/bubbles.png";
import heartsEffect from "./assets/effects/hearts.png";
import leavesEffect from "./assets/effects/leaves.png";
import crossesEffect from "./assets/effects/crosses.png";
import linesEffect from "./assets/effects/lines.png";
import bondsEffect from "./assets/effects/bonds.png";

export const originalTheme = { name: "Original", original: true, ready: true, color: "#000000", darkText: false };

export const themes = [
  {
    name: "Hav",
    ready: true,
    color: "#488eff",
    dark: "#061938",
    card: "#80b0ff",
    nav: "#6fa6ff",
    accent: "#449793",
    darkText: true,
    banner: ocean,
    background: bubblesBackground,
    particles: "bubbles",
    animation: true,
  },
  {
    name: "Hjerter",
    ready: true,
    color: "#fa86c4",
    dark: "#370520",
    card: "#ffc5e4",
    nav: "#ffc5e4",
    accent: "#a5257d",
    navActive: "#370520",
    navActiveText: "#f7f7f7",
    darkText: true,
    banner: hearts,
    particles: "hearts",
    animation: true,
  },
  {
    name: "Blade",
    ready: true,
    color: "#4a8626",
    dark: "#153006",
    card: "#c5eaa3",
    nav: "#c5eaa3",
    accent: "#c1d77c",
    onAccent: "#153006",
    darkText: true,
    banner: leaves,
    particles: "leaves",
    animation: true,
  },
  {
    name: "Bånd",
    ready: true,
    color: "#449793",
    dark: "#072a29",
    card: "#7cb6b3",
    nav: "#6badaa",
    accent: "#488eff",
    darkText: true,
    banner: ribbons,
    particles: "ribbons",
    animation: true,
  },
  {
    name: "Kryds",
    ready: true,
    color: "#270404",
    dark: "#080101",
    card: "#523636",
    nav: "#472a2a",
    accent: "#4a4a4f",
    onAccent: "#f7f7f7",
    navActive: "#4a4a4f",
    navActiveText: "#f7f7f7",
    darkText: false,
    banner: crosses,
    particles: "crosses",
    animation: true,
  },
  {
    name: "Spind",
    ready: true,
    color: "#2c2c2c",
    dark: "#121212",
    card: "#464646",
    nav: "#3b3b3b",
    accent: "#cc89dd",
    onAccent: "#2c2c2c",
    darkText: false,
    banner: web,
    particles: "webs",
    animation: true,
  },
];

export const effects = [
  { name: "Ingen", image: null, background: null },
  { name: "Bobler", image: bubblesEffect, background: bubblesBackground },
  { name: "Hjerter", image: heartsEffect, background: hearts },
  { name: "Blade", image: leavesEffect, background: leavesBackground },
  { name: "Kryds", image: crossesEffect, background: crosses },
  { name: "Streger", image: linesEffect, background: web },
  { name: "Bånd", image: bondsEffect, background: ribbons },
];

export function hexToHsv(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d > 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return { h: (h * 60 + 360) % 360, s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
}

export function hsvToHex(h, s, v) {
  const sat = s / 100;
  const value = v / 100;
  const channel = (n) => {
    const k = (n + h / 60) % 6;
    const result = value - value * sat * Math.max(0, Math.min(k, 4 - k, 1));
    return Math.round(result * 255).toString(16).padStart(2, "0");
  };
  return `#${channel(5)}${channel(3)}${channel(1)}`;
}

export function isLight(color) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 100;
}

const floatingEffects = { Bobler: "bubbles", Blade: "leaves", Hjerter: "hearts", Bånd: "ribbons", Kryds: "crosses" };

export function makeOwnTheme(design, imageUrl) {
  const light = isLight(design.color);
  if (design.image) return { ...ownColors(design, light), background: imageUrl, cover: true, animation: false };
  return {
    ...ownColors(design, light),
    background: design.effect.background,
    particles: floatingEffects[design.effect.name],
    animation: Boolean(design.effect.background && design.animation),
  };
}

function ownColors(design, light) {
  return {
    name: "Eget design",
    color: design.color,
    dark: `color-mix(in srgb, ${design.color} 20%, black)`,
    card: `color-mix(in srgb, ${design.color} ${light ? 70 : 80}%, white)`,
    nav: `color-mix(in srgb, ${design.color} 85%, white)`,
    accent: design.accent,
    darkText: light,
  };
}

// Billeder får nye filnavne ved hver build, så der gemmes kun navne og valg
export function serializeDesign(design) {
  return {
    color: design.color,
    accent: design.accent,
    effect: design.effect.name,
    animation: design.animation,
    image: design.image || null,
  };
}

export function hydrateDesign(saved) {
  const effect = effects.find((item) => item.name === saved.effect) || effects[0];
  return { color: saved.color, accent: saved.accent, effect, animation: saved.animation, image: saved.image || null };
}

export function themeFromChoice(choice, imageUrl) {
  if (!choice) return null;
  if (choice.own) return makeOwnTheme(hydrateDesign(choice.own), imageUrl);
  const preset = themes.find((item) => item.name === choice.preset);
  return preset && preset.ready ? preset : null;
}
