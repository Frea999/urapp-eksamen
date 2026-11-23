import { Routes, Route, Navigate, useLocation } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import Floating from "./features/design/Floating/Floating";
import AlarmsPage from "./features/alarms/AlarmsPage/AlarmsPage";
import StopwatchPage from "./features/stopwatch/StopwatchPage/StopwatchPage";
import TimersPage from "./features/timers/TimersPage/TimersPage";
import ThemePage from "./features/design/ThemePage/ThemePage";
import ColorsPage from "./features/design/ColorsPage/ColorsPage";
import DetailsPage from "./features/design/DetailsPage/DetailsPage";
import LoginPage from "./features/account/LoginPage/LoginPage";
import RequireAuth from "./features/account/RequireAuth/RequireAuth";
import ProfileButton from "./features/account/ProfileButton/ProfileButton";
import { useAuth } from "./hooks/useAuth";
import RingOverlay from "./components/RingOverlay/RingOverlay";
import useStoredState from "./hooks/useStoredState";
import useTimer from "./hooks/useTimer";
import useStopwatch from "./hooks/useStopwatch";
import useAlarmRinger from "./hooks/useAlarmRinger";
import { formatClock, pad } from "./utils";
import { removeBackground } from "./images";
import useImageUrl from "./hooks/useImageUrl";
import useActiveUserId from "./hooks/useActiveUserId";
import { effects, hydrateDesign, serializeDesign, themeFromChoice } from "./themes";

const startAlarms = [];

const startSettings = {
  theme: null,
  design: serializeDesign({ color: "#fa86c4", accent: "#449793", effect: effects[2], animation: false }),
};

const mainTabs = ["/alarmer", "/stopur", "/tidtagninger", "/rediger"];

function themeStyle(theme) {
  if (!theme) return {};
  return {
    "--bg": theme.color,
    "--bg-image": theme.particles || !theme.background ? "none" : `url("${theme.background}")`,
    "--dark": theme.dark,
    "--card": theme.card,
    "--nav": theme.nav,
    "--accent": theme.accent,
    ...(theme.cover && { "--bg-size": "cover", "--bg-position": "center" }),
    ...(theme.onAccent && { "--on-accent": theme.onAccent }),
    ...(theme.navActive && { "--nav-active": theme.navActive }),
    ...(theme.navActiveText && { "--nav-active-text": theme.navActiveText }),
  };
}

export default function App() {
  const { user, loading } = useAuth();
  const userId = useActiveUserId(user, loading);

  // key starter alt forfra, når en anden bruger kommer ind
  return <AppContent key={userId || "ingen"} userId={userId || "ingen"} />;
}

function AppContent({ userId }) {
  const [alarms, setAlarms] = useStoredState(`ur-alarms-${userId}`, startAlarms);
  const alarmRinger = useAlarmRinger(alarms, setAlarms);
  const timer = useTimer(userId);
  const stopwatch = useStopwatch();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const [settings, setSettings] = useStoredState(`ur-settings-${userId}`, startSettings);
  const activeImage = settings.theme && settings.theme.own ? settings.theme.own.image : null;
  const design = hydrateDesign(settings.design);
  const theme = themeFromChoice(settings.theme, useImageUrl(activeImage));
  const designImageUrl = useImageUrl(design.image);

  function setDesign(newDesign) {
    setSettings((old) => ({ ...old, design: serializeDesign(newDesign) }));
  }

  function setTheme(newTheme) {
    let choice = null;
    if (newTheme && newTheme.name === "Eget design") choice = { own: serializeDesign(design) };
    else if (newTheme) choice = { preset: newTheme.name };
    setSettings((old) => ({ ...old, theme: choice }));

    const newImage = choice && choice.own ? choice.own.image : null;
    if (activeImage && activeImage !== newImage && activeImage !== design.image) removeBackground(activeImage);
  }

  let className = "app";
  if (theme) className += " themed";
  if (theme && theme.darkText) className += " dark-text";
  const particles = theme ? theme.particles : null;
  if (theme && theme.animation && !particles) className += " animated";

  return (
    <div className={className} style={themeStyle(theme)}>
      {particles && <Floating kind={particles} still={!theme.animation} />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Navigate to="/alarmer" />} />
          <Route path="/alarmer" element={<AlarmsPage alarms={alarms} setAlarms={setAlarms} />} />
          <Route path="/stopur" element={<StopwatchPage stopwatch={stopwatch} />} />
          <Route path="/tidtagninger" element={<TimersPage timer={timer} />} />
          <Route path="/rediger" element={<ThemePage theme={theme} setTheme={setTheme} />} />
          <Route path="/rediger/farver" element={<ColorsPage design={design} setDesign={setDesign} imageUrl={designImageUrl} activeImage={activeImage} />} />
          <Route
            path="/rediger/detaljer"
            element={
              <DetailsPage
                design={design}
                setDesign={setDesign}
                setTheme={setTheme}
                activeImage={activeImage}
              />
            }
          />
        </Route>
      </Routes>
      {user && <Navbar />}
      {user && mainTabs.includes(location.pathname) && <ProfileButton onSignOut={signOut} />}

      {alarmRinger.ringing && (
        <RingOverlay
          title={pad(alarmRinger.ringing.hour) + "." + pad(alarmRinger.ringing.minute)}
          text={alarmRinger.ringing.description}
          onStop={alarmRinger.stop}
          onSnooze={alarmRinger.ringing.snooze ? alarmRinger.snooze : undefined}
        />
      )}

      {!alarmRinger.ringing && timer.status === "done" && location.pathname !== "/tidtagninger" && (
        <RingOverlay
          title={formatClock(Math.round(timer.totalMs / 1000))}
          text={timer.description + " færdig"}
          onStop={timer.cancel}
        />
      )}
    </div>
  );
}
