import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Unocss from "unocss/vite";
import { join, resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "./docs",
  },
  plugins: [
    react(),
    Unocss({
      configFile: resolve(__dirname, "uno.config.ts"),
    }),
    createSvgIconsPlugin({
      iconDirs: [join(__dirname, "public/svg")],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "~/": resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
