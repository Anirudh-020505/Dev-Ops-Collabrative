import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackStart(),
    tsConfigPaths(),
    tailwindcss(),
  ],
  build: {
    outDir: "dist/client",
    sourcemap: false,
    minify: "esbuild",
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
