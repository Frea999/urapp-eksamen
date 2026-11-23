import { NavLink } from "react-router";
import styles from "./Navbar.module.css";

// Ikonerne er kopieret fra Figma som SVG.
// "currentColor" er tekstfarven, så ikonet skifter farve sammen med teksten (og temaet).
// "var(--icon-cut)" er navbarens baggrundsfarve, så det ligner der er skåret streger ud af ikonet.

function AlarmIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M12.6214 23.5625C17.8493 23.5625 22.0874 19.1973 22.0874 13.8125C22.0874 8.42772 17.8493 4.0625 12.6214 4.0625C7.39342 4.0625 3.15534 8.42772 3.15534 13.8125C3.15534 19.1973 7.39342 23.5625 12.6214 23.5625Z"
        fill="currentColor"
        stroke="currentColor"
      />
      <path d="M12.6214 7.3125V14.625H7.09952" stroke="var(--icon-cut)" />
      <path
        d="M5.52185 23.5625L3.94418 25.1875M19.7209 23.5625L21.2985 25.1875M2.36651 5.6875C2.36651 2.4375 3.94418 1.35417 7.09952 2.4375M18.1432 2.4375C21.2985 1.35417 22.8762 2.4375 22.8762 5.6875"
        stroke="currentColor"
      />
    </svg>
  );
}

function StopwatchIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M13 24.375C18.3848 24.375 22.75 20.0098 22.75 14.625C22.75 9.24022 18.3848 4.875 13 4.875C7.61522 4.875 3.25 9.24022 3.25 14.625C3.25 20.0098 7.61522 24.375 13 24.375Z"
        fill="currentColor"
        stroke="currentColor"
      />
      <path d="M13 7.3125V14.625" stroke="var(--icon-cut)" />
      <path
        d="M13.8125 14.625C13.8125 15.0737 13.4487 15.4375 13 15.4375C12.5513 15.4375 12.1875 15.0737 12.1875 14.625C12.1875 14.1763 12.5513 13.8125 13 13.8125C13.4487 13.8125 13.8125 14.1763 13.8125 14.625Z"
        stroke="var(--icon-cut)"
      />
      <path d="M13 1.625V4.875M21.125 4.0625L18.6875 6.5" stroke="currentColor" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg width="25" height="26" viewBox="0 0 25 26" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M4.59906 6.49998C3.20805 8.3895 2.46463 10.7243 2.49092 13.1209C2.51722 15.5175 3.31166 17.8333 4.74376 19.688C6.17586 21.5427 8.16046 22.826 10.3716 23.3271C12.5827 23.8282 14.8888 23.5173 16.9112 22.4454C18.9336 21.3736 20.5519 19.6045 21.5004 17.4289C22.4489 15.2532 22.6711 12.8003 22.1306 10.473C21.5901 8.14577 20.3189 6.08257 18.526 4.62232C16.733 3.16208 14.5248 2.39161 12.2642 2.43748V6.49998M12.2642 13L6.89859 8.12498"
        stroke="currentColor"
      />
      <path d="M12.2642 10.5625L9.19812 9.75L10.7311 13.8125L12.2642 10.5625Z" fill="currentColor" stroke="currentColor" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path
        d="M21.4785 11.6445L8.67285 24.4014L2.00293 25.9375C1.88742 25.95 1.77079 25.95 1.65527 25.9375C1.40725 25.936 1.16268 25.8786 0.939453 25.7705C0.716342 25.6624 0.520139 25.5061 0.365234 25.3125C0.210311 25.1188 0.100446 24.8928 0.0439453 24.6514C-0.0125431 24.4098 -0.0149024 24.1584 0.0380859 23.916L1.57422 17.2871L14.332 4.51367L21.4785 11.6445ZM19.5547 0C19.9968 0.000106836 20.4209 0.175544 20.7344 0.487305L25.5049 5.25781C25.6609 5.41262 25.7852 5.59706 25.8701 5.7998C25.955 6.00262 25.9993 6.22058 26 6.44043C26.0007 6.66032 25.9576 6.87863 25.874 7.08203C25.7905 7.28531 25.6677 7.47015 25.5127 7.62598L22.8604 10.2773L15.7227 3.13965L18.374 0.487305C18.6876 0.175396 19.1124 0 19.5547 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/alarmer" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
        <AlarmIcon />
        Alarmer
      </NavLink>

      <NavLink to="/stopur" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
        <StopwatchIcon />
        Stopur
      </NavLink>

      <NavLink to="/tidtagninger" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
        <TimerIcon />
        Tidtagninger
      </NavLink>

      <NavLink to="/rediger" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
        <EditIcon />
        Rediger
      </NavLink>
    </nav>
  );
}
