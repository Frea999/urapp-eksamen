# Ur-app

Mobilapp bygget med [React](https://react.dev) og [Vite](https://vite.dev). Al styling er i CSS Modules (`*.module.css`), ikke Tailwind.

Appen er kun til mobil: indholdet bliver aldrig bredere end en telefon (`--app-max-width` i `src/index.css`). På en computer vises den som en telefonbred kolonne midt på skærmen.

## Kom i gang

```bash
npm install
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000).

## Hvad appen kan

- **Alarmer**: tilføj, redigér, slå til/fra og slet alarme (også med gentagelse på ugedage). Alarmen ringer med lyd, når klokken når tiden, og kan sættes på snooze. Alarmerne huskes i browseren.
- **Stopur**: starter, stopper og tager rundetider (hurtigste og langsomste runde farves).
- **Tidtagninger**: vælg tid med hjulene (swipe, træk, musehjul, klik eller piletaster). Når man trykker start, bliver hjulene til en nedtælling samme sted. Den kan sættes på pause og kører videre, selvom man skifter fane. Når tiden er gået, ringer den.
- **Rediger**: vælg eller lav et tema.

Alarmer, stopur og tidtagning ligger i `src/hooks/`, så de ikke stopper, når man skifter side. Lydene ligger i `src/assets/sounds/` og bruges via `src/sound.js`.

## Login (Supabase)

Login bruger [Supabase](https://supabase.com). Man skal være logget ind for at bruge appen. Den runde profil-knap øverst til venstre har "Log ud".

1. Opret et projekt på supabase.com.
2. Kopiér `.env.example` til `.env` og udfyld `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` (Project Settings -> API). Brug aldrig `service_role`-nøglen i appen.
3. Kør `supabase/schema.sql` i Supabase SQL Editor. Det opretter tabellen `designs` og den private bucket `design-images`, begge med Row Level Security, så hver bruger kun kan se sine egne data. Billeder skal gemmes som `<bruger-id>/<filnavn>`.
4. Til deploy: læg de to værdier som repository secrets i GitHub (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), og tilføj GitHub Pages-adressen under Authentication -> URL Configuration i Supabase.

Under "Design selv" → Baggrund kan man vælge "Vælg et billede" som baggrund. Billedet gøres mindre (`src/images.js`) og uploades til den private bucket `design-images` i brugerens egen mappe. Kun den bruger kan hente det.

Klienten ligger i `src/supabase.js`, og login-tilstanden i `src/hooks/useAuth.jsx`.

## Mapper

Hver komponent og side ligger i sin egen mappe sammen med sin `*.module.css`. Mapperne er samlet efter tema:

- `src/features/alarms/`, `stopwatch/`, `timers/`: de tre faner
- `src/features/design/`: temaer, "Design selv", farvevælger og de flydende former
- `src/features/account/`: login, profil-knap og beskyttelse af siderne
- `src/components/`: det der bruges på tværs, fx navbar, vinduer, kontakt og hjul
- `src/hooks/`: logik der ligger uden for siderne

## Scripts

- `npm run dev`: starter udviklingsserveren
- `npm run build`: bygger til `dist/`
- `npm run preview`: viser det byggede resultat
- `npm run lint`: kører ESLint

## Deploy

Appen deployes automatisk til GitHub Pages, når der pushes til `main` (se `.github/workflows/deploy.yml`).
Den ligger på [frea999.github.io/urapp-eksamen](https://frea999.github.io/urapp-eksamen/).
