import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { supabaseReady } from "../../../supabase";
import styles from "./LoginPage.module.css";

const errorTexts = {
  "Invalid login credentials": "Forkert e-mail eller adgangskode",
  "User already registered": "Der findes allerede en bruger med den e-mail",
  "Email not confirmed": "Bekræft din e-mail først (tjek din indbakke)",
};

export default function LoginPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/alarmer";

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (!loading && user) return <Navigate to={from} replace />;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");

    const { data, error } = mode === "login" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);

    if (error) {
      setError(errorTexts[error.message] || error.message);
    } else if (mode === "signup" && !data.session) {
      setInfo("Tjek din indbakke og bekræft din e-mail. Log derefter ind.");
      setMode("login");
    } else {
      navigate(from, { replace: true });
    }
  }

  function switchMode() {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setInfo("");
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{mode === "login" ? "Log ind" : "Opret bruger"}</h1>
      <p className={styles.text}>Dine designs gemmes på din konto, så kun du kan se dem.</p>

      {!supabaseReady ? (
        <p className={styles.error}>Login er ikke sat op endnu. Tilføj Supabase-nøgler i .env (se .env.example).</p>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          <input
            className={styles.input}
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Adgangskode"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className={styles.error}>{error}</p>}
          {info && <p className={styles.info}>{info}</p>}

          <button className={`pill-button orange-button ${styles.submit}`} type="submit" disabled={busy}>
            {mode === "login" ? "Log ind" : "Opret"}
          </button>
          <button className={styles.switch} type="button" onClick={switchMode}>
            {mode === "login" ? "Ingen bruger? Opret en" : "Har du en bruger? Log ind"}
          </button>
        </form>
      )}
    </main>
  );
}
