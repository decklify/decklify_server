import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  server: {
    proxy: {
      "/": "http://localhost:8000",
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  resolve: {
    alias: { $lib: "/src/lib" },
  },
  base: "/ui",
});
