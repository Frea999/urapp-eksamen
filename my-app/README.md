# my-app

Mobilapp bygget med [React](https://react.dev) og [Vite](https://vite.dev). Al styling er i CSS Modules (`*.module.css`), ikke Tailwind.

Appen er kun til mobil: indholdet bliver aldrig bredere end en telefon (`--app-max-width` i `src/index.css`). På en computer vises den som en telefonbred kolonne midt på skærmen.

## Kom i gang

```bash
npm install
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev`: starter udviklingsserveren
- `npm run build`: bygger til `dist/`
- `npm run preview`: viser det byggede resultat
- `npm run lint`: kører ESLint
