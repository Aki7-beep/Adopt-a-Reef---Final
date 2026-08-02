import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/** Folder name under XAMPP htdocs — change if you use a different path */
const APP_BASE = process.env.VITE_APP_BASE || "/";

export default defineConfig({
  plugins: [react()],
  base: APP_BASE,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@shared/schema": path.resolve(import.meta.dirname, "src/types/schema.ts"),
    },
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      [`^${APP_BASE.replace(/\/$/, "")}/api`]: {
        target: process.env.VITE_PHP_PROXY || "http://127.0.0.1:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(new RegExp(`^${APP_BASE.replace(/\/$/, "")}/api`), ""),
      },
    },
  },
});
