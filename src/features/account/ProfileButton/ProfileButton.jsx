import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import styles from "./ProfileButton.module.css";

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="8" r="4.5" />
      <path d="M3.5 21c0-4.4 3.8-7 8.5-7s8.5 2.6 8.5 7z" />
    </svg>
  );
}

export default function ProfileButton({ onSignOut }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={`circle-button ${styles.button}`}
        onClick={() => setOpen(!open)}
        aria-label="Profil"
        aria-expanded={open}
      >
        <ProfileIcon />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <p className={styles.email}>{user.email}</p>
          <button className={styles.logout} role="menuitem" onClick={onSignOut}>
            Log ud
          </button>
        </div>
      )}
    </div>
  );
}
