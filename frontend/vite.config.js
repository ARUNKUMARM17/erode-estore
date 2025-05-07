import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "https://erode-estore.onrender.com",
      "/uploads/": "https://erode-estore.onrender.com",
    },
  },
});
