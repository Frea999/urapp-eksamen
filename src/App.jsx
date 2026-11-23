import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import Navbar from "./components/Navbar";
import AlarmsPage from "./pages/AlarmsPage";
import StopwatchPage from "./pages/StopwatchPage";
import TimersPage from "./pages/TimersPage";
import ThemePage from "./pages/ThemePage";
import ColorsPage from "./pages/ColorsPage";
import DetailsPage from "./pages/DetailsPage";
import { effects } from "./themes";

const startAlarms = [
  { id: 1, hour: 0, minute: 0, on: false, description: "Alarm", sound: "Ingen", snooze: true, snoozeTime: 9 },
  { id: 2, hour: 0, minute: 1, on: false, description: "Alarm", sound: "Ingen", snooze: true, snoozeTime: 9 },
  { id: 3, hour: 0, minute: 5, on: false, description: "Alarm", sound: "Ingen", snooze: true, snoozeTime: 9 },
  { id: 4, hour: 0, minute: 6, on: false, description: "Alarm", sound: "Ingen", snooze: true, snoozeTime: 9 },
];

// Laver temaets farver om til CSS-variabler, som resten af appen bruger
function themeStyle(theme) {
  if (!theme) return {};
  return {
    "--bg": theme.color,
    "--bg-image": `url(${theme.background})`,
    "--dark": theme.dark,
    "--card": theme.card,
    "--nav": theme.nav,
    "--accent": theme.accent,
  };
}

export default function App() {
  // Alarmerne ligger her, så de ikke forsvinder når man skifter fane
  const [alarms, setAlarms] = useState(startAlarms);

  // Det valgte tema (null = det sorte standard-design)
  const [theme, setTheme] = useState(null);

  // Det man er i gang med at lave under "Design selv"
  const [design, setDesign] = useState({
    color: "#fa86c4",
    accent: "#449793",
    effect: effects[2],
    animation: false,
  });

  let className = "app";
  if (theme) className += " themed";
  if (theme && theme.darkText) className += " dark-text";
  if (theme && theme.animation) className += " animated";

  return (
    <div className={className} style={themeStyle(theme)}>
      <Routes>
        <Route path="/" element={<Navigate to="/alarmer" />} />
        <Route path="/alarmer" element={<AlarmsPage alarms={alarms} setAlarms={setAlarms} />} />
        <Route path="/stopur" element={<StopwatchPage />} />
        <Route path="/tidtagninger" element={<TimersPage />} />
        <Route path="/rediger" element={<ThemePage theme={theme} setTheme={setTheme} />} />
        <Route path="/rediger/farver" element={<ColorsPage design={design} setDesign={setDesign} />} />
        <Route
          path="/rediger/detaljer"
          element={<DetailsPage design={design} setDesign={setDesign} setTheme={setTheme} />}
        />
      </Routes>
      <Navbar />
    </div>
  );
}
