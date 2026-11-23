import ocean from "./assets/themes/ocean.png";
import hearts from "./assets/themes/hearts.png";
import leaves from "./assets/themes/leaves.png";
import ribbons from "./assets/themes/ribbons.png";
import crosses from "./assets/themes/crosses.png";
import web from "./assets/themes/web.png";
import bubblesBackground from "./assets/backgrounds/bubbles.png";
import leavesBackground from "./assets/backgrounds/leaves.png";
import bubblesEffect from "./assets/effects/bubbles.png";
import heartsEffect from "./assets/effects/hearts.png";
import leavesEffect from "./assets/effects/leaves.png";
import crossesEffect from "./assets/effects/crosses.png";
import linesEffect from "./assets/effects/lines.png";
import bondsEffect from "./assets/effects/bonds.png";

// Temaerne på "Rediger"-siden.
// Kun Hav og Hjerter har et færdigt design i Figma, så kun de kan vælges (ready: true).
// color = baggrund, dark = ark og knapper, card = kort og menuer, nav = navbaren
// banner = billedet på Rediger-siden, background = billedet bag hele appen
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
    animation: true,
  },
  {
    name: "Hjerter",
    ready: true,
    color: "#fa86c4",
    dark: "#370520",
    card: "#ffc5e4",
    nav: "#ffc5e4",
    accent: "#449793",
    darkText: true,
    banner: hearts,
    background: leavesBackground,
  },
  { name: "Blade", ready: false, color: "#4a8626", darkText: true, banner: leaves },
  { name: "Bånd", ready: false, color: "#449793", darkText: true, banner: ribbons },
  { name: "Kryds", ready: false, color: "#270404", darkText: false, banner: crosses },
  { name: "Spind", ready: false, color: "#2c2c2c", darkText: false, banner: web },
];

// Effekterne man kan vælge under "Design selv"
export const effects = [
  { name: "Bobler", image: bubblesEffect, background: bubblesBackground },
  { name: "Hjerter", image: heartsEffect, background: hearts },
  { name: "Blade", image: leavesEffect, background: leavesBackground },
  { name: "Kryds", image: crossesEffect, background: crosses },
  { name: "Streger", image: linesEffect, background: web },
  { name: "Bånd", image: bondsEffect, background: ribbons },
];

// Finder ud af om en farve er lys (så skal teksten være mørk)
function isLight(color) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 100;
}

// Laver et tema ud fra det man har valgt under "Design selv".
// De andre farver blandes ud fra baggrundsfarven med color-mix.
export function makeOwnTheme(design) {
  const light = isLight(design.color);
  return {
    name: "Eget design",
    color: design.color,
    dark: `color-mix(in srgb, ${design.color} 20%, black)`,
    card: `color-mix(in srgb, ${design.color} ${light ? 70 : 80}%, white)`,
    nav: `color-mix(in srgb, ${design.color} 85%, white)`,
    accent: design.accent,
    darkText: light,
    background: design.effect.background,
    animation: design.animation,
  };
}
