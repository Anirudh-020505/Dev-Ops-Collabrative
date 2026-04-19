import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    preview: {
      allowedHosts: [".onrender.com", "localhost", "127.0.0.1"],
    },
  },
});
