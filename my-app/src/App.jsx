import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import Navbar from "./components/Navbar";
import AlarmsPage from "./pages/AlarmsPage";
import StopwatchPage from "./pages/StopwatchPage";
import TimersPage from "./pages/TimersPage";
import ThemePage from "./pages/ThemePage";
import ColorsPage from "./pages/ColorsPage";
import DetailsPage from "./pages/DetailsPage";

const startAlarms = [
  { id: 1, hour: 0, minute: 0, on: false, description: "Alarm", sound: "Ingen", snooze: true, snoozeTime: 9 },
  { id: 2, hour: 0, minute: 1, on: false, description: "Alarm", sound: "Ingen", snooze: true, snoozeTime: 9 },
  { id: 3, hour: 0, minute: 5, on: false, description: "Alarm", sound: "Ingen", snooze: true, snoozeTime: 9 },
  { id: 4, hour: 0, minute: 6, on: false, description: "Alarm", sound: "Ingen", snooze: true, snoozeTime: 9 },
];

export default function App() {
  // Alarmerne ligger her, så de ikke forsvinder når man skifter fane
  const [alarms, setAlarms] = useState(startAlarms);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/alarmer" />} />
        <Route path="/alarmer" element={<AlarmsPage alarms={alarms} setAlarms={setAlarms} />} />
        <Route path="/stopur" element={<StopwatchPage />} />
        <Route path="/tidtagninger" element={<TimersPage />} />
        <Route path="/rediger" element={<ThemePage />} />
        <Route path="/rediger/farver" element={<ColorsPage />} />
        <Route path="/rediger/detaljer" element={<DetailsPage />} />
      </Routes>
      <Navbar />
    </>
  );
}
