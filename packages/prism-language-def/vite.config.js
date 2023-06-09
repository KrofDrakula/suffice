import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ command }) => {
  if (command == "serve") return {};
  return {
    build: {
      lib: {
        entry: {
          index: resolve(__dirname, "src/index.ts"),
        },
        name: "prism-lanugage-def",
      },
      sourcemap: true,
      target: "esnext",
      emptyOutDir: true,
      reportCompressedSize: true,
      rollupOptions: {
        external: ["prismjs"],
      },
    },
    plugins: [dts()],
  };
});
