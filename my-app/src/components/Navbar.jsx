import { NavLink } from "react-router";
import styles from "./Navbar.module.css";
import alarmIcon from "../assets/icons/alarm-inactive.svg";
import alarmIconActive from "../assets/icons/alarm-active.svg";
import stopwatchIcon from "../assets/icons/stopwatch-inactive.svg";
import stopwatchIconActive from "../assets/icons/stopwatch-active.svg";
import timerIcon from "../assets/icons/timer-inactive.svg";
import timerIconActive from "../assets/icons/timer-active.svg";
import editIcon from "../assets/icons/edit.svg";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/alarmer" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
        {({ isActive }) => (
          <>
            <img src={isActive ? alarmIconActive : alarmIcon} alt="" />
            Alarmer
          </>
        )}
      </NavLink>

      <NavLink to="/stopur" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
        {({ isActive }) => (
          <>
            <img src={isActive ? stopwatchIconActive : stopwatchIcon} alt="" />
            Stopur
          </>
        )}
      </NavLink>

      <NavLink to="/tidtagninger" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
        {({ isActive }) => (
          <>
            <img src={isActive ? timerIconActive : timerIcon} alt="" />
            Tidtagninger
          </>
        )}
      </NavLink>

      <NavLink to="/rediger" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
        <img src={editIcon} alt="" className={styles.editIcon} />
        Rediger
      </NavLink>
    </nav>
  );
}
