import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
      },
      name: "interpreter",
    },
    sourcemap: true,
    target: "esnext",
    emptyOutDir: true,
    reportCompressedSize: true,
  },
  plugins: [dts()],
});
