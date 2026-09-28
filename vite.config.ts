import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: { actjs: "/src/index.ts" },
  },
  server: {
    open: "/examples/basic/",
  },
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    copyPublicDir: false,
  },
});
