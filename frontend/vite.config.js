import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: isProduction
            ? "http://localhost:5000" // Dockerized backend in production
            : "http://localhost:5000", // Local backend during development
          changeOrigin: true,
          secure: false,
        },
      },
      host: true,
      port: 5173,
    },
    build: {
      outDir: "dist", // Ensure correct output directory
    },
  };
});
