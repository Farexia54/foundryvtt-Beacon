import type { UserConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";
const path = require("path");

const config: UserConfig = {
  root: "src/",
  base: "/systems/Beacon/",
  publicDir: path.resolve(__dirname, "public"),
  server: {
    port: 30001,
    open: true,
    proxy: {
      "^(?!/systems/Beacon)": "http://localhost:30000/",
      "/socket.io": {
        target: "ws://localhost:30000",
        ws: true,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "./runtimeConfig",
        replacement: "./runtimeConfig.browser",
      },
    ],
  },
  optimizeDeps: {
    exclude: ["machine-mind"], // machine-mind triggers https://github.com/evanw/esbuild/issues/1433
    include: ["Beacon-data", "jszip", "axios", "readonly-proxy"], // machine-mind's cjs dependencies
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap: true,
    brotliSize: true,
    terserOptions: {
      mangle: false,
      keep_classnames: true,
      keep_fnames: true,
    },
    lib: {
      name: "Beacon",
      entry: path.resolve(__dirname, "src/Beacon.ts"),
      formats: ["es"],
      fileName: "Beacon",
    },
  },
  plugins: [
    svelte({
      configFile: "../svelte.config.cjs", // relative to src/
    }),
    checker({
      typescript: true,
      // svelte: { root: __dirname },
    }),
    visualizer({
      gzipSize: true,
      template: "treemap",
    }),
  ],
};

export default config;
