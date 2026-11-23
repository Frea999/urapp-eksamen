import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // På GitHub Pages (og npm run preview) ligger siden på /urapp-eksamen/, men med npm run dev ligger den på /
  base: command === "build" || isPreview ? "/urapp-eksamen/" : "/",
  server: { port: 3000 },
}));
