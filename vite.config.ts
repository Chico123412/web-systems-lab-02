import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/web-systems-lab-02/" : "/",

  server: {
    port: 9000,
    open: true
  },

  preview: {
    port: 9000,
    open: true
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true
  }
}));
