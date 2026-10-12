import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server forwards /api requests to the backend.
const apiUrl = process.env.API_URL || "http://localhost:4000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: { "/api": apiUrl },
  },
  test: {
    include: ["tests/**/*.test.{js,jsx}"],
    environment: "jsdom",
    setupFiles: ["tests/setup.js"],
  },
});
