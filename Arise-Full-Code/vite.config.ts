import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Electron loads the renderer from a file:// URL in production, so all
// asset paths must be relative rather than absolute.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
